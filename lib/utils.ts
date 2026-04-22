import { clsx } from 'clsx';
import { TimeMovement } from '@/types/time-movement';

export const cn = (...inputs: Array<string | false | null | undefined>) => clsx(inputs);

export const movementSign = (type: TimeMovement['movement_type']) =>
  type === 'ganada' ? 1 : -1;

export const calculateBalance = (movements: TimeMovement[]) =>
  movements.reduce((acc, m) => acc + movementSign(m.movement_type) * Number(m.hours), 0);

export const fmtHours = (value: number) => `${value.toFixed(2)}h`;

export const toCsv = (movements: TimeMovement[]) => {
  const headers = [
    'Fecha',
    'Tipo',
    'Horas',
    'Motivo',
    'Notificación',
    'Notas',
    'Creado'
  ];
  const rows = movements.map((m) => [
    m.movement_date,
    m.movement_type,
    m.hours.toString(),
    `"${m.reason.replaceAll('"', '""')}"`,
    m.notification_status,
    `"${(m.notes ?? '').replaceAll('"', '""')}"`,
    m.created_at
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
