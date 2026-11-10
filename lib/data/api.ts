import { GLOSSARY } from "@/lib/data/glossary";
import { MENU_DATA } from "@/lib/data/menu";
import { menuById, mockDb, type DbCartRow } from "@/lib/data/mock-db";
import type { CartLine, GlossaryData, MenuItem, Order, PaymentMethod } from "@/lib/types";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MOCK DATA ACCESS LAYER  ·  RLS-SHAPED BY DESIGN
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Every cart and order read/write is scoped by `userId`. The mock "database"
 * filters those rows before they reach React, mirroring the policies in
 * /supabase/schema.sql:
 *
 *   create policy "cart_select_own" on cart_items
 *     for select using ((select auth.uid()) = user_id);
 *
 * In a real Supabase build, these functions become thin wrappers around:
 *
 *   supabase.from("cart_items").select("*").eq("user_id", userId)
 *
 * The `eq` is only a convenience: RLS remains the trust boundary. Replace the
 * bodies below without touching the UI or the store.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// fake network delays. without these the skeleton loaders never show up and
// the demo looks broken for half a second, so i added them on purpose.
const LATENCY = {
  menu: 850,
  cart: 1_050,
  orders: 950,
  glossary: 700,
  payment: 1_650,
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function assertUser(userId: string): void {
  if (!userId) {
    throw new Error("[RLS] Request blocked: a user_id is required for this query.");
  }
}

/**
 * The only way cart/order rows leave this module. This is the mock equivalent
 * of `user_id = auth.uid()` — another user's row can never be mapped by React.
 */
function scopeByUser<T extends { userId: string }>(rows: T[], userId: string, table: string): T[] {
  assertUser(userId);
  return rows.filter((row) => {
    if (row.userId !== userId) return false;
    return true;
  });
}

function hydrateCartRow(row: DbCartRow): CartLine | null {
  const item = menuById.get(row.menuItemId);
  if (!item) return null;
  return {
    id: row.id,
    userId: row.userId,
    menuItemId: row.menuItemId,
    name: item.name,
    englishName: item.englishName,
    pinyin: item.pinyin,
    image: item.image,
    unitPrice: item.price,
    quantity: row.quantity,
  };
}

/* ── Menu (public catalogue) ──────────────────────────────────────────────── */

export async function fetchMenu(): Promise<MenuItem[]> {
  await wait(LATENCY.menu);
  // console.log("got menu items:", MENU_DATA.length);

  return MENU_DATA.map((item) => ({
    ...item,
    description: { ...item.description },
    tag: { ...item.tag },
  }));
}

/* ── Cart (scoped to the active user) ─────────────────────────────────────── */

export async function fetchCart(userId: string): Promise<CartLine[]> {
  assertUser(userId);
  await wait(LATENCY.cart);
  return scopeByUser(mockDb.cartRows, userId, "cart_items")
    .map(hydrateCartRow)
    .filter((line): line is CartLine => line !== null);
}

export async function setCartQuantity(
  userId: string,
  menuItemId: string,
  quantity: number,
): Promise<void> {
  assertUser(userId);
  const safeQuantity = Math.max(0, Math.min(20, Math.floor(quantity)));
  const existing = mockDb.cartRows.find(
    (row) => row.userId === userId && row.menuItemId === menuItemId,
  );

  if (safeQuantity === 0) {
    mockDb.cartRows = mockDb.cartRows.filter(
      (row) => !(row.userId === userId && row.menuItemId === menuItemId),
    );
    return;
  }

  if (existing) {
    existing.quantity = safeQuantity;
    return;
  }

  if (!menuById.has(menuItemId)) {
    throw new Error(`Unknown menu item: ${menuItemId}`);
  }

  mockDb.cartRows.push({
    id: `cart_${userId}_${menuItemId}`,
    userId,
    menuItemId,
    quantity: safeQuantity,
    addedAt: new Date().toISOString(),
  });
}

export async function clearCart(userId: string): Promise<void> {
  assertUser(userId);
  mockDb.cartRows = mockDb.cartRows.filter((row) => row.userId !== userId);
}

/* ── Orders (scoped to the active user) ───────────────────────────────────── */

export async function fetchOrders(userId: string): Promise<Order[]> {
  assertUser(userId);
  await wait(LATENCY.orders);
  return scopeByUser(mockDb.orders, userId, "orders")
    .map((order) => ({
      ...order,
      items: order.items.map((item) => ({ ...item })),
    }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export interface CheckoutResult {
  order: Order;
  /** The refreshed, scoped order list — ready for the Orders tab. */
  orders: Order[];
}

export interface CheckoutOptions {
  /** The wallet the customer authorized in the payment sheet. */
  paymentMethod?: PaymentMethod;
  /**
   * Simulated gateway latency. Pass `0` when the UI has already animated the
   * authorization flow and only needs the order write to be committed.
   */
  latency?: number;
}

/**
 * Simulates a payment intent + order write. The server re-prices every line
 * from the menu table so a tampered client cart cannot change the total.
 */
export async function checkout(
  userId: string,
  sessionId: string,
  cart: CartLine[],
  options: CheckoutOptions = {},
): Promise<CheckoutResult> {
  const { paymentMethod = "Alipay", latency = LATENCY.payment } = options;

  assertUser(userId);
  if (!sessionId) throw new Error("[RLS] Request blocked: a session_id is required.");
  if (cart.length === 0) throw new Error("Cannot check out an empty cart.");

  if (cart.some((line) => line.userId !== userId)) {
    throw new Error("[RLS] Cart contains rows owned by another user.");
  }

  if (latency > 0) await wait(latency);

  const items = cart.map((line) => {
    const item = menuById.get(line.menuItemId);
    if (!item) throw new Error(`Unknown menu item: ${line.menuItemId}`);
    return {
      menuItemId: item.id,
      name: item.name,
      englishName: item.englishName,
      pinyin: item.pinyin,
      quantity: line.quantity,
      unitPrice: item.price,
    };
  });

  const order: Order = {
    id: `ord_${mockDb.nextOrderNumber}`,
    userId,
    sessionId,
    number: String(mockDb.nextOrderNumber++),
    status: "completed",
    createdAt: new Date().toISOString(),
    items,
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    paymentMethod,
  };

  mockDb.orders.unshift(order);
  mockDb.cartRows = mockDb.cartRows.filter((row) => row.userId !== userId);

  const scopedOrders = scopeByUser(mockDb.orders, userId, "orders")
    .map((entry) => ({ ...entry, items: entry.items.map((item) => ({ ...item })) }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return {
    order: { ...order, items: order.items.map((item) => ({ ...item })) },
    orders: scopedOrders,
  };
}

/* ── Glossary (public reference content) ──────────────────────────────────── */

export async function fetchGlossary(): Promise<GlossaryData> {
  await wait(LATENCY.glossary);
  return {
    food: GLOSSARY.food.map((entry) => ({ ...entry })),
    words: GLOSSARY.words.map((entry) => ({ ...entry })),
    phrases: GLOSSARY.phrases.map((entry) => ({ ...entry })),
  };
}
