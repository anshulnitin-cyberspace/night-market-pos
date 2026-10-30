"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/format";
import { usePos } from "@/lib/pos-store";

export function Toast() {
  const { toast, dismissToast } = usePos();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-[86px] z-[100] px-4"
    >
      <AnimatePresence initial={false}>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto mx-auto flex w-full max-w-[448px] items-center gap-2.5 rounded-[16px] border border-line bg-panel-strong/95 px-3.5 py-3 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.42)] backdrop-blur-xl"
          >
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full",
                toast.tone === "success"
                  ? "bg-jade/12 text-jade"
                  : "bg-accent-soft text-accent",
              )}
            >
              {toast.tone === "success" ? (
                <Check size={12} strokeWidth={2.8} />
              ) : (
                <Sparkles size={11} />
              )}
            </span>
            <p className="min-w-0 flex-1 text-[10.5px] font-medium leading-snug text-ink">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Dismiss notification"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink dark:hover:bg-white/5"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
