create table if not exists sellers (
  id uuid primary key default gen_random_uuid(),
  seller_name text not null unique
);

insert into sellers (seller_name) values
  ('맛있는날'), ('아고이'), ('달콤한컴퍼니'), ('드래곤스튜디오'), ('유일기획'),
  ('에코푸드'), ('농업회사법인 주식회사 다올팜'), ('산해직송'), ('신나는과일'),
  ('진짜 친구 농수산'), ('장보남(하진)'), ('한입정원')
on conflict (seller_name) do nothing;
