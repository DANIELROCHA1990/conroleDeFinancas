"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/currency/format-currency";

const COLORS = ["#0f9f87", "#38bdf8", "#fb7185", "#f59e0b", "#6366f1", "#14b8a6", "#eab308"];

function formatChartCurrency(value: number | string | readonly (number | string)[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const amount = typeof rawValue === "number" ? rawValue : Number(rawValue);
  return Number.isFinite(amount) ? formatCurrency(amount) : "";
}

export function MonthlyRepassChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <div className="glass-card h-80 rounded-[1.75rem] p-4">
      <h3 className="text-lg font-medium">Repasse mensal</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatChartCurrency} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
