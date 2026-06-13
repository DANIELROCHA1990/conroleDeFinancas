"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4ade80", "#38bdf8", "#fb7185", "#fbbf24", "#c084fc"];

export function SpendingByCategoryChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <div className="glass-card h-80 rounded-[1.75rem] p-4">
      <h3 className="text-lg font-medium">Gastos por categoria</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
