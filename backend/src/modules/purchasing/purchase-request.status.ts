export const PR_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  RETURNED: 'RETURNED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type PrStatus = (typeof PR_STATUS)[keyof typeof PR_STATUS];

// Formata o número exibível da solicitação (ex.: SC-000001).
export function formatRequestNumber(seq: number): string {
  return `SC-${String(seq).padStart(6, '0')}`;
}
