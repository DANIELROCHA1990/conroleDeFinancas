create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense', 'both')),
  color text not null,
  icon text not null,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id),
  description text not null,
  notes_encrypted text,
  amount numeric(14,2) not null,
  received_on date not null,
  status text not null check (status in ('received', 'expected')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id),
  description text not null,
  notes_encrypted text,
  amount numeric(14,2) not null,
  due_date date not null,
  paid_at date,
  status text not null check (status in ('pending', 'paid', 'late', 'cancelled')),
  payment_method text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.fixed_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id),
  name text not null,
  notes_encrypted text,
  default_amount numeric(14,2) not null,
  due_day integer not null check (due_day between 1 and 31),
  notify_before_days integer not null default 3,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  bank_name text not null,
  last_four_digits text,
  limit_amount numeric(14,2) not null,
  best_purchase_day integer,
  closing_day integer not null,
  due_day integer not null,
  is_active boolean not null default true,
  private_notes_encrypted text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.credit_card_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  credit_card_id uuid not null references public.credit_cards(id) on delete cascade,
  category_id uuid references public.categories(id),
  description text not null,
  notes_encrypted text,
  amount numeric(14,2) not null,
  purchased_at date not null,
  installment_count integer not null default 1 check (installment_count between 1 and 48),
  status text not null check (status in ('open', 'posted', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.credit_card_installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purchase_id uuid not null references public.credit_card_purchases(id) on delete cascade,
  installment_number integer not null,
  total_installments integer not null,
  amount numeric(14,2) not null,
  competency_month date not null,
  status text not null check (status in ('open', 'closed', 'paid', 'late')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reserves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  objective text,
  target_amount numeric(14,2) not null,
  current_amount numeric(14,2) not null default 0,
  target_date date,
  status text not null check (status in ('active', 'paused', 'completed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id),
  credit_card_id uuid references public.credit_cards(id),
  month_ref date not null,
  limit_amount numeric(14,2) not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  priority text not null,
  is_read boolean not null default false,
  related_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.incomes enable row level security;
alter table public.expenses enable row level security;
alter table public.fixed_expenses enable row level security;
alter table public.credit_cards enable row level security;
alter table public.credit_card_purchases enable row level security;
alter table public.credit_card_installments enable row level security;
alter table public.reserves enable row level security;
alter table public.budgets enable row level security;
alter table public.notifications enable row level security;

create or replace function public.apply_owner_rls(table_name text)
returns void
language plpgsql
as $$
begin
  execute format('drop policy if exists %I_select on public.%I', table_name || '_owner', table_name);
  execute format('drop policy if exists %I_insert on public.%I', table_name || '_owner', table_name);
  execute format('drop policy if exists %I_update on public.%I', table_name || '_owner', table_name);
  execute format('drop policy if exists %I_delete on public.%I', table_name || '_owner', table_name);
  execute format('create policy %I_select on public.%I for select using (user_id = auth.uid())', table_name || '_owner', table_name);
  execute format('create policy %I_insert on public.%I for insert with check (user_id = auth.uid())', table_name || '_owner', table_name);
  execute format('create policy %I_update on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid())', table_name || '_owner', table_name);
  execute format('create policy %I_delete on public.%I for delete using (user_id = auth.uid())', table_name || '_owner', table_name);
end;
$$;

select public.apply_owner_rls('categories');
select public.apply_owner_rls('incomes');
select public.apply_owner_rls('expenses');
select public.apply_owner_rls('fixed_expenses');
select public.apply_owner_rls('credit_cards');
select public.apply_owner_rls('credit_card_purchases');
select public.apply_owner_rls('credit_card_installments');
select public.apply_owner_rls('reserves');
select public.apply_owner_rls('budgets');
select public.apply_owner_rls('notifications');

drop policy if exists profiles_owner_select on public.profiles;
drop policy if exists profiles_owner_insert on public.profiles;
drop policy if exists profiles_owner_update on public.profiles;

create policy profiles_owner_select on public.profiles for select using (user_id = auth.uid());
create policy profiles_owner_insert on public.profiles for insert with check (user_id = auth.uid());
create policy profiles_owner_update on public.profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_incomes_user_id_received_on on public.incomes(user_id, received_on desc);
create index if not exists idx_expenses_user_id_due_date on public.expenses(user_id, due_date desc);
create index if not exists idx_fixed_expenses_user_id on public.fixed_expenses(user_id);
create index if not exists idx_credit_cards_user_id on public.credit_cards(user_id);
create index if not exists idx_credit_card_purchases_user_id on public.credit_card_purchases(user_id);
create index if not exists idx_credit_card_installments_user_id_competency_month on public.credit_card_installments(user_id, competency_month desc);
create index if not exists idx_reserves_user_id on public.reserves(user_id);
create index if not exists idx_budgets_user_id_month_ref on public.budgets(user_id, month_ref desc);
create index if not exists idx_notifications_user_id_is_read on public.notifications(user_id, is_read);

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger set_incomes_updated_at before update on public.incomes for each row execute function public.set_updated_at();
create trigger set_expenses_updated_at before update on public.expenses for each row execute function public.set_updated_at();
create trigger set_fixed_expenses_updated_at before update on public.fixed_expenses for each row execute function public.set_updated_at();
create trigger set_credit_cards_updated_at before update on public.credit_cards for each row execute function public.set_updated_at();
create trigger set_credit_card_purchases_updated_at before update on public.credit_card_purchases for each row execute function public.set_updated_at();
create trigger set_credit_card_installments_updated_at before update on public.credit_card_installments for each row execute function public.set_updated_at();
create trigger set_reserves_updated_at before update on public.reserves for each row execute function public.set_updated_at();
create trigger set_budgets_updated_at before update on public.budgets for each row execute function public.set_updated_at();
create trigger set_notifications_updated_at before update on public.notifications for each row execute function public.set_updated_at();
