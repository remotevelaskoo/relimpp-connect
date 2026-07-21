'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Company {
  id: string;
  name: string;
}

interface OrgUnit {
  id: string;
  companyId: string;
  name: string;
  code: string | null;
  active: boolean;
}

interface Props {
  title: string;
  subtitle: string;
  resource: string; // ex.: "branches"
  entityLabel: string; // ex.: "filial"
}

const EMPTY = { name: '', code: '', active: true };

export default function OrgUnitManager({
  title,
  subtitle,
  resource,
  entityLabel,
}: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string>('');
  const [items, setItems] = useState<OrgUnit[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(
    async (cid: string) => {
      if (!cid) {
        setItems([]);
        return;
      }
      try {
        setItems(await api<OrgUnit[]>(`/${resource}?companyId=${cid}`));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar');
      }
    },
    [resource],
  );

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
    loadItems(companyId);
  }, [companyId, loadItems]);

  function startCreate() {
    setEditingId(null);
    setForm({ ...EMPTY });
    setError(null);
  }

  function startEdit(item: OrgUnit) {
    setEditingId(item.id);
    setForm({ name: item.name, code: item.code ?? '', active: item.active });
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!companyId) {
      setError('Selecione uma empresa primeiro.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (editingId) {
        await api(`/${resource}/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: form.name,
            code: form.code || undefined,
            active: form.active,
          }),
        });
      } else {
        await api(`/${resource}`, {
          method: 'POST',
          body: JSON.stringify({
            companyId,
            name: form.name,
            code: form.code || undefined,
          }),
        });
      }
      startCreate();
      await loadItems(companyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

      <div className="mt-4 max-w-md">
        <label className="mb-1 block text-sm text-slate-600">Empresa</label>
        <select
          value={companyId}
          onChange={(e) => {
            setCompanyId(e.target.value);
            startCreate();
          }}
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
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">
              {editingId ? `Editar ${entityLabel}` : `Nova ${entityLabel}`}
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
            <label className="mb-1 block text-sm text-slate-600">Código</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
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
              Ativa
            </label>
          )}

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
            {loading ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Cadastrar'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold text-slate-700">
            {title} ({items.length})
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum registro ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Código</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b last:border-0 ${
                      editingId === item.id ? 'bg-brand/5' : ''
                    }`}
                  >
                    <td className="py-2 font-medium text-slate-700">
                      {item.name}
                    </td>
                    <td className="py-2 text-slate-600">{item.code ?? '—'}</td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          item.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => startEdit(item)}
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
