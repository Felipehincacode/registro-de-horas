'use client';

import { useEffect, useState } from 'react';
import { MovementType, NotificationStatus } from '@/types/time-movement';

const KEY = 'time-tracker-preferences';

export function useLocalPreferences() {
  const [preferredType, setPreferredType] = useState<MovementType>('ganada');
  const [preferredNotification, setPreferredNotification] =
    useState<NotificationStatus>('pendiente');

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.preferredType) setPreferredType(parsed.preferredType);
    if (parsed.preferredNotification) setPreferredNotification(parsed.preferredNotification);
  }, []);

  const savePrefs = (next: {
    preferredType: MovementType;
    preferredNotification: NotificationStatus;
  }) => {
    setPreferredType(next.preferredType);
    setPreferredNotification(next.preferredNotification);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return { preferredType, preferredNotification, savePrefs };
}
