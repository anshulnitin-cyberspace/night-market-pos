"use client";

import { motion } from "framer-motion";
import { Check, LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react";
import { OrdersSkeleton } from "@/components/skeletons/OrdersSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { ACTIVE_SESSION } from "@/lib/data/session";
import { cn, formatOrderTime, formatPrice, maskId } from "@/lib/format";
import { copy } from "@/lib/i18n";
import { usePos } from "@/lib/pos-store";

export function OrdersTab() {
  const { orders, ordersStatus, language, lastOrderId, retryOrders } = usePos();
  const text = copy[language];

  if (ordersStatus === "loading" || ordersStatus === "idle") {
    return <OrdersSkeleton label={text.loading.orders} />;
  }

  if (ordersStatus === "error") {
    return <ErrorState language={language} onRetry={retryOrders} />;
  }

  /**
   * RLS defence in depth. The repository already scopes rows by user_id; this
   * filter makes the UI contract explicit and keeps another session's data out
   * even if a mock query is ever changed by mistake.
   */
  const visibleOrders = orders.filter(
    (order) => order.userId === ACTIVE_SESSION.userId && order.status === "completed",
  );

  return (
    <div className="space-y-4 pb-32 pt-3">
      <div className="flex items-start justify-between gap-3 px-1">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-accent">
            {text.orders.kicker}
          </p>
          <h2
            className={
              language === "zh"
                ? "mt-1 font-han text-[25px] font-semibold tracking-[0.05em] text-ink"
                : "mt-1 font-display text-[30px] italic leading-none text-ink"
            }
          >
            {text.orders.title}
          </h2>
          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[9px] leading-relaxed text-muted">
            <LockKeyhole size={9} className="shrink-0 text-jade" />
            {text.orders.scopeNote}
            <span className="font-mono text-[8.5px] text-muted/80">
              ({maskId(ACTIVE_SESSION.userId)})
            </span>
          </p>
        </div>

        <span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full border border-jade/25 bg-jade/10 px-2 py-1 text-[7.5px] font-bold uppercase tracking-[0.12em] text-jade">
          <ShieldCheck size={10} />
          {text.orders.scoped}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-[16px] border border-jade/20 bg-jade/[0.055] px-3 py-2.5">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-jade/12 text-jade">
          <ShieldCheck size={13} />
        </span>
        <div className="min-w-0">
          <p className="text-[9px] font-semibold text-jade">{text.orders.scoped}</p>
          <p className="mt-0.5 truncate text-[8.5px] text-muted">
            {maskId(ACTIVE_SESSION.sessionId)} · user_id = {maskId(ACTIVE_SESSION.userId)}
          </p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-jade/10 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-jade">
          {visibleOrders.length} {language === "zh" ? "筆" : "rows"}
        </span>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="flex flex-col items-center rounded-[24px] border border-line bg-panel px-6 py-12 text-center shadow-card">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
            <ReceiptText size={21} />
          </span>
          <h3 className="mt-4 font-display text-[24px] italic text-ink">
            {text.orders.emptyTitle}
          </h3>
          <p className="mt-2 max-w-[240px] text-[11px] leading-relaxed text-muted">
            {text.orders.emptyBody}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleOrders.map((order, index) => {
            const isNew = order.id === lastOrderId;
            const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const countLabel =
              language === "zh" ? `${units} ${text.orders.items}` : `${units} ${units === 1 ? "item" : "items"}`;

            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "rounded-[24px] border bg-panel p-4 shadow-card transition-colors",
                  isNew ? "border-accent/40" : "border-line",
                )}
                style={
                  isNew
                    ? {
                        background:
                          "linear-gradient(155deg, color-mix(in srgb, var(--accent) 7%, var(--panel)) 0%, var(--panel) 58%)",
                      }
                    : undefined
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold tracking-[0.01em] text-ink">
                      Order #{order.number}
                    </h3>
                    <p className="mt-1 text-[9px] leading-relaxed text-muted">
                      {formatOrderTime(order.createdAt, language)} · {countLabel} ·{" "}
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {isNew && (
                      <span className="rounded-full bg-accent px-2 py-1 text-[7px] font-bold tracking-[0.12em] text-white">
                        {text.orders.new}
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full border border-jade/20 bg-jade/10 px-2 py-1 text-[7.5px] font-semibold text-jade">
                      <Check size={9} strokeWidth={2.6} />
                      {text.orders.completed}
                    </span>
                  </div>
                </div>

                <div className="my-3.5 h-px bg-line" />

                <ul className="space-y-2">
                  {order.items.map((item) => {
                    const displayName = language === "zh" ? item.name : item.englishName;
                    return (
                      <li
                        key={`${order.id}-${item.menuItemId}`}
                        className="flex items-baseline gap-2.5 text-[12px]"
                      >
                        <span className="w-6 shrink-0 text-[10px] font-semibold tabular-nums text-muted">
                          {item.quantity}×
                        </span>
                        <span className="min-w-0 flex-1 font-medium text-soft">
                          {displayName}
                        </span>
                        <span className="shrink-0 text-[10.5px] tabular-nums text-muted">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 border-t border-line pt-3">
                  <p className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-muted">
                    {text.orders.total}
                  </p>
                  <p className="mt-1 text-[23px] font-semibold leading-none tabular-nums tracking-tight text-ink">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
