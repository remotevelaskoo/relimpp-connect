'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PRIORITY_LABEL, statusMeta } from '@/lib/purchaseStatus';

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

interface Bucket {
  key: string;
  title: string;
  hint: string;
  statuses: string[];
}

// Seções alinhadas ao Blueprint V06 (docs/11-blueprint/v06-meu-trabalho.md).
const BUCKETS: Bucket[] = [
  {
    key: 'approval',
    title: 'Aguardando Aprovação',
    hint: 'Solicitações enviadas para decisão',
    statuses: ['SUBMITTED'],
  },
  {
    key: 'returned',
    title: 'Devolvidas para ajuste',
    hint: 'Precisam de correção e reenvio',
    statuses: ['RETURNED'],
  },
  {
    key: 'drafts',
    title: 'Rascunhos',
    hint: 'Ainda não enviadas',
    statuses: ['DRAFT'],
  },
];

export default function MeuTrabalhoPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setRows(await api<RequestRow[]>('/purchase-requests'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(id: string) {
    setBusyId(id);
    setError(null);
    try {
      await api(`/purchase-requests/${id}/approve`, { method: 'POST' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aprovar');
    } finally {
      setBusyId(null);
    }
  }

  const recent = [...rows]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Meu Trabalho</h1>
      <p className="mt-1 text-sm text-slate-500">
        Tudo que exige ação em um só lugar. Seções como Hoje, Atrasados e Assinaturas evoluem com SLA e
        assinatura (Blueprint V06).
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-6">
        {BUCKETS.map((bucket) => {
          const items = rows.filter((r) => bucket.statuses.includes(r.status));
          return (
            <section
              key={bucket.key}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-700">
                    {bucket.title}{' '}
                    <span className="text-slate-400">({items.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400">{bucket.hint}</p>
                </div>
              </div>
              {loading ? (
                <p className="text-sm text-slate-400">Carregando…</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-slate-400">Nada por aqui.</p>
              ) : (
                <ul className="divide-y">
                  {items.map((r) => {
                    const meta = statusMeta(r.status);
                    return (
                      <li
                        key={r.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-2"
                      >
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/compras/solicitacoes/${r.id}`}
                            className="font-medium text-brand hover:underline"
                          >
                            {r.number}
                          </Link>
                          <span className="ml-2 text-sm text-slate-600">
                            {r.justification}
                          </span>
                          <span className="ml-2 text-xs text-slate-400">
                            · {PRIORITY_LABEL[r.priority] ?? r.priority} ·{' '}
                            {r._count.items} item(ns)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${meta.className}`}
                          >
                            {meta.label}
                          </span>
                          {bucket.key === 'approval' && (
                            <button
                              disabled={busyId === r.id}
                              onClick={() => approve(r.id)}
                              className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              Aprovar
                            </button>
                          )}
                          <Link
                            href={`/dashboard/compras/solicitacoes/${r.id}`}
                            className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                          >
                            Abrir
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-700">Recentes</h2>
          {loading ? (
            <p className="text-sm text-slate-400">Carregando…</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum registro recente.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((r) => {
                const meta = statusMeta(r.status);
                return (
                  <li key={r.id} className="flex items-center justify-between py-2">
                    <Link
                      href={`/dashboard/compras/solicitacoes/${r.id}`}
                      className="text-sm font-medium text-brand hover:underline"
                    >
                      {r.number}
                    </Link>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${meta.className}`}>
                      {meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
