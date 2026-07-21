'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { maskCnpj } from '@/lib/cnpj';

interface Company {
  id: string;
  name: string;
  tradeName: string | null;
  cnpj: string | null;
  active: boolean;
  createdAt: string;
}

const EMPTY = { name: '', tradeName: '', cnpj: '', active: true };

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setCompanies(await api<Company[]>('/companies'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm({ ...EMPTY });
    setError(null);
  }

  function startEdit(company: Company) {
    setEditingId(company.id);
    setForm({
      name: company.name,
      tradeName: company.tradeName ?? '',
      cnpj: company.cnpj ?? '',
      active: company.active,
    });
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = {
      name: form.name,
      tradeName: form.tradeName || undefined,
      cnpj: form.cnpj || undefined,
      active: form.active,
    };
    try {
      if (editingId) {
        await api<Company>(`/companies/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await api<Company>('/companies', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      startCreate();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Empresas</h1>
      <p className="mt-1 text-sm text-slate-500">
        Estrutura organizacional — cadastro e edição de empresas (tenant raiz).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">
              {editingId ? 'Editar empresa' : 'Nova empresa'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={startCreate}
                className="text-xs text-slate-500 underline hover:text-slate-700"
              >
                Cancelar
              </button>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Razão social
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Nome fantasia
            </label>
            <input
              value={form.tradeName}
              onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">CNPJ</label>
            <input
              value={form.cnpj}
              onChange={(e) =>
                setForm({ ...form, cnpj: maskCnpj(e.target.value) })
              }
              inputMode="numeric"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              placeholder="xx.xxx.xxx/xxxx-xx"
              maxLength={18}
            />
          </div>

          {editingId && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
              Empresa ativa
            </label>
          )}

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
            {loading
              ? 'Salvando…'
              : editingId
                ? 'Salvar alterações'
                : 'Cadastrar empresa'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold text-slate-700">
            Empresas cadastradas ({companies.length})
          </h2>
          {companies.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhuma empresa cadastrada ainda.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Razão social</th>
                  <th className="py-2">Nome fantasia</th>
                  <th className="py-2">CNPJ</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr
                    key={c.id}
                    className={`border-b last:border-0 ${
                      editingId === c.id ? 'bg-brand/5' : ''
                    }`}
                  >
                    <td className="py-2 font-medium text-slate-700">
                      {c.name}
                    </td>
                    <td className="py-2 text-slate-600">{c.tradeName ?? '—'}</td>
                    <td className="py-2 text-slate-600">{c.cnpj ?? '—'}</td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          c.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {c.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => startEdit(c)}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        Editar
                      </button>
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
