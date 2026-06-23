"use client";

import { useMemo, useState } from "react";

import { FormField } from "@/components/ui/form-field";
import { MaskedDateInput } from "@/components/ui/masked-date-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveCreditCardPurchaseAction } from "@/features/credit-cards/credit-cards.actions";
import type { CreditCardListItem } from "@/features/credit-cards/repositories/credit-card-repository";
import { formatCurrency, formatCurrencyInputValue } from "@/lib/currency/format-currency";

type CategoryOption = { id: string; name: string; type: string };

function parseMaskedCurrency(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return 0;
  }

  return Number(digits) / 100;
}

export function CreditCardPurchaseForm({
  cards,
  categories,
}: {
  cards: CreditCardListItem[];
  categories: CategoryOption[];
}) {
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [currentInstallment, setCurrentInstallment] = useState("1");
  const [installmentCount, setInstallmentCount] = useState("1");

  const totalAmount = useMemo(() => {
    const parsedInstallmentAmount = parseMaskedCurrency(installmentAmount);
    const parsedInstallmentCount = Number(installmentCount) || 0;
    return Number((parsedInstallmentAmount * parsedInstallmentCount).toFixed(2));
  }, [installmentAmount, installmentCount]);

  const remainingInstallments = useMemo(() => {
    const parsedCurrentInstallment = Number(currentInstallment) || 1;
    const parsedInstallmentCount = Number(installmentCount) || 1;
    return Math.max(parsedInstallmentCount - parsedCurrentInstallment + 1, 0);
  }, [currentInstallment, installmentCount]);

  const totalAmountFormValue = useMemo(() => {
    if (totalAmount <= 0) {
      return "";
    }

    return totalAmount.toFixed(2).replace(".", ",");
  }, [totalAmount]);

  return (
    <form action={saveCreditCardPurchaseAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      <input name="amount" type="hidden" value={totalAmountFormValue} />
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Cartao">
          <select name="credit_card_id" defaultValue="" className="app-input" required>
            <option value="" disabled>Selecione um cartao</option>
            {cards.filter((card) => card.is_active).map((card) => (
              <option key={card.id} value={card.id}>{card.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Categoria">
          <select name="category_id" defaultValue="" className="app-input" required>
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Descricao da compra" className="md:col-span-2">
          <input name="description" placeholder="Ex.: Passagens da viagem" className="app-input" required />
        </FormField>
        <FormField label="Valor da parcela" hint="Valor individual de cada parcela.">
          <input
            name="installment_amount_display"
            inputMode="decimal"
            autoComplete="off"
            value={installmentAmount}
            onChange={(event) => setInstallmentAmount(formatCurrencyInputValue(event.target.value))}
            placeholder="R$ 0,00"
            className="app-input"
            aria-label="Valor da parcela"
            required
          />
        </FormField>
        <FormField label="Data da compra" hint="Formato dd/mm/aaaa.">
          <MaskedDateInput name="purchased_at" mode="date" className="app-input" placeholder="dd/mm/aaaa" required />
        </FormField>
        <FormField label="Parcela atual" hint="Numero da parcela em que a compra esta agora.">
          <input
            name="current_installment"
            type="number"
            min="1"
            max="48"
            value={currentInstallment}
            onChange={(event) => setCurrentInstallment(event.target.value)}
            className="app-input"
            required
          />
        </FormField>
        <FormField label="Quantidade de parcelas">
          <input
            name="installment_count"
            type="number"
            min="1"
            max="48"
            value={installmentCount}
            onChange={(event) => setInstallmentCount(event.target.value)}
            className="app-input"
            required
          />
        </FormField>
        <FormField label="Resumo das parcelas" hint="Exemplo: 5 de 12 significa que faltam 8 parcelas contando a atual.">
          <div className="app-input flex items-center justify-between text-sm">
            <span>{currentInstallment} de {installmentCount}</span>
            <strong>{remainingInstallments} restantes</strong>
          </div>
        </FormField>
        <FormField label="Valor total" hint="Calculado automaticamente pelas parcelas totais.">
          <div className="app-input flex items-center justify-between text-sm">
            <span>Total da compra</span>
            <strong>{totalAmount > 0 ? formatCurrency(totalAmount) : "R$ 0,00"}</strong>
          </div>
        </FormField>
      </div>
      <SubmitButton pendingLabel="Salvando..." iconName="check" className="ml-auto rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        Criar compra parcelada
      </SubmitButton>
    </form>
  );
}
