import type { Metric } from '../types/api'

export function MetricChart({ data }: { data: Metric[] }) {
  if (!data.length) return <div className="chart-empty">Utilization history will appear when metrics are available.</div>
  const points = [...data].reverse().slice(-36)
  const line = (key: 'cpu_pct' | 'memory_pct' | 'disk_pct') =>
    points.map((point, index) => {
      const x = 8 + (index / Math.max(points.length - 1, 1)) * 584
      const y = 152 - (Math.min(Math.max(point[key], 0), 100) / 100) * 132
      return `${x},${y}`
    }).join(' ')
  return (
    <div className="chart-wrap">
      <div className="chart-legend"><span><i className="legend-cpu" />CPU</span><span><i className="legend-memory" />Memory</span><span><i className="legend-disk" />Disk</span></div>
      <svg className="line-chart" viewBox="0 0 600 170" role="img" aria-label="CPU, memory and disk utilization history">
        {[20, 60, 100, 140].map((y) => <line key={y} x1="8" x2="592" y1={y} y2={y} className="chart-grid" />)}
        <polyline points={line('disk_pct')} className="chart-line chart-line-disk" />
        <polyline points={line('memory_pct')} className="chart-line chart-line-memory" />
        <polyline points={line('cpu_pct')} className="chart-line chart-line-cpu" />
      </svg>
      <div className="chart-axis"><span>Earlier</span><span>Latest</span></div>
    </div>
  )
}

export function Bars({ values, color = 'violet' }: { values: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...values.map((item) => item.value), 1)
  return (
    <div className="bars-list">
      {values.map((item) => (
        <div className="bar-row" key={item.label}>
          <div className="bar-caption"><span>{item.label}</span><strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.value)}</strong></div>
          <div className="bar-track"><span className={`bar-fill bar-${color}`} style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }} /></div>
        </div>
      ))}
    </div>
  )
}
