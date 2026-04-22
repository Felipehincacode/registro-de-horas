'use client';

import { useMemo, useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { MovementList } from '@/components/movement-list';
import { MovementFormSheet } from '@/components/movement-form-sheet';
import { useMovements } from '@/hooks/use-movements';
import { TimeMovement } from '@/types/time-movement';

export default function HistoryPage() {
  const { movements, suggestions, createMovement, deleteMovement, updateMovement } = useMovements();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'ganada' | 'reclamada'>('all');
  const [notification, setNotification] = useState<'all' | 'si' | 'no' | 'pendiente'>('all');
  const [editing, setEditing] = useState<TimeMovement | null>(null);

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

  const filtered = useMemo(
    () =>
      movements.filter((m) => {
        const okReason = m.reason.toLowerCase().includes(query.toLowerCase());
        const okType = type === 'all' || m.movement_type === type;
        const okNotification = notification === 'all' || m.notification_status === notification;
        return okReason && okType && okNotification;
      }),
    [movements, query, type, notification]
  );

  return (
    <main className="mx-auto max-w-lg p-4 pb-28 space-y-3">
      <h1 className="text-2xl font-semibold">Historial</h1>
      <input
        className="w-full rounded-xl border p-3"
        placeholder="Buscar por motivo"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-3 gap-2">
        <select className="rounded-xl border p-2 text-sm" value={type} onChange={(e) => setType(e.target.value as never)}>
          <option value="all">Todos</option><option value="ganada">Ganada</option><option value="reclamada">Reclamada</option>
        </select>
        <select className="rounded-xl border p-2 text-sm col-span-2" value={notification} onChange={(e) => setNotification(e.target.value as never)}>
          <option value="all">Notificación: todas</option><option value="si">Sí</option><option value="no">No</option><option value="pendiente">Pendiente</option>
        </select>
      </div>
      <MovementList
        movements={filtered}
        onDuplicate={(movement) => createMovement({ ...movement, id: undefined, movement_date: new Date().toISOString().slice(0, 10) })}
        onDelete={deleteMovement}
        onEdit={setEditing}
      />

      <BottomNav />
      <MovementFormSheet
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        onSubmit={async (values) => {
          if (editing) await updateMovement(editing.id, values as Partial<TimeMovement>);
          setEditing(null);
        }}
        topReasons={suggestions.topReasons}
        recentReasons={suggestions.recentReasons}
        defaults={editingDefaults}
      />
    </main>
  );
}
