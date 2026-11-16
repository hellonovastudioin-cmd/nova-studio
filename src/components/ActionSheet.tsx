import { useEffect } from 'react';
import { CreativeStudy } from './CreativePerspectiveSection';

interface ActionSheetProps {
  study: CreativeStudy | null;
  onClose: () => void;
}

export function ActionSheet({ study, onClose }: ActionSheetProps) {
  useEffect(() => {
    if (!study) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [study, onClose]);

  if (!study) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-sheet-title"
      className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border border-white/15 bg-[#141417] text-[#f5f3ee] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#d6b98c] mb-1.5">
              {study.index} · {study.lens}
            </p>
            <h2
              id="action-sheet-title"
              className="font-[family-name:var(--font-display)] text-[30px] sm:text-[34px] leading-tight font-normal text-[#f5f3ee]"
            >
              {study.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close creative study"
            className="inline-flex items-center justify-center w-11 h-11 -mr-1.5 -mt-1.5 rounded-full border border-white/15 text-[#f5f3ee] hover:border-[#d6b98c] hover:text-[#d6b98c] transition-colors duration-200 cursor-pointer shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 2L10 10M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="text-[15px] text-[#f5f3ee]/85 leading-relaxed mb-5">
          {study.summary}
        </p>

        <div className="rounded-xl border border-white/10 bg-[#0c0c0e]/85 p-5 mb-6">
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#d6b98c] mb-2">
            Treatment Notes
          </p>
          <p className="text-[14px] text-[#f5f3ee]/70 leading-relaxed">
            {study.notes}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] text-[#f5f3ee]/45">
            Internal visual concept study
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#d6b98c] text-[#0c0c0e] px-6 py-2.5 text-[13px] font-medium hover:bg-[#e3caa3] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
