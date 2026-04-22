import { format } from 'date-fns';
import { TimeMovement } from '@/types/time-movement';

export interface Suggestions {
  suggestedType: 'ganada' | 'reclamada';
  suggestedNotification: 'si' | 'no' | 'pendiente';
  topReasons: string[];
  recentReasons: string[];
  contextualHint: string;
}

export const buildSuggestions = (movements: TimeMovement[]): Suggestions => {
  const sorted = [...movements].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );
  const typeCount = sorted.reduce(
    (acc, m) => ({ ...acc, [m.movement_type]: (acc[m.movement_type] ?? 0) + 1 }),
    {} as Record<string, number>
  );
  const notifCount = sorted.reduce(
    (acc, m) => ({ ...acc, [m.notification_status]: (acc[m.notification_status] ?? 0) + 1 }),
    {} as Record<string, number>
  );
  const reasonCount = sorted.reduce((acc, m) => {
    acc[m.reason] = (acc[m.reason] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReasons = Object.entries(reasonCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason]) => reason);

  const recentReasons = Array.from(new Set(sorted.map((m) => m.reason))).slice(0, 3);

  const now = new Date();
  const day = format(now, 'EEEE');
  const dayReason = sorted.find(
    (m) => format(new Date(m.movement_date), 'EEEE') === day
  )?.reason;

  return {
    suggestedType: (typeCount.ganada ?? 0) >= (typeCount.reclamada ?? 0) ? 'ganada' : 'reclamada',
    suggestedNotification:
      (notifCount.si ?? 0) >= Math.max(notifCount.no ?? 0, notifCount.pendiente ?? 0)
        ? 'si'
        : 'pendiente',
    topReasons,
    recentReasons,
    contextualHint: dayReason
      ? `Sugerencia: sueles registrar "${dayReason}" los ${day.toLowerCase()}.`
      : 'Sugerencia: usa los chips para registrar más rápido.'
  };
};
