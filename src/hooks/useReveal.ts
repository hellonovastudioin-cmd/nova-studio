import { useEffect, useRef, useState } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useReveal<T extends HTMLElement = HTMLElement>(
  thresholdOrOptions: number | UseRevealOptions = 0.12
) {
  const threshold =
    typeof thresholdOrOptions === 'number'
      ? thresholdOrOptions
      : (thresholdOrOptions.threshold ?? 0.12);
  const rootMargin =
    typeof thresholdOrOptions === 'number'
      ? '0px 0px -48px 0px'
      : (thresholdOrOptions.rootMargin ?? '0px 0px -48px 0px');

  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    let revealed = false;
    let rafId = 0;
    let settleTimer = 0;

    let observer: IntersectionObserver | null = null;

    const cleanup = () => {
      observer?.disconnect();
      observer = null;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (settleTimer !== 0) {
        window.clearTimeout(settleTimer);
        settleTimer = 0;
      }
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setVisible(true);
      cleanup();
    };

    const checkRect = (allowInViewport: boolean) => {
      if (revealed) return;
      const rect = node.getBoundingClientRect();
      // Reveal immediately once scrolled past above the viewport, or once settled inside viewport
      if (rect.top < 0) {
        reveal();
        return;
      }
      if (allowInViewport && rect.top < window.innerHeight && rect.bottom > 0) {
        reveal();
      }
    };

    function handleScroll() {
      if (revealed) return;
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(() => {
          rafId = 0;
          checkRect(false);
        });
      }
      if (settleTimer !== 0) {
        window.clearTimeout(settleTimer);
      }
      settleTimer = window.setTimeout(() => {
        settleTimer = 0;
        checkRect(true);
      }, 140);
    }

    function handleScrollEnd() {
      checkRect(true);
    }

    // Handle initial deep-link hash loads synchronously
    if (node.getBoundingClientRect().top < 0) {
      setVisible(true);
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          reveal();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });

    return cleanup;
  }, [threshold, rootMargin]);

  return { ref, visible };
}
