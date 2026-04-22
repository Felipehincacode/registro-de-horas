'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loginWithPassword = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Sesión iniciada, redirigiendo...');
    setLoading(false);
  };

  const sendMagicLink = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });
    setMessage(error ? error.message : 'Te enviamos un magic link a tu correo.');
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Ingreso</h1>
        <p className="text-sm text-slate-500">Login con password o magic link.</p>
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-3"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={loginWithPassword}
          disabled={loading || !email || !password}
          className="w-full rounded-xl bg-brand-600 text-white py-3 font-medium disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Entrar con contraseña'}
        </button>
        <button
          onClick={sendMagicLink}
          disabled={loading || !email}
          className="w-full rounded-xl border py-3 font-medium disabled:opacity-50"
        >
          Enviar magic link
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </main>
  );
}
