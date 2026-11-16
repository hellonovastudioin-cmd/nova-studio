import { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

type RevealDelay = 0 | 75 | 100 | 150 | 160 | 200 | 240 | 300;
type RevealDuration = 500 | 700 | 850 | 1000;
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  delay?: RevealDelay;
  duration?: RevealDuration;
  distance?: 'sm' | 'md' | 'lg';
  direction?: RevealDirection;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

const DELAY_CLASSES: Record<RevealDelay, string> = {
  0: 'delay-0',
  75: 'delay-75',
  100: 'delay-100',
  150: 'delay-150',
  160: 'delay-[160ms]',
  200: 'delay-200',
  240: 'delay-[240ms]',
  300: 'delay-300',
};

const DURATION_CLASSES: Record<RevealDuration, string> = {
  500: 'duration-500',
  700: 'duration-700',
  850: 'duration-[850ms]',
  1000: 'duration-1000',
};

const HIDDEN_TRANSFORMS: Record<RevealDirection, Record<'sm' | 'md' | 'lg', string>> = {
  up: {
    sm: 'translate-y-4',
    md: 'translate-y-6',
    lg: 'translate-y-8',
  },
  down: {
    sm: '-translate-y-4',
    md: '-translate-y-6',
    lg: '-translate-y-8',
  },
  left: {
    sm: 'translate-x-4',
    md: 'translate-x-7',
    lg: 'translate-x-10',
  },
  right: {
    sm: '-translate-x-4',
    md: '-translate-x-7',
    lg: '-translate-x-10',
  },
  none: {
    sm: 'translate-y-0',
    md: 'translate-y-0',
    lg: 'translate-y-0',
  },
};

export function Reveal({
  children,
  delay = 0,
  duration = 700,
  distance = 'md',
  direction = 'up',
  threshold = 0.1,
  rootMargin = '0px 0px -48px 0px',
  className = '',
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold, rootMargin });
  const hiddenClass = `opacity-0 ${HIDDEN_TRANSFORMS[direction][distance]}`;
  const visibleClass = 'opacity-100 translate-x-0 translate-y-0';

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none ${DURATION_CLASSES[duration]} ${DELAY_CLASSES[delay]} ${
        visible ? visibleClass : hiddenClass
      } ${className}`}
    >
      {children}
    </div>
  );
}
