"use client";

import { RotateCw, WifiOff } from "lucide-react";
import { copy } from "@/lib/i18n";
import type { Language } from "@/lib/types";

interface ErrorStateProps {
  language: Language;
  onRetry?: () => void;
}

export function ErrorState({ language, onRetry }: ErrorStateProps) {
  const text = copy[language].common;

  return (
    <div className="flex flex-col items-center justify-center rounded-[26px] border border-line bg-panel px-6 py-14 text-center shadow-card">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
        <WifiOff size={20} />
      </span>
      <h2 className="mt-4 font-display text-[23px] text-ink">{text.errorTitle}</h2>
      <p className="mt-1.5 max-w-[240px] text-[12px] leading-relaxed text-muted">
        {text.errorBody}
      </p>
      <button
        type="button"
        onClick={() => (onRetry ? onRetry() : window.location.reload())}
        className="mt-5 flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[11px] font-semibold text-canvas transition-transform active:scale-[0.97]"
      >
        <RotateCw size={13} />
        {text.retry}
      </button>
    </div>
  );
}
