export interface StatusMeta {
  label: string;
  className: string;
}

export const PR_STATUS_META: Record<string, StatusMeta> = {
  DRAFT: { label: 'Rascunho', className: 'bg-slate-200 text-slate-700' },
  SUBMITTED: { label: 'Em aprovação', className: 'bg-amber-100 text-amber-700' },
  RETURNED: { label: 'Devolvida', className: 'bg-orange-100 text-orange-700' },
  APPROVED: { label: 'Aprovada', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Rejeitada', className: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Cancelada', className: 'bg-slate-200 text-slate-500' },
};

export const PRIORITY_LABEL: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

export function statusMeta(status: string): StatusMeta {
  return (
    PR_STATUS_META[status] ?? {
      label: status,
      className: 'bg-slate-200 text-slate-700',
    }
  );
}
