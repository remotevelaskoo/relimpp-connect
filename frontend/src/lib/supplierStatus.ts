import { StatusMeta } from './purchaseStatus';

export const SUP_STATUS_META: Record<string, StatusMeta> = {
  PRE_REGISTERED: { label: 'Pré-cadastro', className: 'bg-slate-200 text-slate-700' },
  UNDER_REVIEW: { label: 'Em análise', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'Homologado', className: 'bg-emerald-100 text-emerald-700' },
  RESTRICTED: { label: 'Homologado c/ restrição', className: 'bg-yellow-100 text-yellow-700' },
  SUSPENDED: { label: 'Suspenso', className: 'bg-orange-100 text-orange-700' },
  BLOCKED: { label: 'Bloqueado', className: 'bg-red-100 text-red-700' },
  INACTIVE: { label: 'Inativo', className: 'bg-slate-200 text-slate-500' },
};

export function supplierStatusMeta(status: string): StatusMeta {
  return (
    SUP_STATUS_META[status] ?? { label: status, className: 'bg-slate-200 text-slate-700' }
  );
}
