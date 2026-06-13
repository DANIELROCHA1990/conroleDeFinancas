create table if not exists public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  account_type text not null check (account_type in ('checking', 'savings', 'cash', 'investment')),
  institution text,
  initial_balance numeric(14,2) not null default 0,
  current_balance numeric(14,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.credit_card_bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  credit_card_id uuid not null references public.credit_cards(id) on delete cascade,
  competency_month date not null,
  due_date date not null,
  closing_date date not null,
  total_amount numeric(14,2) not null default 0,
  status text not null check (status in ('open', 'closed', 'paid', 'late')),
  paid_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reserve_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reserve_id uuid not null references public.reserves(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('deposit', 'withdrawal')),
  amount numeric(14,2) not null check (amount > 0),
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  reminder_date date not null,
  module_name text not null,
  related_record_id uuid,
  is_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_name text not null,
  action_name text not null,
  record_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.financial_accounts enable row level security;
alter table public.credit_card_bills enable row level security;
alter table public.reserve_transactions enable row level security;
alter table public.reminders enable row level security;
alter table public.audit_logs enable row level security;

select public.apply_owner_rls('financial_accounts');
select public.apply_owner_rls('credit_card_bills');
select public.apply_owner_rls('reserve_transactions');
select public.apply_owner_rls('reminders');
select public.apply_owner_rls('audit_logs');

create index if not exists idx_financial_accounts_user_id on public.financial_accounts(user_id);
create index if not exists idx_credit_card_bills_user_id_month on public.credit_card_bills(user_id, competency_month desc);
create index if not exists idx_reserve_transactions_user_id on public.reserve_transactions(user_id);
create index if not exists idx_reminders_user_id_date on public.reminders(user_id, reminder_date desc);
create index if not exists idx_audit_logs_user_id_created_at on public.audit_logs(user_id, created_at desc);

create trigger set_financial_accounts_updated_at before update on public.financial_accounts for each row execute function public.set_updated_at();
create trigger set_credit_card_bills_updated_at before update on public.credit_card_bills for each row execute function public.set_updated_at();
create trigger set_reserve_transactions_updated_at before update on public.reserve_transactions for each row execute function public.set_updated_at();
create trigger set_reminders_updated_at before update on public.reminders for each row execute function public.set_updated_at();
create trigger set_audit_logs_updated_at before update on public.audit_logs for each row execute function public.set_updated_at();
