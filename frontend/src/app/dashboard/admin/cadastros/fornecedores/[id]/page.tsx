'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { maskCnpj } from '@/lib/cnpj';
import { supplierStatusMeta } from '@/lib/supplierStatus';

interface SupplierEvent {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface SupplierDetail {
  id: string;
  name: string;
  tradeName: string | null;
  cnpj: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  active: boolean;
  company: { name: string };
  events: SupplierEvent[];
}

export default function FornecedorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', tradeName: '', cnpj: '', email: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<SupplierDetail>(`/suppliers/${id}`);
      setSupplier(data);
      setForm({
        name: data.name,
        tradeName: data.tradeName ?? '',
        cnpj: data.cnpj ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(action: string, body?: Record<string, unknown>) {
    setError(null);
    setBusy(true);
    try {
      await api(`/suppliers/${id}/${action}`, {
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

  function withReason(action: 'suspend' | 'block' | 'inactivate', label: string) {
    const value = window.prompt(label);
    if (value === null) return;
    if (value.trim().length < 3) {
      setError('Informe pelo menos 3 caracteres.');
      return;
    }
    act(action, { reason: value.trim() });
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api(`/suppliers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: form.name,
          tradeName: form.tradeName || undefined,
          cnpj: form.cnpj || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
        }),
      });
      setEditing(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!window.confirm('Excluir este fornecedor pré-cadastrado? Esta ação não pode ser desfeita.')) {
      return;
    }
    setError(null);
    try {
      await api(`/suppliers/${id}`, { method: 'DELETE' });
      router.push('/dashboard/admin/cadastros/fornecedores');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  }

  if (!supplier) {
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

  const meta = supplierStatusMeta(supplier.status);
  const status = supplier.status;
  const canDelete = status === 'PRE_REGISTERED';
  const canSubmitForReview = status === 'PRE_REGISTERED';
  const canApprove = status === 'UNDER_REVIEW';
  const canSuspend = status === 'APPROVED' || status === 'RESTRICTED';
  const canBlock = ['PRE_REGISTERED', 'UNDER_REVIEW', 'APPROVED', 'RESTRICTED', 'SUSPENDED'].includes(status);
  const canReactivate = status === 'SUSPENDED' || status === 'BLOCKED';
  const canInactivate = ['PRE_REGISTERED', 'UNDER_REVIEW', 'APPROVED', 'RESTRICTED', 'SUSPENDED'].includes(status);

  return (
    <div className="max-w-4xl">
      <Link
        href="/dashboard/admin/cadastros/fornecedores"
        className="text-sm text-brand hover:underline"
      >
        ← Voltar para fornecedores
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{supplier.name}</h1>
        <span className={`rounded-full px-3 py-1 text-sm ${meta.className}`}>
          {meta.label}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">{supplier.company.name}</p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {canSubmitForReview && (
          <button
            disabled={busy}
            onClick={() => act('submit-for-review')}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            Enviar para análise
          </button>
        )}
        {canApprove && (
          <>
            <button
              disabled={busy}
              onClick={() => act('approve', { restricted: false })}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              Homologar
            </button>
            <button
              disabled={busy}
              onClick={() => act('approve', { restricted: true })}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-60"
            >
              Homologar com restrição
            </button>
          </>
        )}
        {canSuspend && (
          <button
            disabled={busy}
            onClick={() => withReason('suspend', 'Motivo da suspensão:')}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            Suspender
          </button>
        )}
        {canReactivate && (
          <button
            disabled={busy}
            onClick={() => act('reactivate')}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            Reativar
          </button>
        )}
        {canBlock && (
          <button
            disabled={busy}
            onClick={() => withReason('block', 'Motivo do bloqueio:')}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            Bloquear
          </button>
        )}
        {canInactivate && (
          <button
            disabled={busy}
            onClick={() => withReason('inactivate', 'Motivo da inativação:')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-60"
          >
            Inativar
          </button>
        )}
        <button
          disabled={busy}
          onClick={() => setEditing((v) => !v)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-60"
        >
          {editing ? 'Cancelar edição' : 'Editar dados'}
        </button>
        {canDelete && (
          <button
            disabled={busy}
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Excluir
          </button>
        )}
      </div>

      {editing ? (
        <form
          onSubmit={onSaveEdit}
          className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm text-slate-600">Razão social</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Nome fantasia</label>
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
              onChange={(e) => setForm({ ...form, cnpj: maskCnpj(e.target.value) })}
              inputMode="numeric"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
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
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {busy ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      ) : (
        <section className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Nome fantasia</p>
            <p className="text-sm text-slate-700">{supplier.tradeName ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">CNPJ</p>
            <p className="text-sm text-slate-700">{supplier.cnpj ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">E-mail</p>
            <p className="text-sm text-slate-700">{supplier.email ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Telefone</p>
            <p className="text-sm text-slate-700">{supplier.phone ?? '—'}</p>
          </div>
        </section>
      )}

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-700">Timeline</h2>
        <ol className="space-y-3">
          {supplier.events.map((e) => (
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
