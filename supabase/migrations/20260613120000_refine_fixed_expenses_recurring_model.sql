alter table public.fixed_expenses
  add column if not exists amount_mode text not null default 'fixed';

alter table public.fixed_expenses
  drop constraint if exists fixed_expenses_amount_mode_check;

alter table public.fixed_expenses
  add constraint fixed_expenses_amount_mode_check
  check (amount_mode in ('fixed', 'variable'));

alter table public.expenses
  add column if not exists fixed_expense_id uuid references public.fixed_expenses(id) on delete set null,
  add column if not exists estimated_amount numeric(12,2),
  add column if not exists competence_month date;

update public.expenses
set estimated_amount = amount
where estimated_amount is null;

create index if not exists idx_expenses_fixed_expense_id_competence_month
  on public.expenses(user_id, fixed_expense_id, competence_month)
  where deleted_at is null and fixed_expense_id is not null;

create unique index if not exists uq_expenses_fixed_expense_month_active
  on public.expenses(user_id, fixed_expense_id, competence_month)
  where deleted_at is null and fixed_expense_id is not null and competence_month is not null;
