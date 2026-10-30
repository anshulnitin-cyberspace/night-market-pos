"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, ReceiptText, ShoppingBag, Soup, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/format";
import { copy } from "@/lib/i18n";
import { usePos } from "@/lib/pos-store";
import type { TabId } from "@/lib/types";

const NAV_ITEMS: Array<{ id: TabId; icon: LucideIcon }> = [
  { id: "menu", icon: Soup },
  { id: "cart", icon: ShoppingBag },
  { id: "orders", icon: ReceiptText },
  { id: "glossary", icon: BookOpenText },
];

const pillSpring = { type: "spring", stiffness: 430, damping: 33, mass: 0.78 } as const;
const auraSpring = { type: "spring", stiffness: 240, damping: 22, mass: 1.05 } as const;

export function BottomNav() {
  const { activeTab, setTab, language, cartCount } = usePos();
  const text = copy[language];

  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-50 px-3">
      <nav
        aria-label="Primary navigation"
        className="glass-nav mx-auto flex w-full max-w-[456px] items-center gap-0.5 rounded-[24px] p-1.5"
      >
        {NAV_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = activeTab === id;
          const label = text.tabs[id];
          const showBadge = id === "cart" && cartCount > 0;

          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              className="relative flex h-[54px] flex-1 flex-col items-center justify-center gap-1 rounded-[18px]"
            >
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layoutId="nav-aura"
                  transition={auraSpring}
                  className="absolute inset-x-2 inset-y-1 rounded-full bg-accent/25 blur-md"
                />
              )}
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layoutId="nav-pill"
                  transition={pillSpring}
                  className="nav-active-pill absolute inset-0 overflow-hidden rounded-[18px]"
                >
                  <span className="absolute inset-x-2 top-px h-1/2 rounded-full bg-white/15 blur-[2px]" />
                  <span className="absolute -left-2 top-0 h-full w-8 -skew-x-12 bg-white/10 blur-sm" />
                </motion.span>
              )}

              <span className="relative z-10">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.35 : 1.9}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-white drop-shadow-sm" : "text-soft",
                  )}
                />
                <AnimatePresence initial={false} mode="popLayout">
                  {showBadge && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.45, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 580, damping: 24 }}
                      className={cn(
                        "absolute -right-3.5 -top-2 grid h-[15px] min-w-[15px] place-items-center rounded-full px-1 text-[8px] font-bold tabular-nums leading-none shadow-sm",
                        isActive ? "bg-white text-accent" : "bg-accent text-white",
                      )}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>

              <span
                className={cn(
                  "relative z-10 max-w-full truncate px-1 transition-colors duration-200",
                  language === "zh"
                    ? "font-han text-[9px] tracking-[0.08em]"
                    : "text-[8px] font-bold uppercase tracking-[0.13em]",
                  isActive ? "text-white" : "text-muted",
                )}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
