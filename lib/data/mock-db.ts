import { MENU_ITEMS } from "@/lib/data/menu";
import { ACTIVE_SESSION, OTHER_SESSION_ID, OTHER_USER_ID } from "@/lib/data/session";
import type { Order, OrderItem } from "@/lib/types";

export interface DbCartRow {
  id: string;
  userId: string;
  menuItemId: string;
  quantity: number;
  addedAt: string;
}

export const menuById = new Map(MENU_ITEMS.map((item) => [item.id, item]));

function snapshot(menuItemId: string, quantity: number): OrderItem {
  const item = menuById.get(menuItemId);
  if (!item) throw new Error(`Unknown menu item: ${menuItemId}`);
  return {
    menuItemId,
    name: item.name,
    englishName: item.englishName,
    pinyin: item.pinyin,
    quantity,
    unitPrice: item.price,
  };
}

function makeOrder(
  number: string,
  minutesAgo: number,
  items: OrderItem[],
  options: { userId: string; sessionId: string; method: Order["paymentMethod"] },
): Order {
  return {
    id: `ord_${number}`,
    userId: options.userId,
    sessionId: options.sessionId,
    number,
    status: "completed",
    createdAt: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
    items,
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    paymentMethod: options.method,
  };
}

/**
 * Mock database. Cart rows and orders carry an explicit `userId` — just like
 * the `user_id` column you would use with Supabase RLS.
 */
export const mockDb = {
  menu: MENU_ITEMS,
  cartRows: [] as DbCartRow[],
  orders: [
    makeOrder("1046", 42, [snapshot("skewers", 2), snapshot("bubble-tea", 1)], {
      userId: ACTIVE_SESSION.userId,
      sessionId: ACTIVE_SESSION.sessionId,
      method: "Alipay",
    }),
    makeOrder(
      "1031",
      26 * 60,
      [snapshot("soup-dumplings", 1), snapshot("fried-noodles", 1), snapshot("tanghulu", 2)],
      {
        userId: ACTIVE_SESSION.userId,
        sessionId: ACTIVE_SESSION.sessionId,
        method: "WeChat Pay",
      },
    ),
    // Deliberately belongs to another user and must never reach the Orders tab.
    makeOrder("1048", 3 * 60, [snapshot("stinky-tofu", 1), snapshot("scallion-pancake", 1)], {
      userId: OTHER_USER_ID,
      sessionId: OTHER_SESSION_ID,
      method: "UnionPay",
    }),
  ] as Order[],
  nextOrderNumber: 1049,
};

export function resetCartForTests(): void {
  mockDb.cartRows = [];
}
