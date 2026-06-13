"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function MonthlyBalanceChart({
  data,
}: {
  data: Array<{ month: string; balance: number }>;
}) {
  return (
    <div className="glass-card h-80 rounded-[1.75rem] p-4">
      <h3 className="text-lg font-medium">Saldo mensal</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="balance" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="month" stroke="#9fb2cc" />
          <YAxis stroke="#9fb2cc" />
          <Tooltip />
          <Area type="monotone" dataKey="balance" stroke="#4ade80" fill="url(#balance)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
