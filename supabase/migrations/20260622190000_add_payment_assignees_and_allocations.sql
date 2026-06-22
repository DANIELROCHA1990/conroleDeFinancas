create table if not exists public.payment_assignees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fixed_expense_monthly_allocations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fixed_expense_id uuid not null references public.fixed_expenses(id) on delete cascade,
  expense_id uuid not null references public.expenses(id) on delete cascade,
  assignee_id uuid,
  assignee_name text not null,
  amount numeric(12,2) not null check (amount >= 0),
  competence_month date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fixed_expenses
  add column if not exists assignment_mode text not null default 'single' check (assignment_mode in ('single', 'all')),
  add column if not exists assignee_id uuid references public.payment_assignees(id) on delete set null;

create index if not exists payment_assignees_user_id_idx on public.payment_assignees(user_id);
create unique index if not exists payment_assignees_user_id_name_key
  on public.payment_assignees(user_id, lower(name))
  where deleted_at is null;
create index if not exists fixed_expense_monthly_allocations_expense_id_idx on public.fixed_expense_monthly_allocations(expense_id);
create index if not exists fixed_expense_monthly_allocations_competence_month_idx on public.fixed_expense_monthly_allocations(user_id, competence_month);

drop trigger if exists set_payment_assignees_updated_at on public.payment_assignees;
create trigger set_payment_assignees_updated_at
before update on public.payment_assignees
for each row execute function public.set_updated_at();

drop trigger if exists set_fixed_expense_monthly_allocations_updated_at on public.fixed_expense_monthly_allocations;
create trigger set_fixed_expense_monthly_allocations_updated_at
before update on public.fixed_expense_monthly_allocations
for each row execute function public.set_updated_at();

do $$
declare
  table_name text;
begin
  foreach table_name in array array['payment_assignees', 'fixed_expense_monthly_allocations']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists %I_select on public.%I', table_name || '_owner', table_name);
    execute format('drop policy if exists %I_insert on public.%I', table_name || '_owner', table_name);
    execute format('drop policy if exists %I_update on public.%I', table_name || '_owner', table_name);
    execute format('drop policy if exists %I_delete on public.%I', table_name || '_owner', table_name);

    execute format('create policy %I_select on public.%I for select using (user_id = auth.uid())', table_name || '_owner', table_name);
    execute format('create policy %I_insert on public.%I for insert with check (user_id = auth.uid())', table_name || '_owner', table_name);
    execute format('create policy %I_update on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid())', table_name || '_owner', table_name);
    execute format('create policy %I_delete on public.%I for delete using (user_id = auth.uid())', table_name || '_owner', table_name);
  end loop;
end $$;
