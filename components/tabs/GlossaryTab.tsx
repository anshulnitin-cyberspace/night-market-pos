"use client";

import { motion } from "framer-motion";
import { ChevronsUpDown } from "lucide-react";
import { GlossarySkeleton } from "@/components/skeletons/GlossarySkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/format";
import { copy } from "@/lib/i18n";
import { usePos } from "@/lib/pos-store";
import type { GlossaryEntry } from "@/lib/types";

type SectionVariant = "inline" | "stacked";

interface GlossarySectionProps {
  index: string;
  title: string;
  subtitle: string;
  entries: GlossaryEntry[];
  variant: SectionVariant;
  accent: "accent" | "jade" | "gold";
  wordsLabel: string;
  scrollLabel: string;
}

const accentStyles = {
  accent: {
    index: "text-accent border-accent/25 bg-accent-soft",
    dot: "bg-accent",
    count: "text-accent border-accent/20 bg-accent-soft",
  },
  jade: {
    index: "text-jade border-jade/25 bg-jade/10",
    dot: "bg-jade",
    count: "text-jade border-jade/20 bg-jade/10",
  },
  gold: {
    index: "text-gold border-gold/25 bg-gold/10",
    dot: "bg-gold",
    count: "text-gold border-gold/20 bg-gold/10",
  },
};

function GlossarySection({
  index,
  title,
  subtitle,
  entries,
  variant,
  accent,
  wordsLabel,
  scrollLabel,
}: GlossarySectionProps) {
  const styles = accentStyles[accent];

  return (
    <section className="overflow-hidden rounded-[24px] border border-line bg-panel shadow-card">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-[12px] border font-display text-[13px] italic",
              styles.index,
            )}
          >
            {index}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[12.5px] font-bold tracking-[0.01em] text-ink">
              {title}
            </h3>
            <p className="mt-0.5 truncate font-han text-[9px] tracking-[0.08em] text-muted">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={cn(
              "rounded-full border px-2 py-1 text-[7.5px] font-bold tracking-[0.06em]",
              styles.count,
            )}
          >
            {entries.length} {wordsLabel}
          </span>
          <span
            className="hidden items-center gap-1 text-[7px] uppercase tracking-[0.12em] text-muted min-[390px]:flex"
            title={scrollLabel}
          >
            <ChevronsUpDown size={9} />
            {scrollLabel}
          </span>
        </div>
      </header>

      <div
        role="region"
        aria-label={title}
        tabIndex={0}
        className="scroll-soft max-h-[19rem] overflow-y-auto px-4"
      >
        <ul className="divide-y divide-line">
          {entries.map((entry) => (
            <li key={entry.id}>
              {variant === "inline" ? (
                <div className="flex items-start justify-between gap-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-han text-[23px] font-medium leading-tight tracking-[0.02em] text-ink">
                      {entry.hanzi}
                    </p>
                    <p className="mt-1 font-pinyin text-[12px] italic leading-none text-muted">
                      {entry.pinyin}
                    </p>
                  </div>
                  <p className="max-w-[54%] pt-1 text-right text-[12px] font-medium leading-snug text-soft">
                    {entry.en}
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="font-han text-[22px] font-medium leading-tight tracking-[0.02em] text-ink">
                    {entry.hanzi}
                  </p>
                  <p className="mt-1 font-pinyin text-[10.5px] italic leading-none text-muted">
                    {entry.pinyin}
                  </p>
                  <p className="mt-6 text-[12.5px] font-medium leading-relaxed text-soft">
                    {entry.en}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="sticky bottom-0 flex justify-center pb-1.5">
          <span
            className={cn("h-1 w-7 rounded-full opacity-40", styles.dot)}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

export function GlossaryTab() {
  const { glossary, glossaryStatus, language, retryGlossary } = usePos();
  const text = copy[language];

  if (glossaryStatus === "loading" || glossaryStatus === "idle") {
    return <GlossarySkeleton label={text.loading.glossary} />;
  }

  if (glossaryStatus === "error" || !glossary) {
    return <ErrorState language={language} onRetry={retryGlossary} />;
  }

  const sections = [
    {
      key: "food" as const,
      entries: glossary.food,
      variant: "inline" as const,
      accent: "accent" as const,
    },
    {
      key: "words" as const,
      entries: glossary.words,
      variant: "inline" as const,
      accent: "jade" as const,
    },
    {
      key: "phrases" as const,
      entries: glossary.phrases,
      variant: "stacked" as const,
      accent: "gold" as const,
    },
  ];

  return (
    <div className="space-y-4 pb-32 pt-3">
      <div className="px-1">
        <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-accent">
          {text.glossary.kicker}
        </p>
        <h2
          className={
            language === "zh"
              ? "mt-1 font-han text-[25px] font-semibold tracking-[0.05em] text-ink"
              : "mt-1 font-display text-[30px] italic leading-none text-ink"
          }
        >
          {text.glossary.title}
        </h2>
        <p className="mt-2 max-w-[270px] text-[11px] leading-relaxed text-muted">
          {text.glossary.intro}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span className="h-1 w-1 rounded-full bg-jade" />
          <span className="h-1 w-1 rounded-full bg-gold" />
          <span className="ml-1 text-[7.5px] font-semibold uppercase tracking-[0.16em] text-muted">
            03 sections
          </span>
        </div>
      </div>

      {sections.map((section, index) => (
        <motion.div
          key={section.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <GlossarySection
            index={String(index + 1).padStart(2, "0")}
            title={text.glossary.sections[section.key]}
            subtitle={text.glossary.sectionHan[section.key]}
            entries={section.entries}
            variant={section.variant}
            accent={section.accent}
            wordsLabel={text.glossary.words}
            scrollLabel={text.glossary.scroll}
          />
        </motion.div>
      ))}
    </div>
  );
}
