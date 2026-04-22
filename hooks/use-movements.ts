'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { buildSuggestions } from '@/lib/suggestions';
import { TimeMovement } from '@/types/time-movement';
import { calculateBalance } from '@/lib/utils';

export function useMovements() {
  const [movements, setMovements] = useState<TimeMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from('time_movements')
      .select('*')
      .order('movement_date', { ascending: false })
      .order('created_at', { ascending: false });
    setMovements((data ?? []) as TimeMovement[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const createMovement = async (payload: Partial<TimeMovement>) => {
    const supabase = createSupabaseBrowserClient();
    await supabase.from('time_movements').insert(payload);
    await fetchMovements();
  };

  const updateMovement = async (id: string, payload: Partial<TimeMovement>) => {
    const supabase = createSupabaseBrowserClient();
    await supabase.from('time_movements').update(payload).eq('id', id);
    await fetchMovements();
  };

  const deleteMovement = async (id: string) => {
    const supabase = createSupabaseBrowserClient();
    await supabase.from('time_movements').delete().eq('id', id);
    await fetchMovements();
  };

  const suggestions = useMemo(() => buildSuggestions(movements), [movements]);
  const totalWon = useMemo(
    () => movements.filter((m) => m.movement_type === 'ganada').reduce((a, b) => a + Number(b.hours), 0),
    [movements]
  );
  const totalClaimed = useMemo(
    () => movements.filter((m) => m.movement_type === 'reclamada').reduce((a, b) => a + Number(b.hours), 0),
    [movements]
  );

  const monthlyData = useMemo(() => {
    const map: Record<string, { month: string; ganada: number; reclamada: number }> = {};
    movements.forEach((movement) => {
      const key = format(new Date(movement.movement_date), 'MMM yy');
      map[key] ??= { month: key, ganada: 0, reclamada: 0 };
      map[key][movement.movement_type] += Number(movement.hours);
    });
    return Object.values(map).slice(-6);
  }, [movements]);

  return {
    movements,
    loading,
    fetchMovements,
    createMovement,
    updateMovement,
    deleteMovement,
    suggestions,
    balance: calculateBalance(movements),
    totalWon,
    totalClaimed,
    monthlyData
  };
}
