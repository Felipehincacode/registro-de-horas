'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const login = async () => {
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
        <h1 className="text-2xl font-semibold">Ingreso rápido</h1>
        <p className="text-sm text-slate-500">Usa magic link para entrar desde tu celular.</p>
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-3"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={login}
          disabled={loading || !email}
          className="w-full rounded-xl bg-brand-600 text-white py-3 font-medium disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Entrar'}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </main>
  );
}
