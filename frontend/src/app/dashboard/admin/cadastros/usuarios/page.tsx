'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Company {
  id: string;
  name: string;
}

interface RoleScope {
  id: string;
  role: { name: string };
  company: { name: string } | null;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  active: boolean;
  roleScopes: RoleScope[];
}

const EMPTY = { name: '', email: '', password: '', companyId: '' };

export default function UsuariosPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await api<UserRow[]>('/users'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, []);

  useEffect(() => {
    api<Company[]>('/companies')
      .then(setCompanies)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'));
    load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          companyId: form.companyId || undefined,
        }),
      });
      setForm({ ...EMPTY });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Usuários</h1>
      <p className="mt-1 text-sm text-slate-500">
        Contas de acesso, vínculo organizacional e papéis (Administração › Cadastros).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1"
        >
          <h2 className="font-semibold text-slate-700">Novo usuário</h2>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">E-mail</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Senha</label>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Empresa</label>
            <select
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand"
            >
              <option value="">Sem vínculo</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Salvando…' : 'Criar usuário'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold text-slate-700">
            Usuários ({rows.length})
          </h2>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum usuário cadastrado ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Nome</th>
                  <th className="py-2">E-mail</th>
                  <th className="py-2">Papéis</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2">
                      <Link
                        href={`/dashboard/admin/cadastros/usuarios/${u.id}`}
                        className="font-medium text-brand hover:underline"
                      >
                        {u.name}
                      </Link>
                    </td>
                    <td className="py-2 text-slate-600">{u.email}</td>
                    <td className="py-2 text-slate-600">
                      {u.roleScopes.length === 0
                        ? '—'
                        : u.roleScopes
                            .map((rs) => `${rs.role.name}${rs.company ? ` (${rs.company.name})` : ''}`)
                            .join(', ')}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          u.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {u.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
