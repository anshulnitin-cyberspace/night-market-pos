"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { usePos } from "@/lib/pos-store";
import { copy } from "@/lib/i18n";
import { cn } from "@/lib/format";

function LanguageSwitch() {
  const { language, toggleLanguage } = usePos();
  const isChinese = language === "zh";
  const label = copy[language].languageLabel;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChinese}
      aria-label={label}
      title={label}
      onClick={toggleLanguage}
      className="relative flex h-8 w-[58px] items-center rounded-full border border-line bg-panel/70 p-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-line-strong"
    >
      <motion.span
        aria-hidden="true"
        animate={{ x: isChinese ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
        className="absolute left-[3px] top-[3px] h-[24px] w-[26px] rounded-full bg-ink shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
      />
      <span
        className={cn(
          "relative z-10 w-1/2 text-center text-[8.5px] font-bold tracking-[0.08em] transition-colors duration-200",
          isChinese ? "text-muted" : "text-canvas",
        )}
      >
        EN
      </span>
      <span
        className={cn(
          "relative z-10 w-1/2 text-center font-han text-[11px] transition-colors duration-200",
          isChinese ? "text-canvas" : "text-muted",
        )}
      >
        中
      </span>
    </button>
  );
}

function ThemeSwitch() {
  const { theme, toggleTheme, language } = usePos();
  const isDark = theme === "dark";
  const text = copy[language];
  const label = isDark ? text.themeLabel : text.themeLabelDark;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="relative flex h-8 w-[54px] items-center rounded-full border border-line bg-panel/70 p-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-line-strong"
    >
      <motion.span
        aria-hidden="true"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
        className="absolute left-[3px] top-[3px] h-[24px] w-[24px] rounded-full bg-ink shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
      />
      <span className="relative z-10 grid w-1/2 place-items-center">
        <Sun
          size={12}
          strokeWidth={2.2}
          className={cn("transition-colors duration-200", isDark ? "text-muted" : "text-canvas")}
        />
      </span>
      <span className="relative z-10 grid w-1/2 place-items-center">
        <Moon
          size={12}
          strokeWidth={2.2}
          className={cn("transition-colors duration-200", isDark ? "text-canvas" : "text-muted")}
        />
      </span>
    </button>
  );
}

export function Header() {
  const { activeTab, language } = usePos();
  const text = copy[language];
  const label = text.tabs[activeTab];

  return (
    <header className="header-blur sticky top-0 z-40 border-b border-line/70">
      <div className="flex h-[76px] items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-gradient-to-br from-[#f0704b] to-[#c93c1f] text-[#fff8ef] shadow-[0_8px_18px_-8px_rgba(201,60,31,0.7),inset_0_1px_0_rgba(255,255,255,0.3)]">
            <span className="font-han text-[16px] font-semibold leading-none">肆</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-jade" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[7.5px] font-bold tracking-[0.24em] text-muted">
              {text.brandKicker}
            </p>
            <div className="relative mt-0.5 h-[27px] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.h1
                  key={`${activeTab}-${language}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "absolute inset-0 whitespace-nowrap leading-[27px] text-ink",
                    language === "zh"
                      ? "font-han text-[22px] font-semibold tracking-[0.08em]"
                      : "text-[20px] font-extrabold tracking-[0.16em]",
                  )}
                >
                  {label}
                </motion.h1>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
