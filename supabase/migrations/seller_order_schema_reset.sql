
drop table if exists seller_delivery_discounts cascade;
drop table if exists delivery_region_fees cascade;
drop table if exists delivery_fees cascade;
drop table if exists provider_discounts cascade;
drop table if exists order_items cascade;
drop table if exists seller_orders cascade;
drop table if exists provider_products cascade;
drop table if exists provider_items cascade;


-- provider_items
create table provider_items (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null,
  item_name text not null,
  unit text
);

-- provider_products
create table provider_products (
  id uuid primary key default gen_random_uuid(),
  provider_item_id uuid references provider_items(id) on delete cascade,
  season text,
  price numeric
);

-- seller_orders
create table seller_orders (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null,
  order_date date,
  raw_data jsonb
);

-- order_items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  seller_order_id uuid references seller_orders(id) on delete cascade,
  item_name text,
  quantity numeric,
  unit_price numeric,
  total_price numeric
);

-- provider_discounts
create table provider_discounts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null,
  provider_product_id uuid references provider_products(id) on delete cascade,
  discount_type text check (discount_type in ('amount', 'percent')),
  discount_value numeric,
  note text
);

-- delivery_fees
create table delivery_fees (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null,
  season text,
  base_fee numeric
);

-- delivery_region_fees
create table delivery_region_fees (
  id uuid primary key default gen_random_uuid(),
  delivery_fee_id uuid references delivery_fees(id) on delete cascade,
  region_type text check (region_type in ('island', 'jeju')),
  additional_fee numeric
);

-- seller_delivery_discounts
create table seller_delivery_discounts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null,
  provider_id uuid not null,
  season text,
  discount_fee numeric,
  note text
);
