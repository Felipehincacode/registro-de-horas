'use client';

import { useRef } from 'react';
import { TimeMovement } from '@/types/time-movement';
import { fmtHours, movementSign } from '@/lib/utils';
import { format } from 'date-fns';

interface Props {
  movements: TimeMovement[];
  onDuplicate: (movement: TimeMovement) => void;
  onDelete: (id: string) => void;
  onEdit: (movement: TimeMovement) => void;
}

type SwipeRowProps = Pick<Props, 'onDuplicate' | 'onDelete' | 'onEdit'> & {
  movement: TimeMovement;
};

export function MovementList({ movements, onDuplicate, onDelete, onEdit }: Props) {
  return (
    <div className="space-y-2">
      {movements.map((movement) => (
        <SwipeRow
          key={movement.id}
          movement={movement}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function SwipeRow({ movement, onDuplicate, onDelete, onEdit }: SwipeRowProps) {
  const startX = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleStart = (x: number) => {
    startX.current = x;
    longPressTimer.current = setTimeout(() => onEdit(movement), 500);
  };

  const handleEnd = (x: number) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    const delta = x - startX.current;
    if (delta > 90) onDuplicate(movement);
    if (delta < -90) onEdit(movement);
  };

  return (
    <article
      className="card active:scale-[0.99] transition"
      onTouchStart={(e) => handleStart(e.changedTouches[0].clientX)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(movement.id);
      }}
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-xs text-slate-500">{format(new Date(movement.movement_date), 'dd/MM/yyyy')}</p>
          <p className="font-medium">{movement.reason}</p>
          <p className="text-xs text-slate-500">Notif: {movement.notification_status}</p>
        </div>
        <div className="text-right">
          <p className={movement.movement_type === 'ganada' ? 'text-emerald-600 font-semibold' : 'text-orange-600 font-semibold'}>
            {movement.movement_type === 'ganada' ? '+' : '-'}{fmtHours(Number(movement.hours))}
          </p>
          <p className="text-xs text-slate-500">{movement.movement_type}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">Impacto saldo: {movementSign(movement.movement_type) * Number(movement.hours)}h</p>
    </article>
  );
}
