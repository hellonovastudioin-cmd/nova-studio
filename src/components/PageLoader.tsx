import { useEffect, useId, useRef, useState } from 'react';

interface PageLoaderProps {
  onRevealStart: () => void;
}

type LoaderPhase = 'loading' | 'exiting' | 'done';

const WAVE_PERIOD = 480;
const WAVE_HALF = WAVE_PERIOD / 2;
const WAVE_AMP = 8;
const WAVE_CYCLES = 4;
const BEZIER_K = 0.3642;

function createPeriodicWavePath(): string {
  const parts: string[] = [`M 0 ${-WAVE_AMP}`];
  const c1 = WAVE_HALF * BEZIER_K;
  const c2 = WAVE_HALF * (1 - BEZIER_K);

  for (let i = 0; i < WAVE_CYCLES; i += 1) {
    const x0 = i * WAVE_PERIOD;
    const xMid = x0 + WAVE_HALF;
    const xEnd = x0 + WAVE_PERIOD;

    parts.push(
      `C ${(x0 + c1).toFixed(2)} ${-WAVE_AMP}, ${(x0 + c2).toFixed(2)} ${WAVE_AMP}, ${xMid} ${WAVE_AMP}`,
    );
    parts.push(
      `C ${(xMid + c1).toFixed(2)} ${WAVE_AMP}, ${(xMid + c2).toFixed(2)} ${-WAVE_AMP}, ${xEnd} ${-WAVE_AMP}`,
    );
  }

  const totalWidth = WAVE_CYCLES * WAVE_PERIOD;
  parts.push(`L ${totalWidth} 260 L 0 260 Z`);
  return parts.join(' ');
}

const STATIC_WAVE_PATH = createPeriodicWavePath();

export function PageLoader({ onRevealStart }: PageLoaderProps) {
  const clipId = useId();
  const [phase, setPhase] = useState<LoaderPhase>('loading');
  const statusRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);
  const onRevealStartRef = useRef(onRevealStart);
  onRevealStartRef.current = onRevealStart;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setPhase('done');
      if (!revealedRef.current) {
        revealedRef.current = true;
        onRevealStartRef.current();
      }
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let settleRafA = 0;
    let settleRafB = 0;
    let holdTimer = 0;
    let exitTimer = 0;

    const fillDurationMs = 2850;
    const startY = 124; // Crest at 116 (cleanly below baseline 112)
    const endY = 6; // Trough at 14 (cleanly above cap height ~21)
    const waveSpeedPxPerSec = 240;

    let virtualElapsed = 0;
    let lastNow = 0;
    let lastDisplayedPercent = 0;

    const applyFrame = (elapsedMs: number) => {
      const rawT = Math.min(elapsedMs / fillDurationMs, 1);
      // C-infinity sine ease-in-out: zero inflection kink at 50%
      const eased = -(Math.cos(Math.PI * rawT) - 1) / 2;
      const currentY = startY + (endY - startY) * eased;
      const currentX = -(((elapsedMs / 1000) * waveSpeedPxPerSec) % WAVE_PERIOD);

      if (wavePathRef.current) {
        wavePathRef.current.setAttribute(
          'transform',
          `translate(${currentX.toFixed(3)}, ${currentY.toFixed(3)})`,
        );
      }

      const rounded = Math.round(eased * 100);
      if (rounded !== lastDisplayedPercent) {
        lastDisplayedPercent = rounded;
        if (counterRef.current) {
          counterRef.current.textContent = `loading... ${rounded} %`;
        }
        if (statusRef.current && (rounded % 10 === 0 || rounded === 100)) {
          statusRef.current.setAttribute('aria-label', `Loading NOVA STUDIO ${rounded} percent`);
        }
      }

      return rawT;
    };

    const tick = (now: number) => {
      if (cancelled) return;

      if (lastNow === 0) {
        lastNow = now;
      }

      // Clamp frame delta to avoid skips from initial asset/font decoding spikes
      const dt = Math.min(Math.max(now - lastNow, 0), 32);
      lastNow = now;
      virtualElapsed += dt;

      const rawT = applyFrame(virtualElapsed);

      if (rawT < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        applyFrame(fillDurationMs);
        holdTimer = window.setTimeout(() => {
          if (cancelled) return;
          setPhase('exiting');
          if (!revealedRef.current) {
            revealedRef.current = true;
            onRevealStartRef.current();
          }

          exitTimer = window.setTimeout(() => {
            if (!cancelled) {
              setPhase('done');
            }
          }, 840);
        }, 280);
      }
    };

    const startLoop = () => {
      if (cancelled) return;
      // Yield two animation frames so initial mount and layout settle cleanly
      settleRafA = window.requestAnimationFrame(() => {
        settleRafB = window.requestAnimationFrame((ts) => {
          if (cancelled) return;
          lastNow = ts;
          rafId = window.requestAnimationFrame(tick);
        });
      });
    };

    // Wait briefly for DM Sans 800 weight so typography doesn't pop mid-fill
    const fontsReady =
      typeof document !== 'undefined' && document.fonts?.ready
        ? Promise.race([
            document.fonts.ready,
            new Promise<void>((resolve) => window.setTimeout(resolve, 220)),
          ])
        : Promise.resolve();

    fontsReady.then(startLoop);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(settleRafA);
      window.cancelAnimationFrame(settleRafB);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  if (phase === 'done') return null;

  const isExiting = phase === 'exiting';

  return (
    <div
      ref={statusRef}
      role="status"
      aria-live="polite"
      aria-label="Loading NOVA STUDIO 0 percent"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#121214] px-6 select-none overflow-hidden transition-opacity duration-[820ms] ease-[cubic-bezier(0.32,0,0.2,1)] will-change-[opacity] ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <div
        className={`w-full max-w-[min(88vw,780px)] flex flex-col items-end [backface-visibility:hidden] transition-[transform,opacity] duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
          isExiting
            ? '[transform:translate3d(0,0,0)_scale(2.9)] opacity-0'
            : '[transform:translate3d(0,0,0)_scale(1)] opacity-100'
        }`}
      >
        <svg
          viewBox="0 0 960 150"
          className="w-full h-auto block overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId}>
              <path ref={wavePathRef} d={STATIC_WAVE_PATH} transform="translate(0, 124)" />
            </clipPath>
          </defs>

          {/* Muted silhouette layer */}
          <text
            x="480"
            y="112"
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.2)"
            fontFamily="'DM Sans', 'Helvetica Neue', Arial, sans-serif"
            fontWeight="800"
            fontSize="126"
            letterSpacing="-4"
          >
            NOVA STUDIO
          </text>

          {/* Rising liquid wave white fill layer */}
          <text
            x="480"
            y="112"
            textAnchor="middle"
            fill="#ffffff"
            clipPath={`url(#${clipId})`}
            fontFamily="'DM Sans', 'Helvetica Neue', Arial, sans-serif"
            fontWeight="800"
            fontSize="126"
            letterSpacing="-4"
          >
            NOVA STUDIO
          </text>
        </svg>

        <div
          ref={counterRef}
          className={`mt-1 sm:mt-2 pr-1 text-[12px] sm:text-[13px] tracking-[0.04em] tabular-nums text-white/75 transition-opacity duration-200 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
        >
          loading... 0 %
        </div>
      </div>
    </div>
  );
}
