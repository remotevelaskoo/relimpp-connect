'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { maskCnpj } from '@/lib/cnpj';
import { supplierStatusMeta } from '@/lib/supplierStatus';

interface Company {
  id: string;
  name: string;
}

interface SupplierRow {
  id: string;
  name: string;
  tradeName: string | null;
  cnpj: string | null;
  email: string | null;
  status: string;
}

const EMPTY = { name: '', tradeName: '', cnpj: '', email: '', phone: '' };

export default function FornecedoresPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [rows, setRows] = useState<SupplierRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (cid: string) => {
    if (!cid) {
      setRows([]);
      return;
    }
    try {
      setRows(await api<SupplierRow[]>(`/suppliers?companyId=${cid}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, []);

  useEffect(() => {
    api<Company[]>('/companies')
      .then((list) => {
        setCompanies(list);
        if (list.length > 0) setCompanyId(list[0].id);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar'),
      );
  }, []);

  useEffect(() => {
    load(companyId);
  }, [companyId, load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!companyId) {
      setError('Selecione uma empresa.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api('/suppliers', {
        method: 'POST',
        body: JSON.stringify({
          companyId,
          name: form.name,
          tradeName: form.tradeName || undefined,
          cnpj: form.cnpj || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
        }),
      });
      setForm({ ...EMPTY });
      await load(companyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cadastro e homologação de fornecedores (Administração › Cadastros).
      </p>

      <div className="mt-4 max-w-md">
        <label className="mb-1 block text-sm text-slate-600">Empresa</label>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand"
        >
          {companies.length === 0 && <option value="">Nenhuma empresa</option>}
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1"
        >
          <h2 className="font-semibold text-slate-700">Novo fornecedor</h2>

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
          <div>
            <label className="mb-1 block text-sm text-slate-600">E-mail</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Telefone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
            disabled={loading || !companyId}
            className="w-full rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Salvando…' : 'Pré-cadastrar fornecedor'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold text-slate-700">
            Fornecedores ({rows.length})
          </h2>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhum fornecedor cadastrado ainda.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Razão social</th>
                  <th className="py-2">CNPJ</th>
                  <th className="py-2">E-mail</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const meta = supplierStatusMeta(s.status);
                  return (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2">
                        <Link
                          href={`/dashboard/admin/cadastros/fornecedores/${s.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          {s.name}
                        </Link>
                        {s.tradeName && (
                          <span className="block text-xs text-slate-400">
                            {s.tradeName}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-slate-600">{s.cnpj ?? '—'}</td>
                      <td className="py-2 text-slate-600">{s.email ?? '—'}</td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
