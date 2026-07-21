'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PRIORITY_LABEL, statusMeta } from '@/lib/purchaseStatus';

interface Company {
  id: string;
  name: string;
}

interface ItemForm {
  description: string;
  specification: string;
  quantity: string;
  unit: string;
  estimatedPrice: string;
}

interface RequestRow {
  id: string;
  number: string;
  justification: string;
  priority: string;
  status: string;
  createdAt: string;
  requester: { name: string };
  _count: { items: number };
}

const emptyItem = (): ItemForm => ({
  description: '',
  specification: '',
  quantity: '1',
  unit: 'un',
  estimatedPrice: '',
});

export default function SolicitacoesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [justification, setJustification] = useState('');
  const [priority, setPriority] = useState('medium');
  const [items, setItems] = useState<ItemForm[]>([emptyItem()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (cid: string) => {
    if (!cid) {
      setRows([]);
      return;
    }
    try {
      setRows(await api<RequestRow[]>(`/purchase-requests?companyId=${cid}`));
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

  function updateItem(idx: number, patch: Partial<ItemForm>) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!companyId) {
      setError('Selecione uma empresa.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api('/purchase-requests', {
        method: 'POST',
        body: JSON.stringify({
          companyId,
          justification,
          priority,
          items: items.map((i) => ({
            description: i.description,
            specification: i.specification || undefined,
            quantity: Number(i.quantity),
            unit: i.unit,
            estimatedPrice: i.estimatedPrice
              ? Number(i.estimatedPrice)
              : undefined,
          })),
        }),
      });
      setJustification('');
      setPriority('medium');
      setItems([emptyItem()]);
      await load(companyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Solicitações de Compra</h1>
      <p className="mt-1 text-sm text-slate-500">
        Crie solicitações e acompanhe o fluxo de aprovação (rascunho → aprovação).
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

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"
        >
          <h2 className="font-semibold text-slate-700">Nova solicitação</h2>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Justificativa
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              rows={2}
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand"
            >
              {Object.entries(PRIORITY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Itens</span>
              <button
                type="button"
                onClick={() => setItems((p) => [...p, emptyItem()])}
                className="text-xs text-brand underline"
              >
                + Adicionar item
              </button>
            </div>
            {items.map((item, idx) => (
              <div
                key={idx}
                className="space-y-2 rounded-lg border border-slate-200 p-3"
              >
                <input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(idx, { description: e.target.value })
                  }
                  placeholder="Descrição do item"
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
                  required
                  minLength={2}
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, { quantity: e.target.value })
                    }
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Qtd"
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
                    required
                  />
                  <input
                    value={item.unit}
                    onChange={(e) => updateItem(idx, { unit: e.target.value })}
                    placeholder="Unid."
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
                    required
                  />
                  <input
                    value={item.estimatedPrice}
                    onChange={(e) =>
                      updateItem(idx, { estimatedPrice: e.target.value })
                    }
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Preço est."
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setItems((p) => p.filter((_, i) => i !== idx))
                    }
                    className="text-xs text-red-600 underline"
                  >
                    Remover item
                  </button>
                )}
              </div>
            ))}
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
            {loading ? 'Salvando…' : 'Criar solicitação (rascunho)'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
          <h2 className="mb-3 font-semibold text-slate-700">
            Solicitações ({rows.length})
          </h2>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma solicitação ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2">Número</th>
                  <th className="py-2">Justificativa</th>
                  <th className="py-2">Prioridade</th>
                  <th className="py-2">Itens</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const meta = statusMeta(r.status);
                  return (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2">
                        <Link
                          href={`/dashboard/compras/solicitacoes/${r.id}`}
                          className="font-medium text-brand hover:underline"
                        >
                          {r.number}
                        </Link>
                      </td>
                      <td className="max-w-[240px] truncate py-2 text-slate-600">
                        {r.justification}
                      </td>
                      <td className="py-2 text-slate-600">
                        {PRIORITY_LABEL[r.priority] ?? r.priority}
                      </td>
                      <td className="py-2 text-slate-600">{r._count.items}</td>
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
