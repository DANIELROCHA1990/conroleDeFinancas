export type Installment = {
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
};

export function calculateInstallments(totalAmount: number, totalInstallments: number) {
  const totalInCents = Math.round(totalAmount * 100);
  const baseAmount = Math.floor(totalInCents / totalInstallments);
  const remainder = totalInCents % totalInstallments;

  return Array.from({ length: totalInstallments }, (_, index) => {
    const amountInCents = baseAmount + (index < remainder ? 1 : 0);

    return {
      installmentNumber: index + 1,
      totalInstallments,
      amount: amountInCents / 100,
    };
  });
}
