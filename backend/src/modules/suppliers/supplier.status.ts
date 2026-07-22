// Status do fornecedor (Especificação Funcional Consolidada, seção 10.1).
export const SUP_STATUS = {
  PRE_REGISTERED: 'PRE_REGISTERED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  RESTRICTED: 'RESTRICTED',
  SUSPENDED: 'SUSPENDED',
  BLOCKED: 'BLOCKED',
  INACTIVE: 'INACTIVE',
} as const;

export type SupStatus = (typeof SUP_STATUS)[keyof typeof SUP_STATUS];
