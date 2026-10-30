"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Soup, Trash2 } from "lucide-react";
import { CartSkeleton } from "@/components/skeletons/CartSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatPrice } from "@/lib/format";
import { copy } from "@/lib/i18n";
import { usePos } from "@/lib/pos-store";

export function CartTab() {
  const {
    cart,
    cartStatus,
    cartCount,
    language,
    clearCart,
    setTab,
  } = usePos();
  const text = copy[language];

  if (cartStatus === "loading" || cartStatus === "idle") {
    return <CartSkeleton label={text.loading.cart} />;
  }

  if (cartStatus === "error") {
    return <ErrorState language={language} />;
  }

  const itemCount =
    language === "zh"
      ? `${cartCount} ${text.cart.items}`
      : `${cartCount} ${cartCount === 1 ? "item" : "items"}`;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center px-2 pb-24 pt-6 text-center">
        <div className="relative grid h-40 w-40 place-items-center">
          <span className="absolute inset-0 rounded-full border border-dashed border-line-strong/55" />
          <span className="absolute inset-4 rounded-full border border-line/80" />
          <span className="absolute inset-9 rounded-full bg-accent-soft blur-xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative grid h-[68px] w-[68px] place-items-center rounded-[24px] border border-line bg-panel text-accent shadow-card"
          >
            <Soup size={27} strokeWidth={1.7} />
          </motion.div>
          <Sparkles
            size={14}
            className="absolute right-4 top-7 text-gold"
            aria-hidden="true"
          />
          <span className="absolute bottom-6 left-4 h-1.5 w-1.5 rounded-full bg-accent/40" />
        </div>

        <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.22em] text-accent">
          {text.cart.kicker}
        </p>
        <h2 className="mt-2 font-display text-[30px] italic leading-none text-ink">
          {text.cart.emptyTitle}
        </h2>
        <p className="mt-3 max-w-[250px] text-[11.5px] leading-relaxed text-muted">
          {text.cart.emptyBody}
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setTab("menu")}
          className="mt-6 flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[11px] font-semibold text-canvas shadow-card"
        >
          {text.cart.browse}
          <ArrowRight size={14} />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="pb-44 pt-3">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-accent">
            {text.cart.kicker}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h2
              className={
                language === "zh"
                  ? "font-han text-[25px] font-semibold tracking-[0.05em] text-ink"
                  : "font-display text-[30px] italic leading-none text-ink"
              }
            >
              {text.cart.title}
            </h2>
            <span className="text-[9.5px] tabular-nums text-muted">{itemCount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="mb-0.5 flex h-8 items-center gap-1.5 rounded-full border border-line bg-panel/60 px-2.5 text-[9px] font-semibold text-muted transition-colors hover:border-accent/30 hover:text-accent"
        >
          <Trash2 size={11} />
          {text.cart.clear}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-[24px] border border-line bg-panel px-4 shadow-card">
        <AnimatePresence initial={false}>
          {cart.map((line) => {
            const displayName = language === "zh" ? line.name : line.englishName;
            return (
              <motion.div
                key={line.menuItemId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -14, height: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 border-b border-line py-3.5 last:border-0"
              >
                <div className="relative h-[54px] w-[54px] shrink-0 overflow-hidden rounded-[14px] bg-panel-muted">
                  <Image
                    src={line.image}
                    alt={displayName}
                    fill
                    sizes="54px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={
                      language === "zh"
                        ? "truncate font-han text-[15px] font-semibold text-ink"
                        : "truncate text-[13px] font-semibold text-ink"
                    }
                  >
                    {displayName}
                  </p>
                  <p className="mt-1 text-[10px] font-medium tabular-nums text-muted">
                    × {line.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-[14px] font-semibold tabular-nums text-ink">
                  {formatPrice(line.unitPrice * line.quantity)}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-[18px] border border-dashed border-line-strong/55 px-4 py-3">
        <LockIcon />
        <p className="text-[8.5px] tracking-[0.04em] text-muted">{text.cart.methods}</p>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <span className="grid h-4 w-4 place-items-center rounded-full bg-jade/10 text-jade" aria-hidden="true">
      <Sparkles size={8} />
    </span>
  );
}
