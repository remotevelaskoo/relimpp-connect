'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Company {
  id: string;
  name: string;
  tradeName: string | null;
  cnpj: string | null;
  active: boolean;
  createdAt: string;
}

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api<Company>('/companies', {
        method: 'POST',
        body: JSON.stringify({
          name,
          tradeName: tradeName || undefined,
          cnpj: cnpj || undefined,
        }),
      });
      setName('');
      setTradeName('');
      setCnpj('');
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
        Estrutura organizacional — cadastro de empresas (tenant raiz).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1"
        >
          <h2 className="font-semibold text-slate-700">Nova empresa</h2>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Razão social
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">CNPJ</label>
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              placeholder="00.000.000/0000-00"
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
            {loading ? 'Salvando…' : 'Cadastrar empresa'}
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
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
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
