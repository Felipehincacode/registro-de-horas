'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, History, Home, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/reclaimed', label: 'Reclamadas', icon: WalletCards },
  { href: '/analytics', label: 'Resumen', icon: BarChart3 }
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 bottom-safe z-40">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 text-xs',
                  active ? 'text-brand-600' : 'text-slate-500'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
