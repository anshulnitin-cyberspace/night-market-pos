"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { copy } from "@/lib/i18n";
import { usePos } from "@/lib/pos-store";

export function CartFooter({ onPay }: { onPay: () => void }) {
  const {
    activeTab,
    cartStatus,
    cart,
    cartCount,
    cartTotal,
    language,
  } = usePos();

  if (activeTab !== "cart" || cartStatus !== "ready" || cart.length === 0) return null;

  const text = copy[language];
  const itemCount =
    language === "zh"
      ? `${cartCount} ${text.cart.items}`
      : `${cartCount} ${cartCount === 1 ? "item" : "items"}`;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+92px)] z-40 px-3">
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="glass-panel pointer-events-auto mx-auto w-full max-w-[456px] rounded-[24px] p-3"
      >
        <div className="flex items-end justify-between gap-4 px-1 pb-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[7.5px] font-bold uppercase tracking-[0.18em] text-accent">
              <LockKeyhole size={9} strokeWidth={2.2} />
              {text.cart.secure}
            </p>
            <p className="mt-1 text-[10px] leading-tight text-muted">
              {itemCount} · {text.cart.subline}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-muted">
              {text.cart.grandTotal}
            </p>
            <p className="mt-0.5 text-[26px] font-semibold leading-none tabular-nums tracking-tight text-ink">
              {formatPrice(cartTotal)}
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.985 }}
          onClick={onPay}
          className="relative flex h-[50px] w-full items-center justify-center gap-2 overflow-hidden rounded-[16px] text-[12.5px] font-semibold text-white shadow-[0_14px_28px_-14px_rgba(212,75,43,0.8)]"
          style={{
            background: "linear-gradient(135deg, var(--nav-active-from) 0%, var(--nav-active-to) 100%)",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-4 top-0 h-px rounded-full bg-white/45"
          />
          <span>{text.cart.pay}</span>
          <span className="text-white/70">·</span>
          <span className="tabular-nums">{formatPrice(cartTotal)}</span>
          <ArrowUpRight size={15} strokeWidth={2.3} className="ml-0.5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
