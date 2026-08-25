// Espaço como separador de milhares (ex: 15000 -> "15 000") — mais legível
// nos indicadores e valores financeiros do protótipo.
export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  return n.toLocaleString('en-US').replace(/,/g, ' ');
}

export function formatWithUnit(value, unit) {
  if (value === null || value === undefined || value === '') return '—';
  return `${formatNumber(value)}${unit ? ` ${unit}` : ''}`;
}
