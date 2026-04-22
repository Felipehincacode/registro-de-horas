create extension if not exists pgcrypto;

create table if not exists public.time_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movement_date date not null,
  movement_type text not null check (movement_type in ('ganada','reclamada')),
  hours numeric(5,2) not null check (hours > 0),
  reason text not null,
  notification_status text not null default 'pendiente' check (notification_status in ('si','no','pendiente')),
  notes text null,
  quick_tag text null,
  source_context jsonb null,
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_time_movements_user_id on public.time_movements(user_id);
create index if not exists idx_time_movements_date on public.time_movements(movement_date desc);
create index if not exists idx_time_movements_type on public.time_movements(movement_type);
create index if not exists idx_time_movements_user_date on public.time_movements(user_id, movement_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_time_movements_updated_at on public.time_movements;
create trigger set_time_movements_updated_at
before update on public.time_movements
for each row execute function public.set_updated_at();

alter table public.time_movements enable row level security;

create policy "Users can select own movements"
on public.time_movements
for select
using (auth.uid() = user_id);

create policy "Users can insert own movements"
on public.time_movements
for insert
with check (auth.uid() = user_id);

create policy "Users can update own movements"
on public.time_movements
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own movements"
on public.time_movements
for delete
using (auth.uid() = user_id);
