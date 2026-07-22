'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Permission {
  id: string;
  key: string;
  resource: string;
  action: string;
}

interface RoleDetail {
  id: string;
  key: string;
  name: string;
  description: string | null;
  permissions: { permission: Permission }[];
}

export default function PerfilDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [role, setRole] = useState<RoleDetail | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<RoleDetail>(`/roles/${id}`);
      setRole(data);
      setForm({ name: data.name, description: data.description ?? '' });
      setSelected(new Set(data.permissions.map((p) => p.permission.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, [id]);

  useEffect(() => {
    load();
    api<Permission[]>('/permissions').then(setAllPermissions).catch(() => {});
  }, [load]);

  async function onSaveBasics(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await api(`/roles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: form.name, description: form.description || undefined }),
      });
      setNotice('Dados atualizados.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  function toggle(permId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return next;
    });
  }

  async function onSavePermissions() {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await api(`/roles/${id}/permissions`, {
        method: 'PATCH',
        body: JSON.stringify({ permissionIds: Array.from(selected) }),
      });
      setNotice('Permissões atualizadas.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar permissões');
    } finally {
      setBusy(false);
    }
  }

  if (!role) {
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

  const grouped = allPermissions.reduce<Record<string, Permission[]>>((acc, p) => {
    (acc[p.resource] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard/admin/cadastros/perfis"
        className="text-sm text-brand hover:underline"
      >
        ← Voltar para perfis
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-800">{role.name}</h1>
      <p className="mt-1 font-mono text-sm text-slate-500">{role.key}</p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {notice && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>
      )}

      <form
        onSubmit={onSaveBasics}
        className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="font-semibold text-slate-700">Dados</h2>
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
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? 'Salvando…' : 'Salvar dados'}
        </button>
      </form>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-700">Permissões</h2>
        {Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma permissão cadastrada no sistema ainda.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([resource, perms]) => (
              <div key={resource}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {resource}
                </p>
                <div className="flex flex-wrap gap-3">
                  {perms.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggle(p.id)}
                      />
                      {p.action}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onSavePermissions}
          disabled={busy}
          className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? 'Salvando…' : 'Salvar permissões'}
        </button>
      </section>
    </div>
  );
}
