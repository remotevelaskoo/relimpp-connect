'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '@/lib/api';

interface LoginResponse {
  accessToken: string;
  user: { name: string; email: string; roles: string[] };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@relimpp.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.accessToken);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-brand">Relimpp Connect</h1>
          <p className="text-sm text-slate-500">
            Plataforma Corporativa Inteligente
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
