create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text null,
  role text not null default 'user' check (role in ('admin','user')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create index if not exists idx_profiles_role on public.profiles(role);
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', null),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_time_movements_updated_at on public.time_movements;
create trigger set_time_movements_updated_at
before update on public.time_movements
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid
      and p.role = 'admin'
      and p.is_active = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.time_movements enable row level security;

create policy "Users can read own profile or admin reads all"
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Users can update own profile basic fields"
on public.profiles
for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.profiles where id = auth.uid())
);

create policy "Admins can insert profiles"
on public.profiles
for insert
with check (public.is_admin(auth.uid()));

create policy "Admins can update any profile"
on public.profiles
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

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
