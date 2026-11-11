-- ============================================================================
--  肄業大排檔 · Yìyè Dàpáidàng — Supabase schema + Row-Level Security
-- ============================================================================
--  The client demo in /lib/data/api.ts mirrors these policies in memory.
--  Run this in the Supabase SQL editor, then replace the mock repository
--  bodies with real supabase-js calls. The UI never needs to change.
--
--  Trust model
--  -----------
--  * The database, not the browser, decides which rows a user can see.
--  * `auth.uid()` is the only source of identity in every policy.
--  * Prices are re-read from `menu_items` inside `place_order`; a client
--    cannot pass its own total.
--  * Clients may read their own orders but may not update or delete them.
-- ============================================================================

create extension if not exists pgcrypto;

-- ── Menu (public catalogue) ─────────────────────────────────────────────────

create table if not exists public.menu_items (
  id              text primary key,
  name            text not null,
  pinyin          text not null,
  english_name    text not null,
  description_en  text not null,
  description_zh  text not null,
  price_cents     integer not null check (price_cents >= 0),
  image_path      text not null,
  tag_en          text,
  tag_zh          text,
  stall           text,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.menu_items enable row level security;

drop policy if exists "menu_items_public_read" on public.menu_items;
create policy "menu_items_public_read"
  on public.menu_items
  for select
  to anon, authenticated
  using (active);

-- Menu writes are admin-only. No client policy is created on purpose.

-- ── Cart (owned by auth.uid()) ──────────────────────────────────────────────

create table if not exists public.cart_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  menu_item_id  text not null references public.menu_items (id),
  quantity      integer not null check (quantity between 1 and 20),
  added_at      timestamptz not null default now(),
  unique (user_id, menu_item_id)
);

create index if not exists cart_items_user_id_idx on public.cart_items (user_id);

alter table public.cart_items enable row level security;

drop policy if exists "cart_select_own" on public.cart_items;
create policy "cart_select_own"
  on public.cart_items
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "cart_insert_own" on public.cart_items;
create policy "cart_insert_own"
  on public.cart_items
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "cart_update_own" on public.cart_items;
create policy "cart_update_own"
  on public.cart_items
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_delete_own"
  on public.cart_items
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ── Orders (owned by auth.uid()) ────────────────────────────────────────────

create sequence if not exists public.order_number_seq start 1049;

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  session_id      text not null,
  number          bigint not null default nextval('public.order_number_seq'),
  status          text not null default 'pending'
                    check (status in ('pending', 'completed', 'cancelled')),
  payment_method  text not null
                    check (payment_method in ('Alipay', 'WeChat Pay', 'UnionPay', 'JD Pay')),
  total_cents     integer not null check (total_cents >= 0),
  created_at      timestamptz not null default now(),
  unique (number)
);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Inserts/updates happen inside `place_order` (security definer), never
-- directly from the client. No client insert/update/delete policy exists.

create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete cascade,
  menu_item_id      text not null references public.menu_items (id),
  name_snapshot     text not null,
  english_snapshot  text not null,
  pinyin_snapshot   text not null,
  quantity          integer not null check (quantity between 1 and 20),
  unit_price_cents  integer not null check (unit_price_cents >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = (select auth.uid())
    )
  );

-- ── Checkout RPC ────────────────────────────────────────────────────────────
--  Re-prices every line from menu_items, writes the order + items, and clears
--  the caller's cart atomically. `security definer` is required so the write
--  can bypass the read-only order policies; the function still authorises
--  itself with auth.uid().

create or replace function public.place_order(
  p_session_id text,
  p_payment_method text
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order public.orders;
  v_total integer;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_payment_method not in ('Alipay', 'WeChat Pay', 'UnionPay', 'JD Pay') then
    raise exception 'Unsupported payment method';
  end if;

  if not exists (select 1 from public.cart_items where user_id = v_user_id) then
    raise exception 'Cannot check out an empty cart';
  end if;

  select coalesce(sum(m.price_cents * c.quantity), 0)
    into v_total
  from public.cart_items c
  join public.menu_items m on m.id = c.menu_item_id
  where c.user_id = v_user_id
    and m.active;

  if v_total <= 0 then
    raise exception 'Cart total is invalid';
  end if;

  insert into public.orders (user_id, session_id, status, payment_method, total_cents)
  values (v_user_id, p_session_id, 'completed', p_payment_method, v_total)
  returning * into v_order;

  insert into public.order_items (
    order_id, menu_item_id, name_snapshot, english_snapshot,
    pinyin_snapshot, quantity, unit_price_cents
  )
  select
    v_order.id, m.id, m.name, m.english_name,
    m.pinyin, c.quantity, m.price_cents
  from public.cart_items c
  join public.menu_items m on m.id = c.menu_item_id
  where c.user_id = v_user_id
    and m.active;

  delete from public.cart_items where user_id = v_user_id;

  return v_order;
end;
$$;

revoke all on function public.place_order(text, text) from public;
grant execute on function public.place_order(text, text) to authenticated;

-- ── Seed menu rows (prices in cents) ────────────────────────────────────────

insert into public.menu_items
  (id, name, pinyin, english_name, description_en, description_zh,
   price_cents, image_path, tag_en, tag_zh, stall)
values
  ('skewers', '烤串', 'kǎo chuàn', 'Cumin Lamb Skewers',
   'Charred over open flame, dusted with cumin and chili.',
   '炭火現烤，撒上孜然與辣椒。', 1800, '/food/skewers.webp', 'Grill', '炭烤', '07'),
  ('soup-dumplings', '小籠包', 'xiǎo lóng bāo', 'Soup Dumplings',
   'Thin-skinned pockets of pork and hot, savory broth.',
   '薄皮包著豬肉與滾燙湯汁。', 3200, '/food/soup-dumplings.webp', 'Steam', '蒸點', '02'),
  ('stinky-tofu', '臭豆腐', 'chòu dòu fu', 'Stinky Tofu',
   'Crisp fermented tofu with garlic, chili and pickles.',
   '外酥內嫩的發酵豆腐，配蒜蓉與泡菜。', 2200, '/food/stinky-tofu.webp', 'Fried', '油炸', '11'),
  ('bubble-tea', '珍珠奶茶', 'zhēn zhū nǎi chá', 'Pearl Milk Tea',
   'Silky black tea, fresh milk and chewy brown-sugar pearls.',
   '濃醇紅茶、鮮奶與黑糖珍珠。', 1600, '/food/bubble-tea.webp', 'Drink', '飲品', '05'),
  ('fried-dumplings', '煎餃', 'jiān jiǎo', 'Pan-fried Dumplings',
   'Golden-bottomed dumplings with a ginger-soy dip.',
   '金黃脆底的豬肉煎餃，附薑醋醬。', 2600, '/food/fried-dumplings.webp', 'Crisp', '香煎', '02'),
  ('tanghulu', '糖葫蘆', 'táng hú lu', 'Candied Hawthorn',
   'Glass-crisp sugar shell around tart hawthorn berries.',
   '糖衣薄脆，裹住酸甜山楂。', 1200, '/food/tanghulu.webp', 'Sweet', '甜點', '14'),
  ('fried-noodles', '炒麵', 'chǎo miàn', 'Wok-fried Noodles',
   'Smoky noodles tossed with scallion, sprouts and soy.',
   '鑊氣十足，拌入蔥花、豆芽與醬油。', 2400, '/food/fried-noodles.webp', 'Wok', '鑊氣', '09'),
  ('scallion-pancake', '蔥油餅', 'cōng yóu bǐng', 'Scallion Pancake',
   'Flaky layered flatbread with crisp edges and sweet scallion.',
   '層層酥香的蔥油餅，邊緣金黃。', 1400, '/food/scallion-pancake.webp', 'Griddle', '現烙', '09')
on conflict (id) do nothing;
