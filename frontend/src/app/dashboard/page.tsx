'use client';

const CARDS = [
  { title: 'Aprovações pendentes', hint: 'Meu Trabalho' },
  { title: 'Solicitações devolvidas', hint: 'Meu Trabalho' },
  { title: 'Cotações próximas do prazo', hint: 'Compras' },
  { title: 'Recebimentos a confirmar', hint: 'Recebimento' },
];

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Meu Trabalho</h1>
      <p className="mt-1 text-sm text-slate-500">
        Visão inicial do MVP 0 — Fundação técnica. Os motores configuráveis
        (workflow, formulários, SLA) evoluem nas próximas fases.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-3xl font-bold text-brand">0</p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {card.title}
            </p>
            <p className="text-xs text-slate-400">{card.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
