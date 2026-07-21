'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface RequestRow {
  id: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface Company {
  id: string;
}

export default function DashboardHome() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<RequestRow[]>('/purchase-requests').catch(() => []),
      api<Company[]>('/companies').catch(() => []),
    ])
      .then(([reqs, comps]) => {
        setRequests(reqs);
        setCompanies(comps);
      })
      .finally(() => setLoading(false));
  }, []);

  const count = (s: string) => requests.filter((r) => r.status === s).length;
  const now = new Date();
  const monthCount = requests.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const cards = [
    {
      value: count('SUBMITTED'),
      title: 'Aguardando aprovação',
      hint: 'Meu Trabalho',
      href: '/dashboard/meu-trabalho',
      accent: 'text-amber-600',
    },
    {
      value: count('RETURNED'),
      title: 'Devolvidas para ajuste',
      hint: 'Compras',
      href: '/dashboard/compras/solicitacoes',
      accent: 'text-orange-600',
    },
    {
      value: count('APPROVED'),
      title: 'Aprovadas',
      hint: 'Compras',
      href: '/dashboard/compras/solicitacoes',
      accent: 'text-emerald-600',
    },
    {
      value: monthCount,
      title: 'Solicitações no mês',
      hint: 'Compras',
      href: '/dashboard/compras/solicitacoes',
      accent: 'text-brand',
    },
    {
      value: companies.length,
      title: 'Empresas cadastradas',
      hint: 'Administração',
      href: '/dashboard/empresas',
      accent: 'text-slate-700',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Visão inicial de prioridades e indicadores. Painéis por perfil evoluem conforme o Blueprint (V05).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow"
          >
            <p className={`text-3xl font-bold ${card.accent}`}>
              {loading ? '…' : card.value}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {card.title}
            </p>
            <p className="text-xs text-slate-400">{card.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-700">Atalhos</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/dashboard/compras/solicitacoes"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Nova solicitação de compra
          </Link>
          <Link
            href="/dashboard/meu-trabalho"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Ver Meu Trabalho
          </Link>
        </div>
      </div>
    </div>
  );
}
