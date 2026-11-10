// little helpers, nothing fancy
// (i moved these out of App.jsx because it was 900 lines and my laptop fan
//  sounded like a jet engine)

export function formatPrice(value: number): string {
  // TODO: use Intl.NumberFormat one day, for now the yen sign is fine
  if (value < 0) {
    console.log("WHY IS THIS NEGATIVE", value);
    return `-¥${Math.abs(value)}`;
  }
  return "¥" + value;
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

  // i know this is 3 ternaries in a row, but it reads fine honestly
  if (isToday) return `${language === "zh" ? "今晚" : "Tonight"} · ${time}`;
  if (isYesterday) return `${language === "zh" ? "昨天" : "Yesterday"} · ${time}`;

  const day = new Intl.DateTimeFormat(language === "zh" ? "zh-TW" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
  return `${day} · ${time}`;
}

/**
 * classnames helper. i copied the idea from a stackoverflow post from 2018
 * (the one that uses filter(Boolean).join(" ")). rewrote it as a loop because
 * i kept forgetting what filter(Boolean) actually does.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  let out = "";
  for (let i = 0; i < classes.length; i++) {
    const className = classes[i];
    if (className) {
      if (out.length > 0) out += " ";
      out += className;
    }
  }
  return out;
}

export function maskId(id: string): string {
  // long ids break the layout on my phone so chop chop
  if (id.length <= 12) return id;
  return `${id.slice(0, 10)}…`;
}

// export function oldMaskThing(id) {
//   return id.substring(0, 8) + "...";   // didn't work with the ellipsis font
// }
