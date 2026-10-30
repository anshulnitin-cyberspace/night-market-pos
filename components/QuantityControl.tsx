"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/format";

interface QuantityControlProps {
  itemName: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function QuantityControl({
  itemName,
  quantity,
  onIncrease,
  onDecrease,
}: QuantityControlProps) {
  return (
    <div
      className={cn(
        "flex h-8 items-center rounded-full border p-0.5 transition-colors duration-300",
        quantity > 0 ? "border-accent/35 bg-accent-soft" : "border-line bg-panel-muted",
      )}
      aria-label={`Quantity of ${itemName}`}
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.84 }}
        aria-label={`Remove one ${itemName}`}
        disabled={quantity === 0}
        onClick={onDecrease}
        className="grid h-7 w-7 place-items-center rounded-full text-soft transition-colors hover:bg-ink/5 disabled:pointer-events-none disabled:opacity-25 dark:hover:bg-white/5"
      >
        <Minus size={12} strokeWidth={2.4} />
      </motion.button>

      <span className="relative grid h-6 w-6 place-items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantity}
            initial={{ y: 9, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -9, opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "text-[11px] font-bold tabular-nums",
              quantity > 0 ? "text-accent" : "text-muted",
            )}
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.84 }}
        aria-label={`Add one ${itemName}`}
        onClick={onIncrease}
        className="grid h-7 w-7 place-items-center rounded-full bg-accent text-white shadow-[0_4px_10px_-4px_rgba(212,75,43,0.65)] transition-colors hover:bg-accent-strong"
      >
        <Plus size={13} strokeWidth={2.6} />
      </motion.button>
    </div>
  );
}
