"use client";

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {activeTab === "menu" && <MenuTab />}
        {activeTab === "cart" && <CartTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "glossary" && <GlossaryTab />}
      </motion.div>
    </AnimatePresence>
  );
}

function AppFrame() {
  const { activeTab } = usePos();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const openPayment = useCallback(() => setPaymentOpen(true), []);
  const closePayment = useCallback(() => setPaymentOpen(false), []);

  useEffect(() => {
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
