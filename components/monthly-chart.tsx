'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function MonthlyChart({
  data
}: {
  data: { month: string; ganada: number; reclamada: number }[];
}) {
  return (
    <div className="card h-64">
      <h3 className="mb-3 font-semibold">Ganadas vs reclamadas</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="ganada" fill="#16a34a" radius={[6, 6, 0, 0]} />
          <Bar dataKey="reclamada" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
