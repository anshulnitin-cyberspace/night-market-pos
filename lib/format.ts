export function formatPrice(value: number): string {
  return `¥${value}`;
}

export function formatOrderTime(iso: string, language: "en" | "zh"): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = new Intl.DateTimeFormat(language === "zh" ? "zh-TW" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  if (isToday) return `${language === "zh" ? "今晚" : "Tonight"} · ${time}`;
  if (isYesterday) return `${language === "zh" ? "昨天" : "Yesterday"} · ${time}`;

  const day = new Intl.DateTimeFormat(language === "zh" ? "zh-TW" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
  return `${day} · ${time}`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function maskId(id: string): string {
  if (id.length <= 12) return id;
  return `${id.slice(0, 10)}…`;
}
