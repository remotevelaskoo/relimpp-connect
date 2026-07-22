'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PRIORITY_LABEL, statusMeta } from '@/lib/purchaseStatus';

interface Company {
  id: string;
  name: string;
}

interface OrgUnit {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ItemForm {
  description: string;
  specification: string;
  quantity: string;
  unit: string;
  estimatedPrice: string;
  neededDate: string;
  deliveryLocation: string;
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

const CRITICALITY_LABEL: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const emptyItem = (): ItemForm => ({
  description: '',
  specification: '',
  quantity: '1',
  unit: 'un',
  estimatedPrice: '',
  neededDate: '',
  deliveryLocation: '',
});

export default function SolicitacoesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [branches, setBranches] = useState<OrgUnit[]>([]);
  const [departments, setDepartments] = useState<OrgUnit[]>([]);
  const [projects, setProjects] = useState<OrgUnit[]>([]);
  const [costCenters, setCostCenters] = useState<OrgUnit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<RequestRow[]>([]);

  const [justification, setJustification] = useState('');
  const [priority, setPriority] = useState('medium');
  const [branchId, setBranchId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [costCenterId, setCostCenterId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [criticality, setCriticality] = useState('');
  const [confidential, setConfidential] = useState(false);
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
    api<Category[]>('/categories?type=purchase')
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    load(companyId);
    if (!companyId) {
      setBranches([]);
      setDepartments([]);
      setProjects([]);
      setCostCenters([]);
      return;
    }
    api<OrgUnit[]>(`/branches?companyId=${companyId}`).then(setBranches).catch(() => {});
    api<OrgUnit[]>(`/departments?companyId=${companyId}`).then(setDepartments).catch(() => {});
    api<OrgUnit[]>(`/projects?companyId=${companyId}`).then(setProjects).catch(() => {});
    api<OrgUnit[]>(`/cost-centers?companyId=${companyId}`).then(setCostCenters).catch(() => {});
    setBranchId('');
    setDepartmentId('');
    setProjectId('');
    setCostCenterId('');
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
          branchId: branchId || undefined,
          departmentId: departmentId || undefined,
          projectId: projectId || undefined,
          costCenterId: costCenterId || undefined,
          categoryId: categoryId || undefined,
          criticality: criticality || undefined,
          confidential,
          items: items.map((i) => ({
            description: i.description,
            specification: i.specification || undefined,
            quantity: Number(i.quantity),
            unit: i.unit,
            estimatedPrice: i.estimatedPrice
              ? Number(i.estimatedPrice)
              : undefined,
            neededDate: i.neededDate || undefined,
            deliveryLocation: i.deliveryLocation || undefined,
          })),
        }),
      });
      setJustification('');
      setPriority('medium');
      setBranchId('');
      setDepartmentId('');
      setProjectId('');
      setCostCenterId('');
      setCategoryId('');
      setCriticality('');
      setConfidential(false);
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

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Criticidade
              </label>
              <select
                value={criticality}
                onChange={(e) => setCriticality(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand"
              >
                <option value="">Não informada</option>
                {Object.entries(CRITICALITY_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Tipo / categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand"
            >
              <option value="">Não informado</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Vínculo organizacional (opcional)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand"
              >
                <option value="">Filial</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand"
              >
                <option value="">Departamento</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand"
              >
                <option value="">Obra</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={costCenterId}
                onChange={(e) => setCostCenterId(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-brand"
              >
                <option value="">Centro de custo</option>
                {costCenters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={confidential}
              onChange={(e) => setConfidential(e.target.checked)}
            />
            Solicitação confidencial
          </label>

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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-0.5 block text-xs text-slate-500">
                      Data necessária
                    </label>
                    <input
                      value={item.neededDate}
                      onChange={(e) =>
                        updateItem(idx, { neededDate: e.target.value })
                      }
                      type="date"
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-slate-500">
                      Local de entrega
                    </label>
                    <input
                      value={item.deliveryLocation}
                      onChange={(e) =>
                        updateItem(idx, { deliveryLocation: e.target.value })
                      }
                      placeholder="Ex.: Almoxarifado Obra Centro"
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
                    />
                  </div>
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
