'use client';

import { Plus } from 'lucide-react';

export function FabAdd({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full bg-brand-600 text-white shadow-lg active:scale-95"
      aria-label="Nuevo movimiento"
    >
      <Plus className="mx-auto" />
    </button>
  );
}
