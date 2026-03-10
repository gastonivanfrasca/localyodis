alter table public.push_devices
add column if not exists keyword_filters text[] not null default '{}'::text[];
