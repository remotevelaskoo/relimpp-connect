'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Company {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface RoleScope {
  id: string;
  role: { id: string; name: string };
  company: { id: string; name: string } | null;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  active: boolean;
  companyId: string | null;
  roleScopes: RoleScope[];
}

export default function UsuarioDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({ name: '', email: '', companyId: '', active: true });
  const [newPassword, setNewPassword] = useState('');
  const [roleForm, setRoleForm] = useState({ roleId: '', companyId: '' });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<UserDetail>(`/users/${id}`);
      setUser(data);
      setForm({
        name: data.name,
        email: data.email,
        companyId: data.companyId ?? '',
        active: data.active,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, [id]);

  useEffect(() => {
    load();
    api<Company[]>('/companies').then(setCompanies).catch(() => {});
    api<Role[]>('/roles').then(setRoles).catch(() => {});
  }, [load]);

  async function onSaveBasics(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await api(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          companyId: form.companyId || undefined,
          active: form.active,
        }),
      });
      setNotice('Dados atualizados.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function onSetPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (newPassword.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }
    setBusy(true);
    try {
      await api(`/users/${id}/set-password`, {
        method: 'POST',
        body: JSON.stringify({ password: newPassword }),
      });
      setNewPassword('');
      setNotice('Senha redefinida.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setBusy(false);
    }
  }

  async function onAssignRole(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!roleForm.roleId) {
      setError('Selecione um papel.');
      return;
    }
    setBusy(true);
    try {
      await api(`/users/${id}/role-scopes`, {
        method: 'POST',
        body: JSON.stringify({
          roleId: roleForm.roleId,
          companyId: roleForm.companyId || undefined,
        }),
      });
      setRoleForm({ roleId: '', companyId: '' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atribuir papel');
    } finally {
      setBusy(false);
    }
  }

  async function onRemoveRole(roleScopeId: string) {
    setError(null);
    setBusy(true);
    try {
      await api(`/users/${id}/role-scopes/${roleScopeId}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover papel');
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
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

  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard/admin/cadastros/usuarios"
        className="text-sm text-brand hover:underline"
      >
        ← Voltar para usuários
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-800">{user.name}</h1>
      <p className="mt-1 text-sm text-slate-500">{user.email}</p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {notice && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>
      )}

      <form
        onSubmit={onSaveBasics}
        className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <h2 className="font-semibold text-slate-700 sm:col-span-2">Dados</h2>
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
          <label className="mb-1 block text-sm text-slate-600">E-mail</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-600">Empresa</label>
          <select
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand"
          >
            <option value="">Sem vínculo</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 self-end text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Usuário ativo
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {busy ? 'Salvando…' : 'Salvar dados'}
          </button>
        </div>
      </form>

      <form
        onSubmit={onSetPassword}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex-1">
          <label className="mb-1 block text-sm text-slate-600">Nova senha</label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            minLength={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-60"
        >
          Redefinir senha
        </button>
      </form>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-700">Papéis atribuídos</h2>
        {user.roleScopes.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhum papel atribuído ainda.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {user.roleScopes.map((rs) => (
              <li
                key={rs.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <span>
                  <span className="font-medium text-slate-700">{rs.role.name}</span>
                  <span className="text-slate-400">
                    {' '}
                    · {rs.company ? rs.company.name : 'todas as empresas'}
                  </span>
                </span>
                <button
                  onClick={() => onRemoveRole(rs.id)}
                  disabled={busy}
                  className="text-xs text-red-600 hover:underline disabled:opacity-60"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={onAssignRole} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Papel</label>
            <select
              value={roleForm.roleId}
              onChange={(e) => setRoleForm({ ...roleForm, roleId: e.target.value })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="">Selecione…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Escopo (empresa)</label>
            <select
              value={roleForm.companyId}
              onChange={(e) => setRoleForm({ ...roleForm, companyId: e.target.value })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="">Todas as empresas</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            Atribuir
          </button>
        </form>
      </section>
    </div>
  );
}
