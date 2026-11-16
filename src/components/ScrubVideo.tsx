import { useEffect, useRef, useState } from 'react';

// Exclude blink frames (indices 10-17 and 48-57) so character never blinks mid-scrub
const ACTIVE_FRAMES: number[] = [
  ...Array.from({ length: 10 }, (_, i) => i), // 0..9
  ...Array.from({ length: 30 }, (_, i) => i + 18), // 18..47
  ...Array.from({ length: 39 }, (_, i) => i + 58), // 58..96
];
const TOTAL_FRAMES = ACTIVE_FRAMES.length;
const INTERACTIVE_SELECTOR = 'button, a, h1, h2, h3, p, [role="button"]';
const INITIAL_PROGRESS = 0.14;
const INITIAL_FRAME_INDEX = Math.round(INITIAL_PROGRESS * (TOTAL_FRAMES - 1));
const MAX_CONCURRENT_LOADS = 8;

// Reachable mobile scroll range: [0.14, 0.56] -> active indices 11..44 (34 frames)
const MOBILE_MIN_FRAME_INDEX = INITIAL_FRAME_INDEX; // 11
const MOBILE_MAX_FRAME_INDEX = Math.round(0.56 * (TOTAL_FRAMES - 1)); // 44
const MOBILE_CONCURRENT_LOADS = 2;
const MOBILE_LRU_DEFAULT_LIMIT = 12;
const MOBILE_LRU_LOW_MEMORY_LIMIT = 8;
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

type FrameDrawable = ImageBitmap | HTMLImageElement;

function getIsFinePointer(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getMobileLruLimit(): number {
  if (typeof navigator === 'undefined') {
    return MOBILE_LRU_DEFAULT_LIMIT;
  }
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof deviceMemory === 'number' && deviceMemory > 0 && deviceMemory <= 4) {
    return MOBILE_LRU_LOW_MEMORY_LIMIT;
  }
  return MOBILE_LRU_DEFAULT_LIMIT;
}

function closeIfImageBitmap(frame: FrameDrawable | null | undefined): void {
  if (frame && typeof ImageBitmap !== 'undefined' && frame instanceof ImageBitmap) {
    frame.close();
  }
}

function getFrameUrl(activeIndex: number): string {
  const frameNumber = ACTIVE_FRAMES[activeIndex] + 1;
  const num = String(frameNumber).padStart(3, '0');
  return `/assets/frames/frame_${num}.webp`;
}

function getFrameDimensions(frame: FrameDrawable): { w: number; h: number } {
  if (frame instanceof HTMLImageElement) {
    return { w: frame.naturalWidth, h: frame.naturalHeight };
  }
  return { w: frame.width, h: frame.height };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function damp(current: number, target: number, speed: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-speed * dt));
}

export function ScrubVideo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(FrameDrawable | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const [isFinePointer, setIsFinePointer] = useState<boolean>(getIsFinePointer);

  // Target values updated by input events
  const targetProgressRef = useRef<number>(INITIAL_PROGRESS);
  const targetZoomRef = useRef<number>(1);
  const targetLeanXRef = useRef<number>(0);
  const targetLeanYRef = useRef<number>(0);
  const targetScrollOffsetYRef = useRef<number>(0);
  const scrollImpulseRef = useRef<number>(0);

  // Fast, responsive damped values
  const currentProgressRef = useRef<number>(INITIAL_PROGRESS);
  const currentZoomRef = useRef<number>(1);
  const currentLeanXRef = useRef<number>(0);
  const currentLeanYRef = useRef<number>(0);
  const currentScrollOffsetYRef = useRef<number>(0);

  const lastScrollYRef = useRef<number>(0);
  const lastDrawnRef = useRef<{
    frameIdx: number;
    zoom: number;
    leanX: number;
    leanY: number;
    scrollY: number;
  }>({ frameIdx: -1, zoom: 1, leanX: 0, leanY: 0, scrollY: 0 });
  const needsRedrawRef = useRef<boolean>(true);
  const dprRef = useRef<number>(1);

  // Mobile LRU & scheduler bridges shared between loader and render effects
  const activeDrawnIdxRef = useRef<number>(-1);
  const lastDrawnResolvedIdxRef = useRef<number>(-1);
  const scheduleRenderRef = useRef<(() => void) | null>(null);
  const requestMobileWindowRef = useRef<((centerIdx: number) => void) | null>(null);
  const touchMobileLruRef = useRef<((idx: number) => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia(FINE_POINTER_QUERY);
    setIsFinePointer(mql.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsFinePointer(event.matches);
    };

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange);
      return () => mql.removeEventListener('change', handleChange);
    }
    mql.addListener(handleChange);
    return () => mql.removeListener(handleChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadFrameDrawable = async (index: number): Promise<FrameDrawable | null> => {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.decoding = 'async';
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error(`Failed to load frame ${index}`));
        el.src = getFrameUrl(index);
      });

      if (cancelled) return null;

      if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(img);
        if (cancelled) {
          bitmap.close();
          return null;
        }
        return bitmap;
      }

      if (typeof img.decode === 'function') {
        await img.decode().catch(() => {});
      }
      if (cancelled) return null;
      return img;
    };

    const cleanupFrames = () => {
      activeDrawnIdxRef.current = -1;
      lastDrawnResolvedIdxRef.current = -1;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const frame = framesRef.current[i];
        framesRef.current[i] = null;
        loadedRef.current[i] = false;
        closeIfImageBitmap(frame);
      }
    };

    const notifyFrameLoaded = (decodedIdx: number) => {
      const requestedIdx = lastDrawnRef.current.frameIdx;
      const resolvedIdx = lastDrawnResolvedIdxRef.current;
      if (
        requestedIdx === -1 ||
        resolvedIdx === -1 ||
        resolvedIdx !== requestedIdx ||
        decodedIdx === requestedIdx
      ) {
        needsRedrawRef.current = true;
        scheduleRenderRef.current?.();
      }
    };

    if (isFinePointer) {
      // Desktop: preserve full 79-frame radial loading with 8 concurrent workers
      const queued = new Set<number>();
      const queue: number[] = [];
      const enqueue = (idx: number) => {
        if (idx >= 0 && idx < TOTAL_FRAMES && !queued.has(idx)) {
          queued.add(idx);
          queue.push(idx);
        }
      };

      enqueue(INITIAL_FRAME_INDEX);
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        enqueue(INITIAL_FRAME_INDEX + offset);
        enqueue(INITIAL_FRAME_INDEX - offset);
      }

      let cursor = 0;

      const decodeNext = async () => {
        while (!cancelled && cursor < queue.length) {
          const index = queue[cursor++];
          try {
            const drawable = await loadFrameDrawable(index);
            if (cancelled || !drawable) return;

            const prev = framesRef.current[index];
            framesRef.current[index] = drawable;
            loadedRef.current[index] = true;
            if (prev && prev !== drawable) {
              closeIfImageBitmap(prev);
            }
            notifyFrameLoaded(index);
          } catch {
            // Skip failed frame without stalling the remaining queue
          }
        }
      };

      const workers = Array.from({ length: MAX_CONCURRENT_LOADS }, () => decodeNext());
      void Promise.all(workers);

      return () => {
        cancelled = true;
        cleanupFrames();
      };
    }

    // Mobile / coarse-pointer: progressive 2-phase loading within [11..44] + bounded LRU cache
    const lruLimit = getMobileLruLimit();
    const lruOrder: number[] = [];
    const inFlight = new Set<number>();
    const pendingQueue: number[] = [];
    const queuedSet = new Set<number>();
    let activeWorkers = 0;
    let restingPhaseComplete = false;
    let desiredCenterIdx = clamp(
      Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)),
      MOBILE_MIN_FRAME_INDEX,
      MOBILE_MAX_FRAME_INDEX
    );

    const touchLru = (idx: number) => {
      const existingPos = lruOrder.indexOf(idx);
      if (existingPos !== -1) {
        lruOrder.splice(existingPos, 1);
      }
      lruOrder.push(idx);
    };

    const evictOldestUnpinned = (): boolean => {
      const evictPos = lruOrder.findIndex(
        (candidate) =>
          candidate !== INITIAL_FRAME_INDEX &&
          candidate !== activeDrawnIdxRef.current
      );
      if (evictPos === -1) return false;

      const [evictedIdx] = lruOrder.splice(evictPos, 1);
      loadedRef.current[evictedIdx] = false;
      const evictedFrame = framesRef.current[evictedIdx];
      framesRef.current[evictedIdx] = null;
      closeIfImageBitmap(evictedFrame);
      return true;
    };

    const reserveCapacityForDecode = (): boolean => {
      while (lruOrder.length + inFlight.size >= lruLimit) {
        if (!evictOldestUnpinned()) {
          return false;
        }
      }
      return true;
    };

    const evictIfNeeded = () => {
      while (lruOrder.length > lruLimit) {
        if (!evictOldestUnpinned()) break;
      }
    };

    const storeMobileFrame = (idx: number, drawable: FrameDrawable) => {
      const prev = framesRef.current[idx];
      framesRef.current[idx] = drawable;
      loadedRef.current[idx] = true;
      if (prev && prev !== drawable) {
        closeIfImageBitmap(prev);
      }
      touchLru(idx);
      evictIfNeeded();
      notifyFrameLoaded(idx);
    };

    const computeWindowIndices = (centerIdx: number): number[] => {
      const clampedCenter = clamp(
        centerIdx,
        MOBILE_MIN_FRAME_INDEX,
        MOBILE_MAX_FRAME_INDEX
      );
      const maxRadius = Math.max(
        clampedCenter - MOBILE_MIN_FRAME_INDEX,
        MOBILE_MAX_FRAME_INDEX - clampedCenter
      );
      const targetBudget = Math.max(1, lruLimit - 1);
      const selected: number[] = [];

      const pushIfValid = (idx: number) => {
        if (
          idx >= MOBILE_MIN_FRAME_INDEX &&
          idx <= MOBILE_MAX_FRAME_INDEX &&
          selected.length < targetBudget &&
          !selected.includes(idx)
        ) {
          selected.push(idx);
        }
      };

      pushIfValid(clampedCenter);
      for (let offset = 1; offset <= maxRadius && selected.length < targetBudget; offset++) {
        pushIfValid(clampedCenter + offset);
        pushIfValid(clampedCenter - offset);
      }
      return selected;
    };

    const pumpWorkers = () => {
      if (cancelled || !restingPhaseComplete) return;

      while (activeWorkers < MOBILE_CONCURRENT_LOADS && pendingQueue.length > 0) {
        const nextIdx = pendingQueue.shift();
        if (nextIdx === undefined) break;
        queuedSet.delete(nextIdx);

        if (loadedRef.current[nextIdx] || inFlight.has(nextIdx)) {
          continue;
        }

        // Reserve cache slot BEFORE starting decode so live + in-flight never exceeds lruLimit
        if (!reserveCapacityForDecode()) {
          pendingQueue.unshift(nextIdx);
          queuedSet.add(nextIdx);
          break;
        }

        inFlight.add(nextIdx);
        activeWorkers += 1;

        void (async () => {
          try {
            const drawable = await loadFrameDrawable(nextIdx);
            if (cancelled || !drawable) return;
            storeMobileFrame(nextIdx, drawable);
          } catch {
            // Skip failed frame without stalling remaining queue
          } finally {
            inFlight.delete(nextIdx);
            activeWorkers -= 1;
            if (!cancelled) {
              pumpWorkers();
            }
          }
        })();
      }
    };

    const enqueueMobileWindow = (centerIdx: number) => {
      desiredCenterIdx = clamp(
        centerIdx,
        MOBILE_MIN_FRAME_INDEX,
        MOBILE_MAX_FRAME_INDEX
      );
      if (cancelled || !restingPhaseComplete) return;

      const windowIndices = computeWindowIndices(desiredCenterIdx);
      const windowSet = new Set(windowIndices);

      // Discard unstarted queued frames outside the new scroll window
      for (let i = pendingQueue.length - 1; i >= 0; i--) {
        const queuedIdx = pendingQueue[i];
        if (!windowSet.has(queuedIdx)) {
          pendingQueue.splice(i, 1);
          queuedSet.delete(queuedIdx);
        }
      }

      // Add missing window frames in priority order (closest to center first)
      for (const idx of windowIndices) {
        if (loadedRef.current[idx]) {
          touchLru(idx);
          continue;
        }
        if (inFlight.has(idx) || queuedSet.has(idx)) {
          continue;
        }
        pendingQueue.push(idx);
        queuedSet.add(idx);
      }

      // Reorder pendingQueue to match window priority so immediate target loads next
      pendingQueue.sort((a, b) => windowIndices.indexOf(a) - windowIndices.indexOf(b));
      pumpWorkers();
    };

    touchMobileLruRef.current = (idx: number) => {
      if (cancelled) return;
      if (idx >= MOBILE_MIN_FRAME_INDEX && idx <= MOBILE_MAX_FRAME_INDEX) {
        touchLru(idx);
      }
    };

    requestMobileWindowRef.current = (centerIdx: number) => {
      enqueueMobileWindow(centerIdx);
    };

    // Phase 1: Decode INITIAL_FRAME_INDEX (11) alone first before starting mobile workers
    void (async () => {
      inFlight.add(INITIAL_FRAME_INDEX);
      try {
        const restingDrawable = await loadFrameDrawable(INITIAL_FRAME_INDEX);
        if (cancelled) return;
        if (restingDrawable) {
          storeMobileFrame(INITIAL_FRAME_INDEX, restingDrawable);
        }
      } catch {
        // Proceed to Phase 2 even if initial resting frame fails
      } finally {
        inFlight.delete(INITIAL_FRAME_INDEX);
      }

      if (cancelled) return;
      restingPhaseComplete = true;
      enqueueMobileWindow(desiredCenterIdx);
    })();

    return () => {
      cancelled = true;
      requestMobileWindowRef.current = null;
      touchMobileLruRef.current = null;
      pendingQueue.length = 0;
      queuedSet.clear();
      inFlight.clear();
      lruOrder.length = 0;
      cleanupFrames();
    };
  }, [isFinePointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let cachedGradTop = -1;
    let cachedGradHeight = -1;
    let cachedGrad: CanvasGradient | null = null;
    let rafId = 0;
    let isDisposed = false;
    let isLoopActive = false;
    let lastTime = performance.now();
    let lastRequestedMobileIdx = -1;

    const hasPendingInterpolation = (): boolean => {
      const effectiveScrollY =
        targetScrollOffsetYRef.current + scrollImpulseRef.current;
      return (
        scrollImpulseRef.current !== 0 ||
        currentProgressRef.current !== targetProgressRef.current ||
        currentZoomRef.current !== targetZoomRef.current ||
        currentLeanXRef.current !== targetLeanXRef.current ||
        currentLeanYRef.current !== targetLeanYRef.current ||
        currentScrollOffsetYRef.current !== effectiveScrollY
      );
    };

    const scheduleRender = () => {
      if (isDisposed || rafId !== 0 || document.hidden) return;
      if (!isLoopActive) {
        lastTime = performance.now();
      }
      rafId = window.requestAnimationFrame(renderLoop);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      dprRef.current = dpr;
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        lastDrawnRef.current.frameIdx = -1;
        lastDrawnResolvedIdxRef.current = -1;
        cachedGradTop = -1;
        needsRedrawRef.current = true;
        scheduleRender();
      }
    };

    resizeCanvas();
    lastScrollYRef.current = window.scrollY;

    const findNearestLoadedIndex = (targetIdx: number): number => {
      if (loadedRef.current[targetIdx] && framesRef.current[targetIdx]) {
        return targetIdx;
      }
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const right = targetIdx + offset;
        if (
          right < TOTAL_FRAMES &&
          loadedRef.current[right] &&
          framesRef.current[right]
        ) {
          return right;
        }
        const left = targetIdx - offset;
        if (left >= 0 && loadedRef.current[left] && framesRef.current[left]) {
          return left;
        }
      }
      return -1;
    };

    const drawFrame = (
      frameIdx: number,
      zoom: number,
      leanX: number,
      leanY: number,
      scrollOffsetY: number
    ) => {
      const resolvedIdx = findNearestLoadedIndex(frameIdx);
      if (resolvedIdx === -1) return;
      const frame = framesRef.current[resolvedIdx];
      if (!frame) return;

      activeDrawnIdxRef.current = resolvedIdx;
      lastDrawnResolvedIdxRef.current = resolvedIdx;
      if (!isFinePointer) {
        touchMobileLruRef.current?.(resolvedIdx);
      }

      const { w: fw, h: fh } = getFrameDimensions(frame);
      if (!fw || !fh) return;

      const dpr = dprRef.current;
      const cw = canvas.width;
      const ch = canvas.height;

      const isDesktop = window.innerWidth >= 1024;
      const baseScale = (ch / fh) * (isDesktop ? 0.84 : 0.75);
      const scale = baseScale * zoom;
      const drawW = fw * scale;
      const drawH = fh * scale;

      const centerRatio = isDesktop ? 0.72 : 0.54;
      const drawX = cw * centerRatio - drawW * 0.5 + leanX * dpr;
      const verticalOffset = clamp(
        (14 + (leanY + scrollOffsetY) * 0.45) * dpr,
        0,
        28 * dpr
      );
      const drawY = ch - drawH + verticalOffset;

      // Paint uniform primary red backdrop across entire viewport before frame composite
      ctx.fillStyle = '#c8040e';
      ctx.fillRect(0, 0, cw, ch);

      // Draw crisp 3D frame directly onto primary red canvas
      ctx.drawImage(frame, drawX, drawY, drawW, drawH);

      // Seamlessly feather outer pure-red frame borders into #c8040e (200, 4, 14)
      // without touching the centered character silhouette
      const leftFeatherW = drawW * 0.19;
      const leftGrad = ctx.createLinearGradient(drawX, 0, drawX + leftFeatherW, 0);
      leftGrad.addColorStop(0, 'rgba(200, 4, 14, 1)');
      leftGrad.addColorStop(0.4, 'rgba(200, 4, 14, 0.72)');
      leftGrad.addColorStop(1, 'rgba(200, 4, 14, 0)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(drawX - 2, drawY - 2, leftFeatherW + 2, drawH + 4);

      const rightStart = drawX + drawW * 0.77;
      const rightGrad = ctx.createLinearGradient(rightStart, 0, drawX + drawW, 0);
      rightGrad.addColorStop(0, 'rgba(200, 4, 14, 0)');
      rightGrad.addColorStop(0.6, 'rgba(200, 4, 14, 0.72)');
      rightGrad.addColorStop(1, 'rgba(200, 4, 14, 1)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(rightStart, drawY - 2, drawX + drawW - rightStart + 2, drawH + 4);

      if (drawY > -4) {
        const topFeatherH = Math.max(18 * scale, drawH * 0.032);
        if (
          !cachedGrad ||
          Math.abs(drawY - cachedGradTop) > 0.5 ||
          Math.abs(topFeatherH - cachedGradHeight) > 0.5
        ) {
          const grad = ctx.createLinearGradient(0, drawY, 0, drawY + topFeatherH);
          grad.addColorStop(0, 'rgba(200, 4, 14, 1)');
          grad.addColorStop(1, 'rgba(200, 4, 14, 0)');
          cachedGrad = grad;
          cachedGradTop = drawY;
          cachedGradHeight = topFeatherH;
        }
        ctx.fillStyle = cachedGrad;
        ctx.fillRect(drawX - 2, drawY - 2, drawW + 4, topFeatherH + 2);

        // Softly blend upper left & right corners radially without touching center hair
        const cornerR = drawW * 0.34;
        const tlGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, cornerR);
        tlGrad.addColorStop(0, 'rgba(200, 4, 14, 0.95)');
        tlGrad.addColorStop(0.55, 'rgba(200, 4, 14, 0.45)');
        tlGrad.addColorStop(1, 'rgba(200, 4, 14, 0)');
        ctx.fillStyle = tlGrad;
        ctx.fillRect(drawX - 2, drawY - 2, cornerR + 2, cornerR + 2);

        const trX = drawX + drawW;
        const trGrad = ctx.createRadialGradient(trX, drawY, 0, trX, drawY, cornerR);
        trGrad.addColorStop(0, 'rgba(200, 4, 14, 0.95)');
        trGrad.addColorStop(0.55, 'rgba(200, 4, 14, 0.45)');
        trGrad.addColorStop(1, 'rgba(200, 4, 14, 0)');
        ctx.fillStyle = trGrad;
        ctx.fillRect(trX - cornerR, drawY - 2, cornerR + 2, cornerR + 2);
      }

      needsRedrawRef.current = false;
      lastDrawnRef.current = { frameIdx, zoom, leanX, leanY, scrollY: scrollOffsetY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);
      const charCenterX = vw >= 1024 ? vw * 0.72 : vw * 0.54;

      targetProgressRef.current = clamp((event.clientX / vw - 0.05) / 0.9, 0, 1);

      const relX = clamp((event.clientX - charCenterX) / (vw * 0.5), -1, 1);
      const targetEl = (event.target as HTMLElement | null)?.closest(
        INTERACTIVE_SELECTOR
      ) as HTMLElement | null;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const elCenterY = rect.top + rect.height * 0.5;
        const relY = clamp((elCenterY - vh * 0.5) / (vh * 0.5), -1, 1);
        targetLeanXRef.current = relX * 14;
        targetLeanYRef.current = relY * 10;
        targetZoomRef.current = 1.03;
      } else {
        const relY = clamp((event.clientY - vh * 0.5) / (vh * 0.5), -1, 1);
        targetLeanXRef.current = relX * 7;
        targetLeanYRef.current = relY * 6;
        targetZoomRef.current = 1;
      }
      scheduleRender();
    };

    const handleMouseLeave = () => {
      targetLeanXRef.current = 0;
      targetLeanYRef.current = 0;
      targetZoomRef.current = 1;
      scheduleRender();
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const scrollProgress = clamp(scrollY / maxScroll, 0, 1);
      const deltaY = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      // Smoothly arc gaze from left -> center mid-scroll -> back toward left content at bottom
      targetProgressRef.current = clamp(
        0.14 + Math.sin(scrollProgress * Math.PI) * 0.38 + scrollProgress * 0.08,
        0,
        0.56
      );

      // Gentle vertical parallax + scroll momentum response
      targetScrollOffsetYRef.current = (0.5 - scrollProgress) * 22;
      scrollImpulseRef.current = clamp(
        scrollImpulseRef.current - deltaY * 0.12,
        -14,
        14
      );
      targetZoomRef.current = 1 + Math.sin(scrollProgress * Math.PI) * 0.024;
      scheduleRender();
    };

    if (!isFinePointer) {
      targetLeanXRef.current = 0;
      targetLeanYRef.current = 0;
      targetProgressRef.current = clamp(targetProgressRef.current, 0.14, 0.56);
    }

    function renderLoop(now: number) {
      rafId = 0;
      if (isDisposed || document.hidden) {
        isLoopActive = false;
        return;
      }
      isLoopActive = true;

      const dt = Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
      lastTime = now;

      scrollImpulseRef.current = damp(scrollImpulseRef.current, 0, 14, dt);
      if (Math.abs(scrollImpulseRef.current) < 0.02) {
        scrollImpulseRef.current = 0;
      }

      const effectiveScrollY =
        targetScrollOffsetYRef.current + scrollImpulseRef.current;

      currentProgressRef.current = damp(
        currentProgressRef.current,
        targetProgressRef.current,
        28,
        dt
      );
      if (Math.abs(currentProgressRef.current - targetProgressRef.current) < 0.0001) {
        currentProgressRef.current = targetProgressRef.current;
      }

      currentZoomRef.current = damp(
        currentZoomRef.current,
        targetZoomRef.current,
        22,
        dt
      );
      if (Math.abs(currentZoomRef.current - targetZoomRef.current) < 0.00005) {
        currentZoomRef.current = targetZoomRef.current;
      }

      currentLeanXRef.current = damp(
        currentLeanXRef.current,
        targetLeanXRef.current,
        22,
        dt
      );
      if (Math.abs(currentLeanXRef.current - targetLeanXRef.current) < 0.01) {
        currentLeanXRef.current = targetLeanXRef.current;
      }

      currentLeanYRef.current = damp(
        currentLeanYRef.current,
        targetLeanYRef.current,
        22,
        dt
      );
      if (Math.abs(currentLeanYRef.current - targetLeanYRef.current) < 0.01) {
        currentLeanYRef.current = targetLeanYRef.current;
      }

      currentScrollOffsetYRef.current = damp(
        currentScrollOffsetYRef.current,
        effectiveScrollY,
        16,
        dt
      );
      if (Math.abs(currentScrollOffsetYRef.current - effectiveScrollY) < 0.01) {
        currentScrollOffsetYRef.current = effectiveScrollY;
      }

      const frameIdx = clamp(
        Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)),
        0,
        TOTAL_FRAMES - 1
      );

      if (!isFinePointer && frameIdx !== lastRequestedMobileIdx) {
        lastRequestedMobileIdx = frameIdx;
        requestMobileWindowRef.current?.(frameIdx);
      }

      const last = lastDrawnRef.current;
      const moved =
        frameIdx !== last.frameIdx ||
        Math.abs(currentZoomRef.current - last.zoom) > 0.0003 ||
        Math.abs(currentLeanXRef.current - last.leanX) > 0.05 ||
        Math.abs(currentLeanYRef.current - last.leanY) > 0.05 ||
        Math.abs(currentScrollOffsetYRef.current - last.scrollY) > 0.05;

      if (needsRedrawRef.current || moved) {
        drawFrame(
          frameIdx,
          currentZoomRef.current,
          currentLeanXRef.current,
          currentLeanYRef.current,
          currentScrollOffsetYRef.current
        );
      }

      if (hasPendingInterpolation()) {
        scheduleRender();
      } else {
        isLoopActive = false;
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== 0) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        isLoopActive = false;
        return;
      }
      if (needsRedrawRef.current || hasPendingInterpolation()) {
        scheduleRender();
      }
    };

    scheduleRenderRef.current = scheduleRender;

    if (isFinePointer) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    scheduleRender();

    return () => {
      isDisposed = true;
      isLoopActive = false;
      scheduleRenderRef.current = null;
      if (isFinePointer) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };
  }, [isFinePointer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full bg-[#c8040e] transform-gpu will-change-transform"
    />
  );
}
