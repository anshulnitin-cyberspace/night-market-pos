"use client";

// app shell. this is basically App.jsx from the first version, just split up
// so Next.js stops complaining about "use client" everywhere.
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { CartFooter } from "@/components/CartFooter";
import { Header } from "@/components/Header";
import { PaymentFlow } from "@/components/payment/PaymentFlow";
import { Toast } from "@/components/Toast";
import { CartTab } from "@/components/tabs/CartTab";
import { GlossaryTab } from "@/components/tabs/GlossaryTab";
import { MenuTab } from "@/components/tabs/MenuTab";
import { OrdersTab } from "@/components/tabs/OrdersTab";
import { PosProvider, usePos } from "@/lib/pos-store";

function ActiveTabContent() {
  const { activeTab } = usePos();

  // ugh, i originally had {activeTab === "menu" && <MenuTab />} four times and
  // then the glossary one rendered twice somehow. if/else is boring but works.
  let screen = null;

  if (activeTab === "menu") {
    screen = <MenuTab />;
  } else if (activeTab === "cart") {
    screen = <CartTab />;
  } else if (activeTab === "orders") {
    screen = <OrdersTab />;
  } else if (activeTab === "glossary") {
    screen = <GlossaryTab />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {screen}
      </motion.div>
    </AnimatePresence>
  );
}

function AppFrame() {
  const { activeTab } = usePos();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const openPayment = useCallback(() => {
    // console.log("PAY BUTTON CLICKED");
    console.log("opening payment sheet");
    setPaymentOpen(true);
  }, []);

  const closePayment = useCallback(() => setPaymentOpen(false), []);

  useEffect(() => {
    console.log("tab changed ->", activeTab);
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="phone-shell relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-clip">
      <div
        aria-hidden="true"
        className="app-atmosphere pointer-events-none absolute inset-x-0 top-0 h-[470px]"
      />
      <div className="grain" aria-hidden="true" />

      <Header />

      <main className="relative z-10 flex-1 px-4 pb-32">
        <ActiveTabContent />
      </main>

      <CartFooter onPay={openPayment} />
      <BottomNav />
      <Toast />
      <PaymentFlow open={paymentOpen} onClose={closePayment} />
    </div>
  );
}

export default function PosApp() {
  return (
    <MotionConfig reducedMotion="user">
      <PosProvider>
        <AppFrame />
      </PosProvider>
    </MotionConfig>
  );
}
