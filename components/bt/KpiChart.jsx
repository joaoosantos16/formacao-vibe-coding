'use client';

// Mini-gráfico SVG sem dependências externas: linha de valores reais,
// linha de objetivo (cinzento claro, tracejada, horizontal) e linha de
// tendência (cinzento claro, tracejada, regressão linear simples).
function linearTrend(values) {
  const n = values.length;
  if (n < 2) return values.map(() => values[0] ?? 0);
  const xs = values.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((sum, x, i) => sum + (x - meanX) * (values[i] - meanY), 0);
  const den = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0) || 1;
  const slope = num / den;
  const intercept = meanY - slope * meanX;
  return xs.map((x) => slope * x + intercept);
}

export default function KpiChart({ periods = [], values = [], target, compact = true, unit }) {
  const width = compact ? 300 : 720;
  const height = compact ? 90 : 280;
  const padLeft = compact ? 28 : 44;
  const padBottom = compact ? 16 : 32;
  const padTop = 8;
  const plotW = width - padLeft - 8;
  const plotH = height - padTop - padBottom;

  const numeric = values.filter((v) => v != null);
  if (numeric.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-300">No data yet</div>;
  }

  const allForRange = target != null ? [...numeric, target] : numeric;
  const max = Math.max(...allForRange);
  const min = Math.min(...allForRange);
  const range = max - min || 1;
  const yPad = range * 0.15;
  const scaledMax = max + yPad;
  const scaledMin = min - yPad;
  const scaledRange = scaledMax - scaledMin || 1;

  function xAt(i) {
    return padLeft + (i / Math.max(values.length - 1, 1)) * plotW;
  }
  function yAt(v) {
    return padTop + (1 - (v - scaledMin) / scaledRange) * plotH;
  }

  const linePoints = values
    .map((v, i) => (v == null ? null : `${xAt(i)},${yAt(v)}`))
    .filter(Boolean)
    .join(' ');

  const trendValues = linearTrend(numeric);
  const trendPoints = trendValues.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ');

  const gridLines = compact ? 2 : 4;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      {/* grid horizontal */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const y = padTop + (i / gridLines) * plotH;
        return (
          <line key={i} x1={padLeft} x2={width - 8} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
        );
      })}

      {/* eixo Y */}
      <line x1={padLeft} x2={padLeft} y1={padTop} y2={height - padBottom} stroke="#e2e8f0" strokeWidth="1" />
      <text x={2} y={padTop + 6} fontSize={compact ? 7 : 10} fill="#94a3b8">{Math.round(scaledMax)}</text>
      <text x={2} y={height - padBottom} fontSize={compact ? 7 : 10} fill="#94a3b8">{Math.round(scaledMin)}</text>

      {/* eixo X */}
      <line x1={padLeft} x2={width - 8} y1={height - padBottom} y2={height - padBottom} stroke="#e2e8f0" strokeWidth="1" />
      {(compact ? [0, periods.length - 1] : periods.map((_, i) => i))
        .filter((i) => i != null && i >= 0)
        .map((i) => (
          <text
            key={i}
            x={xAt(i)}
            y={height - 3}
            fontSize={compact ? 7 : 9}
            fill="#94a3b8"
            textAnchor={compact ? (i === 0 ? 'start' : 'end') : 'middle'}
          >
            {periods[i]}
          </text>
        ))}

      {/* linha de objetivo */}
      {target != null && (
        <line
          x1={padLeft}
          x2={width - 8}
          y1={yAt(target)}
          y2={yAt(target)}
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      )}

      {/* linha de tendência */}
      {numeric.length > 1 && (
        <polyline points={trendPoints} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 3" />
      )}

      {/* linha de valores reais */}
      <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500" />
      {values.map((v, i) => (v == null ? null : (
        <circle key={i} cx={xAt(i)} cy={yAt(v)} r={compact ? 1.5 : 3} className="fill-emerald-500" />
      )))}
    </svg>
  );
}
