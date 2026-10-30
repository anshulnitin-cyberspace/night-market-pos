"use client";

import { motion } from "framer-motion";
import { Clock3, QrCode, Sparkles } from "lucide-react";
import { MenuItemCard } from "@/components/MenuItemCard";
import { MenuSkeleton } from "@/components/skeletons/MenuSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { ACTIVE_SESSION } from "@/lib/data/session";
import { copy } from "@/lib/i18n";
import { usePos } from "@/lib/pos-store";

export function MenuTab() {
  const {
    menu,
    menuStatus,
    language,
    quantityFor,
    addOne,
    removeOne,
  } = usePos();
  const text = copy[language];

  if (menuStatus === "loading" || menuStatus === "idle") {
    return <MenuSkeleton label={text.loading.menu} />;
  }

  if (menuStatus === "error") {
    return <ErrorState language={language} />;
  }

  return (
    <div className="space-y-5 pt-3">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="hero-card relative overflow-hidden rounded-[28px] border border-line px-5 pb-4 pt-5"
      >
        <div
          aria-hidden="true"
          className="absolute -right-14 -top-20 h-52 w-52 rounded-full border border-accent/15"
        />
        <div
          aria-hidden="true"
          className="absolute -right-7 top-0 h-36 w-36 rounded-full border border-gold/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 -top-1 select-none font-han text-[108px] leading-none tracking-tighter text-accent/[0.07]"
        >
          夜
        </div>
        <div
          aria-hidden="true"
          className="absolute right-3 top-20 hidden text-[8px] tracking-[0.34em] text-muted/60 [writing-mode:vertical-rl] min-[380px]:block"
        >
          煙火氣
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-jade" />
              </span>
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-jade">
                {text.menu.open}
              </span>
              <span className="h-2.5 w-px bg-line-strong" />
              <span className="flex items-center gap-1 text-[9px] tracking-[0.04em] text-muted">
                <Clock3 size={9} />
                {text.menu.hours}
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-line bg-panel/55 px-2 py-1 text-[7.5px] font-semibold tracking-[0.1em] text-muted backdrop-blur-sm">
              <QrCode size={9} />
              {language === "zh" ? "QR 已連線" : "QR LINKED"}
            </span>
          </div>

          <h1 className="mt-7 font-han text-[34px] font-semibold leading-none tracking-[0.06em] text-ink">
            {text.menu.heroHan}
          </h1>
          <p className="mt-2 font-display text-[18px] italic leading-none text-soft">
            {text.menu.heroRoman}
          </p>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-line/70 pt-3">
            <div className="flex items-end gap-5">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-muted">
                  Table
                </p>
                <p className="mt-1 text-[15px] font-bold leading-none tabular-nums text-ink">
                  {ACTIVE_SESSION.table}
                </p>
              </div>
              <span className="mb-0.5 h-6 w-px bg-line" />
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-muted">
                  Stalls
                </p>
                <p className="mt-1 text-[15px] font-bold leading-none tabular-nums text-ink">
                  {String(menu.length).padStart(2, "0")}
                </p>
              </div>
            </div>
            <span className="mb-0.5 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-soft px-2.5 py-1.5 text-[8px] font-bold tracking-[0.12em] text-accent">
              <Sparkles size={9} />
              {language === "zh" ? "掃碼點餐" : "SCAN · ORDER"}
            </span>
          </div>
        </div>
      </motion.section>

      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-accent">
            {text.menu.eyebrow}
          </p>
          <h2
            className={
              language === "zh"
                ? "mt-1 font-han text-[24px] font-semibold tracking-[0.05em] text-ink"
                : "mt-1 font-display text-[28px] italic leading-none text-ink"
            }
          >
            {text.menu.title}
          </h2>
        </div>
        <p className="max-w-[110px] pb-0.5 text-right text-[9px] leading-[1.5] text-muted">
          {text.menu.helper}
        </p>
      </div>

      <div className="space-y-2.5">
        {menu.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            index={index}
            quantity={quantityFor(item.id)}
            language={language}
            onIncrease={() => addOne(item.id)}
            onDecrease={() => removeOne(item.id)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2.5 px-6 pb-4 pt-5 text-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-line-strong" />
          <Sparkles size={11} className="text-gold" />
          <span className="h-px w-8 bg-line-strong" />
        </div>
        <p className="max-w-[250px] text-[9.5px] leading-relaxed text-muted">
          {text.menu.endNote}
        </p>
      </div>
    </div>
  );
}
