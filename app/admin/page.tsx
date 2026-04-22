'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { useProfile } from '@/hooks/use-profile';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Profile, UserRole } from '@/types/profile';

export default function AdminPage() {
  const { profile, isAdmin, loading } = useProfile();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [message, setMessage] = useState('');

  const loadProfiles = async () => {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setProfiles((data as Profile[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) loadProfiles();
  }, [isAdmin]);

  const createUser = async () => {
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, role })
    });
    const data = await res.json();
    setMessage(data.message ?? (res.ok ? 'Usuario creado.' : 'Error al crear usuario.'));
    if (res.ok) {
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('user');
      loadProfiles();
    }
  };

  if (loading) return <main className="p-4">Cargando...</main>;
  if (!profile) return <main className="p-4">Sin sesión.</main>;
  if (!isAdmin) return <main className="p-4">No autorizado.</main>;

  return (
    <main className="mx-auto max-w-lg p-4 pb-28 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <section className="card space-y-2">
        <h2 className="font-semibold">Crear perfil</h2>
        <input className="w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="Contraseña temporal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <select className="w-full rounded-xl border p-3" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={createUser} className="w-full rounded-xl bg-brand-600 py-3 text-white">Crear usuario</button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </section>

      <section className="card space-y-2">
        <h2 className="font-semibold">Perfiles</h2>
        {profiles.map((p) => (
          <div key={p.id} className="rounded-xl border p-2 text-sm">
            <p className="font-medium">{p.email}</p>
            <p>Rol: {p.role}</p>
            <p>Activo: {p.is_active ? 'Sí' : 'No'}</p>
          </div>
        ))}
      </section>
      <BottomNav />
    </main>
  );
}
