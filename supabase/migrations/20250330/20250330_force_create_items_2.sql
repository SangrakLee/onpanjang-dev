create table if not exists public.items (
  id bigint generated always as identity primary key,
  name text unique not null
);

create table if not exists public.product_prices (
  id bigint generated always as identity primary key,
  item_id bigint references items(id) on delete cascade,
  grade text,
  size text,
  price integer
);
