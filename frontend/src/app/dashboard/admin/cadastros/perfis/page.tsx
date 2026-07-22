'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface RoleRow {
  id: string;
  key: string;
  name: string;
  description: string | null;
  permissions: { permission: { key: string } }[];
}

const EMPTY = { key: '', name: '', description: '' };

export default function PerfisPage() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await api<RoleRow[]>('/roles'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api('/roles', {
        method: 'POST',
        body: JSON.stringify({
          key: form.key,
          name: form.name,
          description: form.description || undefined,
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
      <h1 className="text-2xl font-bold text-slate-800">Perfis</h1>
      <p className="mt-1 text-sm text-slate-500">
        Papéis e conjuntos de permissão (Administração › Cadastros).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1"
        >
          <h2 className="font-semibold text-slate-700">Novo perfil</h2>

          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Key (identificador único)
            </label>
            <input
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              placeholder="ex.: auditor_fiscal"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              required
              pattern="[a-z][a-z0-9_]*"
              title="letras minúsculas, números e _"
            />
          </div>
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
            <label className="mb-1 block text-sm text-slate-600">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
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
            className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Salvando…' : 'Criar perfil'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold text-slate-700">
            Perfis ({rows.length})
          </h2>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum perfil cadastrado ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Key</th>
                  <th className="py-2">Permissões</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2">
                      <Link
                        href={`/dashboard/admin/cadastros/perfis/${r.id}`}
                        className="font-medium text-brand hover:underline"
                      >
                        {r.name}
                      </Link>
                      {r.description && (
                        <span className="block text-xs text-slate-400">{r.description}</span>
                      )}
                    </td>
                    <td className="py-2 font-mono text-xs text-slate-600">{r.key}</td>
                    <td className="py-2 text-slate-600">{r.permissions.length}</td>
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
