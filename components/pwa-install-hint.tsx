'use client';

import { useEffect, useState } from 'react';

export function PwaInstallHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setShow(!isStandalone);
  }, []);
  if (!show) return null;
  return (
    <div className="card border border-brand-500/20">
      <p className="text-sm">
        Instala esta app desde el menú del navegador: <strong>Agregar a pantalla de inicio</strong>.
      </p>
    </div>
  );
}
