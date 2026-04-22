'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { NotificationStatus, TimeMovement } from '@/types/time-movement';

const schema = z.object({
  movement_date: z.string().min(1),
  movement_type: z.enum(['ganada', 'reclamada']),
  hours: z.coerce.number().positive(),
  reason: z.string().min(2),
  notification_status: z.enum(['si', 'no', 'pendiente']),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  topReasons: string[];
  recentReasons: string[];
  defaults?: Partial<FormValues>;
  onRepeatLast?: () => void;
}

export function MovementFormSheet({
  open,
  onClose,
  onSubmit,
  topReasons,
  recentReasons,
  defaults,
  onRepeatLast
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      movement_date: format(new Date(), 'yyyy-MM-dd'),
      movement_type: 'ganada',
      hours: 1,
      reason: '',
      notification_status: 'pendiente',
      notes: '',
      ...defaults
    }
  });

  useEffect(() => {
    if (defaults) form.reset({ ...form.getValues(), ...defaults });
  }, [defaults]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 pb-8 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Captura rápida</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <input type="date" className="w-full rounded-xl border p-3" {...form.register('movement_date')} />
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            {(['ganada', 'reclamada'] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => form.setValue('movement_type', type)}
                className={`rounded-lg py-2 text-sm ${
                  form.watch('movement_type') === type ? 'bg-white shadow font-semibold' : ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="rounded-xl border px-3 py-2" onClick={() => form.setValue('hours', Math.max(0.5, form.watch('hours') - 0.5))}>-</button>
            <input type="number" step="0.5" className="flex-1 rounded-xl border p-3 text-center" {...form.register('hours')} />
            <button type="button" className="rounded-xl border px-3 py-2" onClick={() => form.setValue('hours', form.watch('hours') + 0.5)}>+</button>
          </div>

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Motivo"
            {...form.register('reason')}
          />

          <div className="flex flex-wrap gap-2">
            {[...recentReasons, ...topReasons].slice(0, 8).map((reason) => (
              <button
                key={reason}
                type="button"
                className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                onClick={() => form.setValue('reason', reason)}
              >
                {reason}
              </button>
            ))}
          </div>

          <select className="w-full rounded-xl border p-3" {...form.register('notification_status')}>
            {(['si', 'no', 'pendiente'] as NotificationStatus[]).map((value) => (
              <option key={value} value={value}>
                Notificación: {value}
              </option>
            ))}
          </select>

          <textarea className="w-full rounded-xl border p-3" rows={2} placeholder="Notas (opcional)" {...form.register('notes')} />

          <div className="grid grid-cols-2 gap-2">
            <button type="submit" className="rounded-xl bg-brand-600 py-3 text-white font-medium">Guardar</button>
            <button type="button" onClick={onRepeatLast} className="rounded-xl border py-3">Duplicar último</button>
          </div>
        </form>
      </div>
    </div>
  );
}
