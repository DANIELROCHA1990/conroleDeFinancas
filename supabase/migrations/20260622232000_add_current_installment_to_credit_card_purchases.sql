alter table public.credit_card_purchases
add column if not exists current_installment integer not null default 1
check (current_installment between 1 and 48);

alter table public.credit_card_purchases
drop constraint if exists credit_card_purchases_installment_progress_check;

alter table public.credit_card_purchases
add constraint credit_card_purchases_installment_progress_check
check (current_installment <= installment_count);
