// Utilitários de CNPJ: normalização, validação (dígitos verificadores) e formatação.

export function normalizeCnpj(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

// Validação estrutural: 14 dígitos e não uma sequência repetida.
// Usada por padrão nesta fase do produto (aceita CNPJs de exemplo/teste).
export function hasValidCnpjStructure(value: string): boolean {
  const digits = normalizeCnpj(value);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;
  return true;
}

export function isValidCnpj(value: string): boolean {
  const digits = normalizeCnpj(value);
  if (digits.length !== 14) return false;
  // Rejeita sequências repetidas (ex.: 00000000000000).
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calcCheckDigit = (base: string, weights: number[]): number => {
    const sum = base
      .split('')
      .reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const dv1 = calcCheckDigit(digits.slice(0, 12), firstWeights);
  if (dv1 !== Number(digits[12])) return false;

  const dv2 = calcCheckDigit(digits.slice(0, 13), secondWeights);
  if (dv2 !== Number(digits[13])) return false;

  return true;
}

// Formata para o padrão xx.xxx.xxx/xxxx-xx.
export function formatCnpj(value: string): string {
  const d = normalizeCnpj(value);
  if (d.length !== 14) return value;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}
