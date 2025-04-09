insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '선물용 정품', '대과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 8500.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '선물용 정품'
  and pi.size = '대과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '선물용 정품', '중과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 8500.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '선물용 정품'
  and pi.size = '중과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '선물용 정품', '소과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 8500.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '선물용 정품'
  and pi.size = '소과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '선물용 정품', '꼬마과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 8500.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '선물용 정품'
  and pi.size = '꼬마과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '정품', '대과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 7300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '정품'
  and pi.size = '대과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '정품', '중과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 7300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '정품'
  and pi.size = '중과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '정품', '소과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 7300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '정품'
  and pi.size = '소과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '정품', '꼬마과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 7300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '정품'
  and pi.size = '꼬마과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '가정용', '대과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 6200.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '가정용'
  and pi.size = '대과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '가정용', '중과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 6200.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '가정용'
  and pi.size = '중과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '가정용', '소과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 6200.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '가정용'
  and pi.size = '소과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '가정용', '꼬마과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 6200.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '가정용'
  and pi.size = '꼬마과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '가정용', '랜덤혼합과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 6200.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '가정용'
  and pi.size = '랜덤혼합과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '못난이', '대과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 5300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '못난이'
  and pi.size = '대과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '못난이', '중과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 5300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '못난이'
  and pi.size = '중과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '못난이', '소과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 5300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '못난이'
  and pi.size = '소과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '못난이', '꼬마과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 5300.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '못난이'
  and pi.size = '꼬마과';

insert into provider_items (provider_id, item_name, grade, size, unit)
select id, '참외', '못난이', '랜덤혼합과', 'kg'
from providers
where provider_name = '마이달데이'
on conflict do nothing;

insert into provider_products (provider_item_id, season_date, price)
select pi.id, '2025-03-31', 4500.0
from provider_items pi
join providers p on pi.provider_id = p.id
where p.provider_name = '마이달데이'
  and pi.item_name = '참외'
  and pi.grade = '못난이'
  and pi.size = '랜덤혼합과';