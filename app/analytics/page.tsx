'use client';

import { BottomNav } from '@/components/bottom-nav';
import { MonthlyChart } from '@/components/monthly-chart';
import { useMovements } from '@/hooks/use-movements';

export default function AnalyticsPage() {
  const { movements, monthlyData, totalWon, totalClaimed, balance, suggestions } = useMovements();

  const topReason = suggestions.topReasons[0] ?? '-';
  const fridayClaimed = movements.filter((m) => new Date(m.movement_date).getDay() === 5 && m.movement_type === 'reclamada').length;

  return (
    <main className="mx-auto max-w-lg p-4 pb-28 space-y-3">
      <h1 className="text-2xl font-semibold">Resumen</h1>
      <div className="card">
        <p>Saldo actual: <strong>{balance.toFixed(2)}h</strong></p>
        <p>Total ganadas: <strong>{totalWon.toFixed(2)}h</strong></p>
        <p>Total reclamadas: <strong>{totalClaimed.toFixed(2)}h</strong></p>
      </div>
      <MonthlyChart data={monthlyData} />
      <div className="card text-sm space-y-1">
        <p>Motivo más frecuente: <strong>{topReason}</strong></p>
        <p>Has reclamado más veces en viernes: <strong>{fridayClaimed}</strong> registros.</p>
      </div>
      <BottomNav />
    </main>
  );
}
