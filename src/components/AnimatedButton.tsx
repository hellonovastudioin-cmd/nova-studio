import { MouseEventHandler } from 'react';

interface AnimatedButtonBaseProps {
  label: string;
  hoverLabel?: string;
  variant?: 'dark' | 'glass' | 'light';
  iconDirection?: 'right' | 'up';
  fullWidth?: boolean;
  className?: string;
}

interface AnimatedButtonAsButton extends AnimatedButtonBaseProps {
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface AnimatedButtonAsLink extends AnimatedButtonBaseProps {
  href: string;
  type?: never;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

type AnimatedButtonProps = AnimatedButtonAsButton | AnimatedButtonAsLink;

function ArrowIcon({ direction }: { direction: 'right' | 'up' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {direction === 'up' ? (
        <path
          d="M8 12.5V3.5M4 7.5 8 3.5l4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3.5 8h9M9 4.5 12.5 8 9 11.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function AnimatedButton(props: AnimatedButtonProps) {
  const {
    label,
    hoverLabel = label,
    variant = 'dark',
    iconDirection = 'right',
    fullWidth = false,
    className = '',
  } = props;

  const isLight = variant === 'light';

  const surfaceClasses =
    variant === 'light'
      ? 'bg-white text-[#141417] border border-white/80 shadow-[0_6px_20px_rgba(0,0,0,0.18)]'
      : variant === 'glass'
        ? 'bg-white/[0.12] backdrop-blur-md border border-white/30 text-white'
        : 'bg-[#0c0c0e]/90 backdrop-blur-md border border-[#d6b98c]/45 text-[#f5f3ee]';

  // Expanding dot circle floods the pill from right to left on hover
  const fillDotColor = isLight ? 'bg-[#141417]' : 'bg-[#d6b98c]';
  const hoverTextColor = isLight ? 'text-[#f5f3ee]' : 'text-[#0c0c0e]';
  const rightCircleClasses = isLight
    ? 'bg-[#d6b98c] text-[#141417]'
    : 'bg-[#0c0c0e] text-[#f5f3ee]';

  const innerContent = (
    <>
      {/* Isolated rounded clip layer prevents border-radius clipping pops in Chromium */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          className={`absolute right-2.5 top-1/2 w-8 h-8 rounded-full ${fillDotColor} [transform:translate3d(0,-50%,0)_scale(0.3125)] will-change-transform transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:translate3d(0,-50%,0)_scale(38)] group-focus-visible:[transform:translate3d(0,-50%,0)_scale(38)] motion-reduce:transition-none motion-reduce:group-hover:[transform:translate3d(0,-50%,0)_scale(0.3125)]`}
        />
      </span>

      {/* Tilted rolling text swap (hover-only delays prevent overlap glitches on mouse leave) */}
      <span className="relative z-10 inline-grid overflow-hidden text-left leading-[1.25] py-0.5">
        <span className="col-start-1 row-start-1 will-change-[transform,opacity] transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[125%] group-hover:rotate-3 group-hover:opacity-0 group-focus-visible:translate-y-[125%] group-focus-visible:rotate-3 group-focus-visible:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:opacity-100">
          {label}
        </span>
        <span
          aria-hidden="true"
          className={`col-start-1 row-start-1 -translate-y-[125%] -rotate-3 opacity-0 ${hoverTextColor} will-change-[transform,opacity] transition-[transform,opacity] duration-[420ms] delay-0 group-hover:delay-[45ms] group-focus-visible:delay-[45ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:rotate-0 group-focus-visible:opacity-100 motion-reduce:hidden`}
        >
          {hoverLabel}
        </span>
      </span>

      {/* Right circular indicator: resting dot stays concentric, hover reveals arrow circle */}
      <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 shrink-0">
        <span
          aria-hidden="true"
          className={`w-2.5 h-2.5 rounded-full ${fillDotColor} transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0`}
        />
        <span
          aria-hidden="true"
          className={`absolute inset-0 inline-flex items-center justify-center rounded-full ${rightCircleClasses} scale-0 opacity-0 will-change-[transform,opacity] transition-[transform,opacity] duration-[380ms] delay-0 group-hover:delay-[85ms] group-focus-visible:delay-[85ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none`}
        >
          <span className="-translate-x-1.5 opacity-0 transition-[transform,opacity] duration-300 delay-0 group-hover:delay-[140ms] group-focus-visible:delay-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <ArrowIcon direction={iconDirection} />
          </span>
        </span>
      </span>
    </>
  );

  const baseClasses = `group relative isolate overflow-hidden [clip-path:inset(0_round_9999px)] min-h-[48px] inline-flex items-center ${
    fullWidth ? 'w-full justify-between' : 'justify-between gap-4'
  } rounded-full pl-6 pr-2.5 py-2 text-[13px] font-medium tracking-[0.02em] whitespace-nowrap cursor-pointer transition-transform duration-200 ease-out active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100 ${surfaceClasses} ${className}`;

  if ('href' in props && props.href !== undefined) {
    return (
      <a href={props.href} onClick={props.onClick} className={baseClasses}>
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      disabled={props.disabled}
      aria-busy={props.disabled || undefined}
      onClick={props.onClick}
      className={`${baseClasses} disabled:pointer-events-none disabled:opacity-65`}
    >
      {innerContent}
    </button>
  );
}
