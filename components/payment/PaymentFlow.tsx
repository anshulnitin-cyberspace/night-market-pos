"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Delete,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/format";
import { copy } from "@/lib/i18n";
import { findPaymentBrand, PAYMENT_METHODS, type PaymentBrand } from "@/lib/payment-methods";
import { usePos } from "@/lib/pos-store";
import type { PaymentMethod } from "@/lib/types";

// demo only!!! in a real app the pin would be checked on a server, not in a
// const at the top of a client component. please don't copy this to prod.
const ADMIN_PIN = "123456";
const PIN_LENGTH = 6;
const VERIFY_MS = 1_500; // fake bank wait so the spinner has something to do
const SUCCESS_HOLD_MS = 1_000;

type View = "sheet" | "secure";
type Stage = "pin" | "processing" | "success";

const sheetSpring = { type: "spring", stiffness: 320, damping: 32, mass: 0.9 } as const;
const screenSpring = { type: "spring", stiffness: 280, damping: 31, mass: 0.95 } as const;

function haptic(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  // Chrome warns when vibrate is called without a user gesture (for example
  // during automated checks); skip the call instead of polluting the console.
  if (navigator.userActivation && !navigator.userActivation.isActive) return;
  navigator.vibrate(pattern);
}

interface PaymentFlowProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Mock wallet checkout, layered on top of the existing cart.
 *
 *   method sheet → provider-branded PIN screen → verifying → success → orders
 *
 * The order write is committed only after the success screen has been held for
 * one second. `finalizePayment` clears the cart and refreshes the scoped order
 * list in one step, then the app switches to the Orders tab.
 */
export function PaymentFlow({ open, onClose }: PaymentFlowProps) {
  const { language, cartCount, cartTotal, finalizePayment, setTab } = usePos();
  const payment = copy[language].payment;

  const [view, setView] = useState<View>("sheet");
  const [stage, setStage] = useState<Stage>("pin");
  const [methodId, setMethodId] = useState<PaymentMethod | null>(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [charged, setCharged] = useState({ total: 0, count: 0 });

  const brand = useMemo(() => findPaymentBrand(methodId), [methodId]);
  const finalizedRef = useRef(false);
  const pinLockedRef = useRef(false);
  const sheetReadyRef = useRef(true);
  const secureRef = useRef<HTMLDivElement>(null);
  const errorTimerRef = useRef<number | null>(null);

  /* ── Lifecycle ──────────────────────────────────────────────────────────── */

  const reset = useCallback(() => {
    finalizedRef.current = false;
    pinLockedRef.current = false;
    sheetReadyRef.current = true;
    setView("sheet");
    setStage("pin");
    setMethodId(null);
    setPin("");
    setPinError(false);
    setCharged({ total: 0, count: 0 });
  }, []);

  useEffect(() => {
    if (!open) return;
    reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open || view !== "secure") return;
    secureRef.current?.focus({ preventScroll: true });
  }, [open, view]);

  useEffect(
    () => () => {
      if (errorTimerRef.current !== null) window.clearTimeout(errorTimerRef.current);
    },
    [],
  );

  /* ── PIN input ──────────────────────────────────────────────────────────── */

  const pushDigit = useCallback((digit: string) => {
    if (pinLockedRef.current) return;
    setPin((current) => (current.length >= PIN_LENGTH ? current : current + digit));
  }, []);

  const backspace = useCallback(() => {
    if (pinLockedRef.current) return;
    setPin((current) => current.slice(0, -1));
  }, []);

  useEffect(() => {
    if (!open || view !== "secure" || stage !== "pin") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        pushDigit(event.key);
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [backspace, onClose, open, pushDigit, stage, view]);

  /**
   * The sixth digit starts validation. A correct PIN hides the pad at once and
   * moves to the verifying stage. A wrong PIN shakes, clears and lets the user
   * try again; the admin PIN is the only accepted value.
   */
  useEffect(() => {
    if (view !== "secure" || stage !== "pin" || pin.length !== PIN_LENGTH) return;

    pinLockedRef.current = true;

    const timer = window.setTimeout(() => {
      // console.log("entered pin:", pin); // absolutely not, leaving this out
      console.log("pin correct?", pin === ADMIN_PIN); // remove before demo lol

      if (pin === ADMIN_PIN) {
        haptic(18);
        setStage("processing");
        setPin("");
        return;
      }

      haptic([22, 36, 22]);
      setPinError(true);
      setShakeKey((key) => key + 1);
      setPin("");

      errorTimerRef.current = window.setTimeout(() => {
        setPinError(false);
        pinLockedRef.current = false;
      }, 720);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [pin, stage, view]);

  /* ── Verifying → success → order ────────────────────────────────────────── */

  useEffect(() => {
    if (stage !== "processing") return;
    const timer = window.setTimeout(() => setStage("success"), VERIFY_MS);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "success" || !methodId) return;

    const timer = window.setTimeout(() => {
      if (finalizedRef.current) return;
      finalizedRef.current = true;

      // Requirement order: dismiss the overlay, clear the cart / push the
      // order, then land on the Orders tab. `finalizePayment` handles 2 + 3.
      onClose();
      void finalizePayment(methodId).then((approved) => {
        if (approved) setTab("orders");
      });
    }, SUCCESS_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [finalizePayment, methodId, onClose, setTab, stage]);

  /* ── Actions ────────────────────────────────────────────────────────────── */

  const selectMethod = useCallback(
    (id: PaymentMethod) => {
      setMethodId(id);
      setCharged({ total: cartTotal, count: cartCount });
      setPin("");
      setPinError(false);
      pinLockedRef.current = false;
      sheetReadyRef.current = false;
      setStage("pin");
      setView("secure");
      haptic(10);
    },
    [cartCount, cartTotal],
  );

  const goBack = useCallback(() => {
    if (stage !== "pin") return;
    sheetReadyRef.current = true;
    setView("sheet");
    setPin("");
    setPinError(false);
    pinLockedRef.current = false;
  }, [stage]);

  const closeSheet = useCallback(() => {
    if (!sheetReadyRef.current) return;
    onClose();
  }, [onClose]);

  const close = useCallback(() => {
    if (stage !== "pin") return;
    onClose();
  }, [onClose, stage]);

  const handleExitComplete = useCallback(() => {
    // Switching sheet → secure also fires this; only reset after a full close.
    if (!open) reset();
  }, [open, reset]);

  /* ── Render ─────────────────────────────────────────────────────────────── */

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {open && view === "sheet" && (
        <motion.div
          key="payment-method-sheet"
          className="fixed inset-0 z-[120] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label={payment.close}
            onClick={closeSheet}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[3px]"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-method-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheetSpring}
            className="relative w-full max-w-[480px] rounded-t-[30px] border border-line border-b-0 bg-panel-strong pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-[0_-28px_70px_-20px_rgba(0,0,0,0.55)]"
          >
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line-strong" />

            <div className="flex items-start justify-between gap-3 px-5 pt-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[7.5px] font-bold uppercase tracking-[0.22em] text-accent">
                  <LockKeyhole size={9} strokeWidth={2.3} />
                  {payment.secure}
                </p>
                <h2
                  id="payment-method-title"
                  className={
                    language === "zh"
                      ? "mt-1.5 font-han text-[24px] font-semibold tracking-[0.05em] text-ink"
                      : "mt-1 font-display text-[28px] italic leading-none text-ink"
                  }
                >
                  {payment.sheetTitle}
                </h2>
                <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                  {payment.sheetSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={closeSheet}
                aria-label={payment.close}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-muted transition-colors hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-[18px] border border-line bg-panel-muted px-4 py-3">
              <div className="min-w-0">
                <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-muted">
                  {payment.amountDue}
                </p>
                <p className="mt-1 text-[9.5px] text-muted">
                  {cartCount} {copy[language].cart.items}
                </p>
              </div>
              <p className="shrink-0 text-[25px] font-semibold leading-none tabular-nums tracking-tight text-ink">
                {formatPrice(cartTotal)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 px-5">
              {PAYMENT_METHODS.map((entry) => (
                <MethodCard
                  key={entry.id}
                  brand={entry}
                  language={language}
                  onSelect={selectMethod}
                />
              ))}
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 px-5 text-[8.5px] text-muted">
              <ShieldCheck size={11} className="text-jade" />
              {payment.secure} · {payment.methodHint}
            </p>
          </motion.section>
        </motion.div>
      )}

      {open && view === "secure" && brand && (
        <motion.div
          key="payment-secure-screen"
          className="fixed inset-0 z-[120] flex justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={secureRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${brand.zh} ${brand.en}`}
            className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden outline-none"
            style={{ background: brand.gradient }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={screenSpring}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(70% 45% at 50% -8%, rgba(255,255,255,0.22), transparent 70%), radial-gradient(55% 35% at 110% 45%, rgba(255,255,255,0.12), transparent 70%)",
              }}
            />

            <header className="relative z-10 flex items-center justify-between px-3 pb-1 pt-[calc(env(safe-area-inset-top)+10px)] text-white">
              <button
                type="button"
                onClick={goBack}
                aria-label={payment.back}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full bg-white/12 backdrop-blur-sm transition-opacity",
                  stage !== "pin" && "pointer-events-none opacity-0",
                )}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.02em]">
                  <BrandMark brand={brand} size={20} />
                  {language === "zh" ? brand.zh : brand.en}
                </span>
                <span className="flex items-center gap-1 text-[7px] font-bold uppercase tracking-[0.18em] text-white/65">
                  <LockKeyhole size={8} strokeWidth={2.4} />
                  {payment.secure}
                </span>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label={payment.close}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full bg-white/12 backdrop-blur-sm transition-opacity",
                  stage !== "pin" && "pointer-events-none opacity-0",
                )}
              >
                <X size={16} />
              </button>
            </header>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col text-white">
              <div className="px-6 pb-5 pt-4 text-center">
                <p className="text-[8px] font-bold uppercase tracking-[0.24em] text-white/60">
                  {payment.merchant}
                </p>
                <p className="mt-2 text-[42px] font-semibold leading-none tabular-nums tracking-tight">
                  {formatPrice(charged.total)}
                </p>
                <p className="mt-2.5 text-[9.5px] text-white/70">
                  {charged.count} {copy[language].cart.items} · {brand.zh}
                </p>
              </div>

              <section className="relative z-10 mt-auto rounded-t-[30px] bg-[#FBFBFD] px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-4 text-[#16181D] shadow-[0_-26px_60px_-22px_rgba(0,0,0,0.55)]">
                <AnimatePresence mode="wait" initial={false}>
                  {stage === "pin" && (
                    <PinPad
                      key="pin"
                      brand={brand}
                      language={language}
                      pin={pin}
                      pinError={pinError}
                      shakeKey={shakeKey}
                      onDigit={pushDigit}
                      onBackspace={backspace}
                    />
                  )}

                  {stage === "processing" && (
                    <ProcessingState key="processing" brand={brand} language={language} />
                  )}
                </AnimatePresence>
              </section>
            </div>

            <AnimatePresence>
              {stage === "success" && (
                <SuccessState
                  key="success"
                  brand={brand}
                  language={language}
                  total={charged.total}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Method sheet                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

function MethodCard({
  brand,
  language,
  onSelect,
}: {
  brand: PaymentBrand;
  language: "en" | "zh";
  onSelect: (id: PaymentMethod) => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(brand.id)}
      aria-label={`${brand.zh} · ${brand.en}`}
      className="relative flex min-h-[92px] flex-col items-start gap-2.5 overflow-hidden rounded-[18px] border border-line bg-panel p-3 text-left transition-colors hover:border-line-strong"
      style={{ backgroundImage: `linear-gradient(150deg, ${brand.tint} 0%, transparent 72%)` }}
    >
      <BrandMark brand={brand} size={36} />

      <span className="min-w-0">
        <span
          className={cn(
            "block truncate text-ink",
            language === "zh"
              ? "font-han text-[15px] font-semibold tracking-[0.02em]"
              : "text-[12.5px] font-semibold",
          )}
        >
          {language === "zh" ? brand.zh : brand.en}
        </span>
        <span className="mt-0.5 block truncate text-[8.5px] text-muted">
          {language === "zh" ? brand.en : brand.zh}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[3px] w-full opacity-80"
        style={{
          background:
            brand.id === "UnionPay"
              ? "linear-gradient(90deg, #D71920 0%, #0B4C9C 50%, #04A9A9 100%)"
              : brand.color,
        }}
      />
    </motion.button>
  );
}

export function BrandMark({
  brand,
  size = 36,
}: {
  brand: PaymentBrand;
  size?: number;
}) {
  const shared = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.32),
  };

  if (brand.id === "WeChat Pay") {
    return (
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_14px_-6px_rgba(0,0,0,0.45)]"
        style={{ ...shared, background: brand.color }}
      >
        <MessageCircle size={size * 0.58} strokeWidth={2.2} fill="currentColor" />
      </span>
    );
  }

  const label = brand.id === "UnionPay" ? "銀" : brand.id === "JD Pay" ? "JD" : "支";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_14px_-6px_rgba(0,0,0,0.45)]",
        brand.id === "JD Pay" ? "font-sans font-extrabold" : "font-han font-semibold",
      )}
      style={{
        ...shared,
        background: brand.markGradient ?? brand.color,
        fontSize: size * (brand.id === "JD Pay" ? 0.32 : 0.48),
        letterSpacing: brand.id === "JD Pay" ? "-0.04em" : "0",
      }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PIN pad                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

function PinPad({
  brand,
  language,
  pin,
  pinError,
  shakeKey,
  onDigit,
  onBackspace,
}: {
  brand: PaymentBrand;
  language: "en" | "zh";
  pin: string;
  pinError: boolean;
  shakeKey: number;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
}) {
  const payment = copy[language].payment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight text-[#16181D]">
            {payment.pinTitle}
          </h3>
          <p className="mt-1 text-[9px] text-[#7C818B]">{payment.pinSubtitle}</p>
        </div>
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
          style={{ background: brand.tint, color: brand.color }}
        >
          <LockKeyhole size={14} />
        </span>
      </div>

      <motion.div
        key={shakeKey}
        animate={pinError ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
        role="group"
        aria-label={`${pin.length} of ${PIN_LENGTH} digits entered`}
        className="mt-3.5 flex justify-center gap-2"
      >
        {Array.from({ length: PIN_LENGTH }).map((_, index) => {
          const filled = index < pin.length;
          const active = index === pin.length;

          return (
            <motion.span
              key={index}
              animate={filled ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.16 }}
              className={cn(
                "grid h-11 w-[38px] place-items-center rounded-[12px] border-2 bg-white transition-colors duration-150",
                pinError
                  ? "border-[#E5484D]"
                  : filled
                    ? "border-[#1D1F24]"
                    : active
                      ? "border-[#1D1F24]/35"
                      : "border-[#E4E6EA]",
              )}
            >
              {filled ? (
                <span className="h-2 w-2 rounded-full bg-[#17191E]" />
              ) : active ? (
                <motion.span
                  className="h-4 w-[2px] rounded-full"
                  style={{ background: brand.color }}
                  animate={{ opacity: [1, 0.14, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
            </motion.span>
          );
        })}
      </motion.div>

      <div className="mt-2 flex h-4 items-center justify-center text-center">
        <AnimatePresence mode="wait" initial={false}>
          {pinError ? (
            <motion.p
              key="pin-error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[9px] font-semibold text-[#E5484D]"
            >
              {payment.incorrect}
            </motion.p>
          ) : (
            <motion.p
              key="pin-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[8.5px] tracking-[0.02em] text-[#9AA0A9]"
            >
              {payment.demoPin}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <PinKey key={digit} onClick={() => onDigit(String(digit))}>
            {digit}
          </PinKey>
        ))}

        <span aria-hidden="true" />

        <PinKey onClick={() => onDigit("0")}>0</PinKey>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onBackspace}
          aria-label="Delete digit"
          className="grid h-[42px] place-items-center rounded-[13px] text-[#5F646D] transition-colors hover:bg-[#ECEEF2]"
        >
          <Delete size={19} />
        </motion.button>
      </div>
    </motion.div>
  );
}

function PinKey({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92, backgroundColor: "#E8EAEF" }}
      onClick={onClick}
      className="grid h-[42px] place-items-center rounded-[13px] bg-[#F1F2F5] text-[18px] font-semibold tabular-nums text-[#181A1F] transition-colors hover:bg-[#ECEEF2]"
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Verifying + success                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

function ProcessingState({ brand, language }: { brand: PaymentBrand; language: "en" | "zh" }) {
  const payment = copy[language].payment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-[330px] flex-col items-center justify-center py-5"
      role="status"
      aria-live="polite"
    >
      <div className="relative grid h-[66px] w-[66px] place-items-center">
        <span className="absolute inset-0 rounded-full border-[3px] border-black/[0.07]" />
        <motion.span
          className="absolute inset-0 rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: brand.color, borderRightColor: brand.color }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
        />
        <LockKeyhole size={21} style={{ color: brand.color }} />
      </div>

      <p className="mt-5 text-[13.5px] font-semibold text-[#16181D]">{payment.verifying}</p>
      <p className="mt-1 text-[9.5px] text-[#7C818B]">
        {language === "en" ? "處理中..." : "Verifying Payment..."}
      </p>
      <p className="mt-4 text-[8.5px] text-[#9AA0A9]">{payment.verifyingNote}</p>
    </motion.div>
  );
}

function SuccessState({
  brand,
  language,
  total,
}: {
  brand: PaymentBrand;
  language: "en" | "zh";
  total: number;
}) {
  const payment = copy[language].payment;

  return (
    <motion.div
      role="status"
      aria-live="assertive"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F5FBF7] px-8 text-center text-[#12221A]"
    >
      <motion.div
        aria-hidden="true"
        initial={{ scale: 0.55, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative grid h-[104px] w-[104px] place-items-center rounded-full bg-[#16A34A] shadow-[0_26px_60px_-18px_rgba(22,163,74,0.7)]"
      >
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-[#16A34A]/35"
          animate={{ scale: [1, 1.38], opacity: [0.7, 0] }}
          transition={{ duration: 1.15, repeat: Infinity, ease: "easeOut" }}
        />
        <svg viewBox="0 0 100 100" className="h-14 w-14" fill="none" aria-hidden="true">
          <motion.path
            d="M24 52 L44 71 L79 30"
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.28 }}
        className="mt-6 text-[27px] font-extrabold leading-tight tracking-[-0.02em]"
      >
        {payment.success}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.28 }}
        className="mt-1 text-[13px] font-medium text-[#5E776B]"
      >
        {language === "en" ? "支付成功" : "Payment Successful!"}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.28 }}
        className="mt-5"
      >
        <p className="text-[25px] font-semibold tabular-nums tracking-tight">{formatPrice(total)}</p>
        <p className="mt-1 flex items-center justify-center gap-1 text-[9.5px] text-[#5E776B]">
          <Check size={11} strokeWidth={2.8} className="text-[#16A34A]" />
          {brand.zh} · {brand.en}
        </p>
      </motion.div>

      <p className="mt-8 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#3F8A66]">
        <LoaderCircle size={12} className="animate-spin" />
        {payment.redirecting}
      </p>
    </motion.div>
  );
}
