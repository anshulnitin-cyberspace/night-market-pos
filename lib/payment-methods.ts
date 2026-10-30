import type { PaymentMethod } from "@/lib/types";

export interface PaymentBrand {
  id: PaymentMethod;
  /** Chinese wallet name, kept visible in both languages. */
  zh: string;
  en: string;
  /** Primary brand colour used for marks, rings and the spinner. */
  color: string;
  /** Soft translucent tint that works on light and dark panels. */
  tint: string;
  /** Full-screen secure checkout background. */
  gradient: string;
  /** Optional multi-colour mark background (UnionPay). */
  markGradient?: string;
}

export const PAYMENT_METHODS: PaymentBrand[] = [
  {
    id: "Alipay",
    zh: "支付寶",
    en: "Alipay",
    color: "#1677FF",
    tint: "rgba(22, 119, 255, 0.12)",
    gradient:
      "radial-gradient(120% 80% at 85% 0%, rgba(110, 190, 255, 0.55) 0%, transparent 58%), linear-gradient(158deg, #2C8CFF 0%, #0B63E5 52%, #073A96 100%)",
  },
  {
    id: "WeChat Pay",
    zh: "微信支付",
    en: "WeChat Pay",
    color: "#07C160",
    tint: "rgba(7, 193, 96, 0.12)",
    gradient:
      "radial-gradient(120% 80% at 85% 0%, rgba(130, 245, 185, 0.45) 0%, transparent 58%), linear-gradient(158deg, #20C977 0%, #07A653 52%, #05683A 100%)",
  },
  {
    id: "UnionPay",
    zh: "銀聯",
    en: "UnionPay",
    color: "#0B5AA8",
    tint: "rgba(11, 90, 168, 0.1)",
    gradient:
      "radial-gradient(100% 70% at 100% 0%, rgba(255, 255, 255, 0.24) 0%, transparent 60%), linear-gradient(145deg, #D91E2B 0%, #B31528 18%, #1258A8 54%, #078D91 100%)",
    markGradient: "linear-gradient(135deg, #E01B24 0%, #D7193F 24%, #0B4C9C 55%, #04A9A9 100%)",
  },
  {
    id: "JD Pay",
    zh: "京東支付",
    en: "JD Pay",
    color: "#E1251B",
    tint: "rgba(225, 37, 27, 0.1)",
    gradient:
      "radial-gradient(120% 80% at 85% 0%, rgba(255, 170, 150, 0.45) 0%, transparent 58%), linear-gradient(158deg, #FF5A45 0%, #D91A12 52%, #8E0B06 100%)",
  },
];

export function findPaymentBrand(id: PaymentMethod | null): PaymentBrand | null {
  if (!id) return null;
  return PAYMENT_METHODS.find((brand) => brand.id === id) ?? null;
}
