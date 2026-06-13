import { jsPDF } from "jspdf";

import { formatCurrency } from "@/lib/currency/format-currency";

/**
 * Campos privados como observacoes e descricoes sensiveis devem ser criptografados
 * antes de persistir. O PDF usa apenas agregados ja autorizados para evitar vazamento.
 */
export function generateSummaryPdf(summary: {
  cards: Array<{ label: string; value: number }>;
  monthlyBalance?: Array<{ month: string; balance: number }>;
}) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Relatorio financeiro", 14, 20);
  doc.setFontSize(11);
  doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, 14, 28);

  summary.cards.forEach((card, index) => {
    doc.text(`${card.label}: ${formatCurrency(card.value)}`, 14, 42 + index * 8);
  });

  if (summary.monthlyBalance?.length) {
    doc.text("Saldo mensal", 14, 100);
    summary.monthlyBalance.slice(0, 8).forEach((item, index) => {
      doc.text(`${item.month}: ${formatCurrency(item.balance)}`, 14, 108 + index * 8);
    });
  }

  return Buffer.from(doc.output("arraybuffer"));
}
