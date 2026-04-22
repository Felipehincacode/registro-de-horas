import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Horas Extra',
  description: 'Control personal de horas extra',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Horas Extra' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f8fafc'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
