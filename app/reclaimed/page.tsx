'use client';

import { format } from 'date-fns';
import { BottomNav } from '@/components/bottom-nav';
import { useMovements } from '@/hooks/use-movements';

export default function ReclaimedPage() {
  const { movements } = useMovements();
  const reclaimed = movements.filter((m) => m.movement_type === 'reclamada');

  return (
    <main className="mx-auto max-w-lg p-4 pb-28 space-y-3">
      <h1 className="text-2xl font-semibold">Horas reclamadas</h1>
      {reclaimed.map((movement) => (
        <article key={movement.id} className="card">
          <p className="text-xs text-slate-500">{format(new Date(movement.movement_date), 'dd/MM/yyyy')}</p>
          <p className="font-medium">{movement.reason}</p>
          <p className="text-sm">-{Number(movement.hours).toFixed(2)}h</p>
        </article>
      ))}
      {!reclaimed.length && <div className="card text-sm text-slate-500">Aún no reclamaste horas.</div>}
      <BottomNav />
    </main>
  );
}
