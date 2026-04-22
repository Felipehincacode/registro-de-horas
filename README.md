# Horas Extra (PWA personal)

App web personal para registrar horas extra ganadas/reclamadas con experiencia mobile-first, captura ultrarrápida y sugerencias contextuales basadas en historial.

## Arquitectura (resumen corto)

- **Next.js 14 App Router + TypeScript** para UI y rutas.
- **Supabase** para auth, perfiles y base de datos (`time_movements`).
- **Hook central `useMovements`** para CRUD, métricas y sugerencias.
- **Panel Admin** para crear usuarios/perfiles (requiere service role key en backend).
- **UI mobile-first** con bottom nav + FAB + bottom sheet.
- **PWA** con `manifest.webmanifest` + `next-pwa` (service worker en build de producción).

## Qué necesito de ti para integrar Supabase

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY` (solo backend, para que tu perfil admin pueda crear usuarios)
4. Tu correo de admin (para asignarte rol `admin` en SQL)

## Login y perfil admin

- Login disponible con **email+password** y **magic link** en `/auth`.
- Se crea tabla `profiles` con roles `admin|user`.
- El panel `/admin` permite crear usuarios y definir rol.
- Solo admins pueden listar perfiles y crear nuevos perfiles/usuarios.

## Cómo se reduce fricción

- Fecha de hoy preseleccionada.
- Tipo y estado de notificación sugeridos por patrón reciente.
- Chips de motivos frecuentes y recientes.
- Acciones rápidas: `+1h`, `+2h`, `reclamar 1h`, `repetir último`.
- Duplicar desde historial con swipe derecha.
- Edición rápida con swipe izquierda o tap largo.
- Captura desde bottom sheet sin cambiar de pantalla.

## Contexto e historial para sugerencias

Se calcula localmente con los movimientos del usuario:
- tipo más habitual,
- notificación más usada,
- top 5 motivos frecuentes,
- top 3 motivos recientes,
- hint contextual por día de la semana.

## Gestos implementados

- **Swipe derecha** sobre registro: duplicar.
- **Swipe izquierda**: editar.
- **Tap largo** (500ms): abrir edición rápida.
- **Long-press/context menu**: eliminar.
- **Pull-to-refresh**: refresca datos al deslizar hacia abajo en el tope.
- Cierre de sheet tocando backdrop.

## Estructura

- `app/` rutas y páginas
- `components/` UI reutilizable
- `hooks/` estado y lógica de interacción
- `lib/` utilidades y clientes Supabase
- `types/` tipos TS
- `supabase/` SQL listo para ejecutar
- `public/` manifest, iconos SVG y offline page
- `styles/` estilos globales

## Requisitos

- Node.js 20+
- Proyecto Supabase con auth email habilitado

## Variables de entorno

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Configura:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Configuración Supabase (SQL)

1. Abre Supabase SQL Editor.
2. Ejecuta `supabase/schema.sql` completo.
3. Asigna tu usuario como admin (reemplaza tu correo):

```sql
update public.profiles
set role = 'admin'
where email = 'tu-correo-admin@dominio.com';
```

Incluye:
- creación de tablas `profiles` y `time_movements`,
- índices,
- trigger `updated_at`,
- trigger para crear perfil al crear usuario auth,
- RLS + policies (usuario y admin).

## Ejecutar local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Deploy en Vercel

1. Push del repo a GitHub.
2. Importar proyecto en Vercel.
3. Configurar env vars en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy.

## PWA

- `public/manifest.webmanifest` configurado para instalación.
- `next-pwa` genera service worker en build de producción.
- `public/offline.html` para fallback básico sin red.
- Hint in-app para “Agregar a pantalla de inicio”.

Para probar PWA:

```bash
npm run build
npm run start
```

Luego abre en móvil y usa instalar/agregar a inicio.

## Funciones incluidas

- Dashboard con saldo actual, totales y gráfica mensual.
- Captura rápida en bottom sheet.
- Historial con filtros por tipo/notificación y búsqueda por motivo.
- Vista de reclamadas.
- Resumen analítico con tendencias.
- Exportación CSV.
- Editar, duplicar, eliminar movimientos.
- Admin: crear usuarios y gestionar perfiles.
