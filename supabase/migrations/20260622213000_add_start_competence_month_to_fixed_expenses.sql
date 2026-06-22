alter table public.fixed_expenses
  add column if not exists start_competence_month date;

update public.fixed_expenses
set start_competence_month = date_trunc('month', coalesce(created_at, now()))::date
where start_competence_month is null;

alter table public.fixed_expenses
  alter column start_competence_month set not null;
