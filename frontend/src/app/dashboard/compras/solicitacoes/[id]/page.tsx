'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PRIORITY_LABEL, statusMeta } from '@/lib/purchaseStatus';

interface Item {
  id: string;
  description: string;
  specification: string | null;
  quantity: number;
  unit: string;
  estimatedPrice: number | null;
}

interface Event {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface RequestDetail {
  id: string;
  number: string;
  status: string;
  priority: string;
  justification: string;
  createdAt: string;
  company: { name: string };
  requester: { name: string; email: string };
  items: Item[];
  events: Event[];
}

export default function SolicitacaoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [req, setReq] = useState<RequestDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setReq(await api<RequestDetail>(`/purchase-requests/${id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(
    action: string,
    body?: Record<string, unknown>,
  ) {
    setError(null);
    setBusy(true);
    try {
      await api(`/purchase-requests/${id}/${action}`, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na ação');
    } finally {
      setBusy(false);
    }
  }

  function withReason(action: 'reject' | 'return' | 'cancel') {
    const field = action === 'cancel' ? 'reason' : 'justification';
    const label =
      action === 'reject'
        ? 'Justificativa da rejeição:'
        : action === 'return'
          ? 'Justificativa da devolução:'
          : 'Motivo do cancelamento:';
    const value = window.prompt(label);
    if (value === null) return;
    if (value.trim().length < 3) {
      setError('Informe pelo menos 3 caracteres.');
      return;
    }
    act(action, { [field]: value.trim() });
  }

  if (!req) {
    return (
      <div className="text-slate-500">
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">{error}</p>
        ) : (
          'Carregando…'
        )}
      </div>
    );
  }

  const meta = statusMeta(req.status);
  const canEdit = ['DRAFT', 'RETURNED'].includes(req.status);
  const canDecide = req.status === 'SUBMITTED';
  const canCancel = ['DRAFT', 'SUBMITTED', 'RETURNED'].includes(req.status);
  const total = req.items.reduce(
    (acc, i) => acc + (i.estimatedPrice ?? 0) * i.quantity,
    0,
  );

  return (
    <div className="max-w-4xl">
      <Link
        href="/dashboard/compras/solicitacoes"
        className="text-sm text-brand hover:underline"
      >
        ← Voltar para solicitações
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{req.number}</h1>
        <span className={`rounded-full px-3 py-1 text-sm ${meta.className}`}>
          {meta.label}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {req.company.name} · Solicitante: {req.requester.name} · Prioridade:{' '}
        {PRIORITY_LABEL[req.priority] ?? req.priority}
      </p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {canEdit && (
          <button
            disabled={busy}
            onClick={() => act('submit')}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            Enviar para aprovação
          </button>
        )}
        {canDecide && (
          <>
            <button
              disabled={busy}
              onClick={() => act('approve')}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              Aprovar
            </button>
            <button
              disabled={busy}
              onClick={() => withReason('return')}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
            >
              Devolver
            </button>
            <button
              disabled={busy}
              onClick={() => withReason('reject')}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              Rejeitar
            </button>
          </>
        )}
        {canCancel && (
          <button
            disabled={busy}
            onClick={() => withReason('cancel')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-60"
          >
            Cancelar
          </button>
        )}
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-semibold text-slate-700">Justificativa</h2>
        <p className="text-sm text-slate-600">{req.justification}</p>
      </section>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-700">
          Itens ({req.items.length})
        </h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-2">Descrição</th>
              <th className="py-2">Qtd</th>
              <th className="py-2">Unid.</th>
              <th className="py-2 text-right">Preço est.</th>
            </tr>
          </thead>
          <tbody>
            {req.items.map((i) => (
              <tr key={i.id} className="border-b last:border-0">
                <td className="py-2 text-slate-700">
                  {i.description}
                  {i.specification && (
                    <span className="block text-xs text-slate-400">
                      {i.specification}
                    </span>
                  )}
                </td>
                <td className="py-2 text-slate-600">{i.quantity}</td>
                <td className="py-2 text-slate-600">{i.unit}</td>
                <td className="py-2 text-right text-slate-600">
                  {i.estimatedPrice != null
                    ? i.estimatedPrice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-right text-sm font-medium text-slate-700">
          Total estimado:{' '}
          {total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
      </section>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-700">Timeline</h2>
        <ol className="space-y-3">
          {req.events.map((e) => (
            <li key={e.id} className="flex gap-3">
              <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
              <div>
                <p className="text-sm text-slate-700">{e.message}</p>
                <p className="text-xs text-slate-400">
                  {new Date(e.createdAt).toLocaleString('pt-BR')} · {e.type}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
