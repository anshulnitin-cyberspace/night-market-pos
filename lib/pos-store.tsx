"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  checkout,
  clearCart as clearCartRequest,
  fetchCart,
  fetchGlossary,
  fetchMenu,
  fetchOrders,
  setCartQuantity as setCartQuantityRequest,
} from "@/lib/data/api";
import { ACTIVE_SESSION } from "@/lib/data/session";
import { copy } from "@/lib/i18n";
import type {
  CartLine,
  GlossaryData,
  Language,
  LoadStatus,
  MenuItem,
  Order,
  PaymentMethod,
  TabId,
  Theme,
  ToastMessage,
} from "@/lib/types";

interface PosStore {
  language: Language;
  theme: Theme;
  activeTab: TabId;
  menu: MenuItem[];
  menuStatus: LoadStatus;
  cart: CartLine[];
  cartStatus: LoadStatus;
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  ordersStatus: LoadStatus;
  glossary: GlossaryData | null;
  glossaryStatus: LoadStatus;
  isPaying: boolean;
  lastOrderId: string | null;
  toast: ToastMessage | null;
  setTab: (tab: TabId) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  quantityFor: (menuItemId: string) => number;
  setQuantity: (menuItemId: string, quantity: number) => void;
  addOne: (menuItemId: string) => void;
  removeOne: (menuItemId: string) => void;
  clearCart: () => void;
  retryOrders: () => void;
  retryGlossary: () => void;
  payNow: () => Promise<boolean>;
  finalizePayment: (method: PaymentMethod) => Promise<boolean>;
  dismissToast: () => void;
}

const PosContext = createContext<PosStore | null>(null);

const MAX_QUANTITY = 20;

export function PosProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("menu");

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuStatus, setMenuStatus] = useState<LoadStatus>("loading");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartStatus, setCartStatus] = useState<LoadStatus>("loading");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersStatus, setOrdersStatus] = useState<LoadStatus>("idle");
  const [glossary, setGlossary] = useState<GlossaryData | null>(null);
  const [glossaryStatus, setGlossaryStatus] = useState<LoadStatus>("idle");
  const [ordersAttempt, setOrdersAttempt] = useState(0);
  const [glossaryAttempt, setGlossaryAttempt] = useState(0);

  const [isPaying, setIsPaying] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const menuRequested = useRef(false);
  const cartRequested = useRef(false);
  const ordersRequested = useRef(false);
  const glossaryRequested = useRef(false);
  const payingRef = useRef(false);
  const cartRef = useRef<CartLine[]>([]);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  /* ── Preferences ────────────────────────────────────────────────────────── */

  useEffect(() => {
    try {
      const storedLanguage = window.localStorage.getItem("nm-language");
      if (storedLanguage === "zh" || storedLanguage === "en") {
        setLanguage(storedLanguage);
      }
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    } catch {
      // Storage can be unavailable in private browsing; defaults are fine.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    root.lang = language === "zh" ? "zh-Hant" : "en";
    try {
      window.localStorage.setItem("nm-theme", theme);
      window.localStorage.setItem("nm-language", language);
    } catch {
      // Non-blocking.
    }
  }, [theme, language, hydrated]);

  /* ── Scoped data fetching ───────────────────────────────────────────────── */

  useEffect(() => {
    if (menuRequested.current) return;
    menuRequested.current = true;

    fetchMenu()
      .then((items) => {
        setMenu(items);
        setMenuStatus("ready");
      })
      .catch(() => setMenuStatus("error"));
  }, []);

  useEffect(() => {
    if (cartRequested.current) return;
    cartRequested.current = true;

    fetchCart(ACTIVE_SESSION.userId)
      .then((serverCart) => {
        setCart((localCart) => {
          const merged = new Map(localCart.map((line) => [line.menuItemId, line]));
          for (const line of serverCart) {
            if (!merged.has(line.menuItemId)) merged.set(line.menuItemId, line);
          }
          return Array.from(merged.values());
        });
        setCartStatus("ready");
      })
      .catch(() => setCartStatus("error"));
  }, []);

  useEffect(() => {
    if (activeTab !== "orders" || ordersRequested.current) return;
    ordersRequested.current = true;
    setOrdersStatus("loading");

    fetchOrders(ACTIVE_SESSION.userId)
      .then((data) => {
        setOrders(data);
        setOrdersStatus("ready");
      })
      .catch(() => {
        // Keep `ordersRequested` set: an error must not auto-retry in a loop.
        // Retrying is an explicit user action through `retryOrders`.
        setOrdersStatus("error");
      });
  }, [activeTab, ordersAttempt]);

  useEffect(() => {
    if (activeTab !== "glossary" || glossaryRequested.current) return;
    glossaryRequested.current = true;
    setGlossaryStatus("loading");

    fetchGlossary()
      .then((data) => {
        setGlossary(data);
        setGlossaryStatus("ready");
      })
      .catch(() => {
        setGlossaryStatus("error");
      });
  }, [activeTab, glossaryAttempt]);

  const retryOrders = useCallback(() => {
    ordersRequested.current = false;
    setOrdersStatus("idle");
    setOrdersAttempt((attempt) => attempt + 1);
  }, []);

  const retryGlossary = useCallback(() => {
    glossaryRequested.current = false;
    setGlossaryStatus("idle");
    setGlossaryAttempt((attempt) => attempt + 1);
  }, []);

  /* ── Toast ───────────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3_200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const pushToast = useCallback((message: string, tone: ToastMessage["tone"] = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  /* ── Preferences actions ────────────────────────────────────────────────── */

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "en" ? "zh" : "en"));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const setTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  }, []);

  /* ── Cart actions (all writes carry the active user_id) ─────────────────── */

  const quantityFor = useCallback(
    (menuItemId: string) =>
      cart.find((line) => line.menuItemId === menuItemId)?.quantity ?? 0,
    [cart],
  );

  const setQuantity = useCallback(
    (menuItemId: string, quantity: number) => {
      const safeQuantity = Math.max(0, Math.min(MAX_QUANTITY, Math.floor(quantity)));

      setCart((current) => {
        const existing = current.find((line) => line.menuItemId === menuItemId);

        if (safeQuantity === 0) {
          return current.filter((line) => line.menuItemId !== menuItemId);
        }

        if (existing) {
          return current.map((line) =>
            line.menuItemId === menuItemId ? { ...line, quantity: safeQuantity } : line,
          );
        }

        const item = menu.find((entry) => entry.id === menuItemId);
        if (!item) return current;

        return [
          ...current,
          {
            id: `cart_${ACTIVE_SESSION.userId}_${menuItemId}`,
            userId: ACTIVE_SESSION.userId,
            menuItemId,
            name: item.name,
            englishName: item.englishName,
            pinyin: item.pinyin,
            image: item.image,
            unitPrice: item.price,
            quantity: safeQuantity,
          },
        ];
      });

      // Fire-and-forget optimistic sync; the mock service is idempotent.
      void setCartQuantityRequest(ACTIVE_SESSION.userId, menuItemId, safeQuantity);
    },
    [menu],
  );

  const addOne = useCallback(
    (menuItemId: string) => {
      setQuantity(menuItemId, quantityFor(menuItemId) + 1);
    },
    [quantityFor, setQuantity],
  );

  const removeOne = useCallback(
    (menuItemId: string) => {
      setQuantity(menuItemId, quantityFor(menuItemId) - 1);
    },
    [quantityFor, setQuantity],
  );

  const clearCart = useCallback(() => {
    if (cartRef.current.length === 0) return;
    setCart([]);
    void clearCartRequest(ACTIVE_SESSION.userId);
    pushToast(copy[language].cart.clearedToast, "info");
  }, [language, pushToast]);

  /* ── Payment ────────────────────────────────────────────────────────────── */

  const payNow = useCallback(async (): Promise<boolean> => {
    if (payingRef.current || cartRef.current.length === 0) return false;

    payingRef.current = true;
    setIsPaying(true);

    try {
      const result = await checkout(
        ACTIVE_SESSION.userId,
        ACTIVE_SESSION.sessionId,
        cartRef.current,
      );

      setCart([]);
      setOrders(result.orders);
      setOrdersStatus("ready");
      ordersRequested.current = true;
      setLastOrderId(result.order.id);
      pushToast(copy[language].cart.paidToast, "success");
      return true;
    } catch {
      pushToast(copy[language].cart.failedToast, "info");
      return false;
    } finally {
      payingRef.current = false;
      setIsPaying(false);
    }
  }, [language, pushToast]);

  /**
   * Commits the order after the payment sheet has completed its own 1.5s
   * authorization animation. The gateway wait already happened in the UI, so
   * this write is immediate: clear the cart, refresh the scoped order list and
   * mark the new order. The payment screen closes and switches tabs afterwards.
   */
  const finalizePayment = useCallback(
    async (method: PaymentMethod): Promise<boolean> => {
      if (payingRef.current || cartRef.current.length === 0) return false;

      payingRef.current = true;

      try {
        const result = await checkout(
          ACTIVE_SESSION.userId,
          ACTIVE_SESSION.sessionId,
          cartRef.current,
          { paymentMethod: method, latency: 0 },
        );

        setCart([]);
        setOrders(result.orders);
        setOrdersStatus("ready");
        ordersRequested.current = true;
        setLastOrderId(result.order.id);
        pushToast(copy[language].cart.paidToast, "success");
        return true;
      } catch {
        pushToast(copy[language].cart.failedToast, "info");
        return false;
      } finally {
        payingRef.current = false;
      }
    },
    [language, pushToast],
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [cart],
  );

  const value = useMemo<PosStore>(
    () => ({
      language,
      theme,
      activeTab,
      menu,
      menuStatus,
      cart,
      cartStatus,
      cartCount,
      cartTotal,
      orders,
      ordersStatus,
      glossary,
      glossaryStatus,
      isPaying,
      lastOrderId,
      toast,
      setTab,
      toggleLanguage,
      toggleTheme,
      quantityFor,
      setQuantity,
      addOne,
      removeOne,
      clearCart,
      retryOrders,
      retryGlossary,
      payNow,
      finalizePayment,
      dismissToast,
    }),
    [
      language,
      theme,
      activeTab,
      menu,
      menuStatus,
      cart,
      cartStatus,
      cartCount,
      cartTotal,
      orders,
      ordersStatus,
      glossary,
      glossaryStatus,
      isPaying,
      lastOrderId,
      toast,
      setTab,
      toggleLanguage,
      toggleTheme,
      quantityFor,
      setQuantity,
      addOne,
      removeOne,
      clearCart,
      retryOrders,
      retryGlossary,
      payNow,
      finalizePayment,
      dismissToast,
    ],
  );

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePos(): PosStore {
  const context = useContext(PosContext);
  if (!context) throw new Error("usePos must be used inside <PosProvider>.");
  return context;
}
