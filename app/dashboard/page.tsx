'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BottomNav } from '@/components/bottom-nav';
import { FabAdd } from '@/components/fab-add';
import { MovementFormSheet } from '@/components/movement-form-sheet';
import { MovementList } from '@/components/movement-list';
import { MonthlyChart } from '@/components/monthly-chart';
import { PwaInstallHint } from '@/components/pwa-install-hint';
import { useMovements } from '@/hooks/use-movements';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { toCsv } from '@/lib/utils';
import { MovementType, TimeMovement } from '@/types/time-movement';
import { useProfile } from '@/hooks/use-profile';

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TimeMovement | null>(null);
  const { isAdmin } = useProfile();

  const {
    movements,
    createMovement,
    updateMovement,
    deleteMovement,
    fetchMovements,
    suggestions,
    balance,
    totalWon,
    totalClaimed,
    monthlyData
  } = useMovements();

  usePullToRefresh(fetchMovements);

  const lastMovement = movements[0];

  const save = async (values: Record<string, unknown>) => {
    if (editing) {
      await updateMovement(editing.id, values as Partial<TimeMovement>);
      setEditing(null);
      toast.success('Movimiento actualizado');
    } else {
      await createMovement(values as Partial<TimeMovement>);
      toast.success('Movimiento guardado');
    }
    setOpen(false);
  };

  const quickActions: Array<{
    label: string;
    payload: { movement_type: MovementType; hours: number };
  }> = [
    { label: '+1h ganada', payload: { movement_type: 'ganada', hours: 1 } },
    { label: '+2h ganada', payload: { movement_type: 'ganada', hours: 2 } },
    { label: 'reclamar 1h', payload: { movement_type: 'reclamada', hours: 1 } }
  ];

  const frequentTemplate = useMemo(() => ({
    movement_date: new Date().toISOString().slice(0, 10),
    movement_type: suggestions.suggestedType,
    notification_status: suggestions.suggestedNotification,
    reason: suggestions.topReasons[0] ?? suggestions.recentReasons[0] ?? '',
    hours: 1
  }), [suggestions]);

  const editingDefaults = editing
    ? {
        movement_date: editing.movement_date,
        movement_type: editing.movement_type,
        hours: Number(editing.hours),
        reason: editing.reason,
        notification_status: editing.notification_status,
        notes: editing.notes ?? undefined
      }
    : undefined;

  return (
    <main className="mx-auto max-w-lg p-4 pb-28 space-y-4">
      <PwaInstallHint />
      <section className="card">
        <p className="text-sm text-slate-500">Horas a favor</p>
        <h1 className="text-4xl font-bold">{balance.toFixed(2)}h</h1>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <p className="rounded-xl bg-emerald-50 p-2">Ganadas: {totalWon.toFixed(2)}h</p>
          <p className="rounded-xl bg-orange-50 p-2">Reclamadas: {totalClaimed.toFixed(2)}h</p>
        </div>
      </section>


      {isAdmin && (
        <a href="/admin" className="card block text-center font-medium text-brand-700">
          Ir a panel admin
        </a>
      )}
      <section className="card">
        <p className="text-sm font-medium">Acciones rápidas</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {quickActions.map((item) => (
            <button
              key={item.label}
              className="rounded-xl border p-2 text-sm"
              onClick={() => {
                createMovement({ ...frequentTemplate, ...item.payload });
                toast.success('Movimiento rápido guardado');
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            className="rounded-xl border p-2 text-sm"
            onClick={() => {
              if (!lastMovement) return;
              createMovement({ ...lastMovement, id: undefined, movement_date: new Date().toISOString().slice(0, 10) });
              toast.success('Último movimiento duplicado');
            }}
          >
            Repetir último
          </button>
        </div>
      </section>

      <section className="card">
        <p className="text-sm font-medium">Motivos sugeridos</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.topReasons.map((reason) => (
            <button
              key={reason}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              {reason}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">{suggestions.contextualHint}</p>
      </section>

      <MonthlyChart data={monthlyData} />

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Movimientos recientes</h2>
          <a
            className="text-sm text-brand-700"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(toCsv(movements))}`}
            download="movimientos.csv"
          >
            Exportar CSV
          </a>
        </div>
        <MovementList
          movements={movements.slice(0, 10)}
          onDuplicate={(movement) => createMovement({ ...movement, id: undefined, movement_date: new Date().toISOString().slice(0, 10) })}
          onDelete={(id) => {
            if (confirm('¿Eliminar movimiento?')) {
              deleteMovement(id);
              toast.success('Movimiento eliminado');
            }
          }}
          onEdit={(movement) => {
            setEditing(movement);
            setOpen(true);
          }}
        />
      </section>

      <FabAdd onClick={() => { setEditing(null); setOpen(true); }} />
      <BottomNav />

      <MovementFormSheet
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        topReasons={suggestions.topReasons}
        recentReasons={suggestions.recentReasons}
        defaults={editingDefaults ?? frequentTemplate}
        onRepeatLast={() => {
          if (lastMovement) {
            setEditing(lastMovement);
          }
        }}
      />
    </main>
  );
}
