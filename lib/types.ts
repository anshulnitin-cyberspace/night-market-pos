export type Language = "en" | "zh";
export type Theme = "light" | "dark";
export type TabId = "menu" | "cart" | "orders" | "glossary";
export type LoadStatus = "idle" | "loading" | "ready" | "error";
export type PaymentMethod = "Alipay" | "WeChat Pay" | "UnionPay" | "JD Pay";

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface MenuItem {
  id: string;
  name: string;
  pinyin: string;
  englishName: string;
  description: LocalizedText;
  price: number;
  image: string;
  tag: LocalizedText;
  stall: string;
}

export interface CartLine {
  id: string;
  userId: string;
  menuItemId: string;
  name: string;
  englishName: string;
  pinyin: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  englishName: string;
  pinyin: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  sessionId: string;
  number: string;
  status: "completed";
  createdAt: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
}

export interface GlossaryEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  en: string;
}

export interface GlossaryData {
  food: GlossaryEntry[];
  words: GlossaryEntry[];
  phrases: GlossaryEntry[];
}

export interface UserSession {
  sessionId: string;
  userId: string;
  displayName: string;
  table: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  tone: "success" | "info";
}
