import { useCallback } from 'react'
import { api } from '../services/api'
import { useApiQuery } from '../hooks/useApiQuery'
import { Icon } from '../components/Icon'
import { LoadState, PageHeader, Panel, StatCard, Tag } from '../components/UI'
import { formatCurrency } from '../utils/format'

export function ForecastPage() {
  const loadForecast = useCallback(async () => {
    const [cost, trend] = await Promise.all([api.costForecast(), api.forecast()])
    return { cost, trend }
  }, [])
  const query = useApiQuery(loadForecast, 'forecast')
  const data = query.data
  return (
    <>
      <PageHeader eyebrow="PLAN AHEAD" title="Spend forecast" description="A near-term view of projected costs and the operating decisions that can help keep growth predictable." action={<button type="button" className="text-action" onClick={() => void query.reload()} disabled={query.loading}><Icon name="clock" size={15} /> Refresh forecast</button>} />
      <LoadState loading={query.loading} error={query.error} onRetry={() => void query.reload()} />
      {data && (
        <>
          <div className="stat-grid stat-grid-four">
            <StatCard label="Current monthly spend" value={formatCurrency(data.cost.current_monthly_spend)} icon="costs" />
            <StatCard label="30-day projection" value={formatCurrency(data.cost.forecast_30_days)} caption="Estimated next month" icon="forecast" tone="blue" />
            <StatCard label="60-day projection" value={formatCurrency(data.cost.forecast_60_days)} caption="Estimated in two months" icon="forecast" tone="violet" />
            <StatCard label="90-day projection" value={formatCurrency(data.cost.forecast_90_days)} caption="Estimated in three months" icon="forecast" tone="amber" />
          </div>
          <Panel title="Projected monthly spend" subtitle="Backend forecast at 30, 60, and 90 days">
            <div className="forecast-chart">
              {[
                ['Now', data.cost.current_monthly_spend],
                ['30 days', data.cost.forecast_30_days],
                ['60 days', data.cost.forecast_60_days],
                ['90 days', data.cost.forecast_90_days],
              ].map(([period, value]) => {
                const max = Math.max(data.cost.current_monthly_spend, data.cost.forecast_90_days, 1)
                return <div className="forecast-chart-column" key={String(period)}><strong>{formatCurrency(Number(value), true)}</strong><span className="forecast-chart-bar" style={{ height: `${Math.max(Number(value) / max * 100, 8)}%` }} /><small>{period}</small></div>
              })}
            </div>
          </Panel>
          <Panel title="Usage trend" subtitle="Based on current utilization and forecast signals">
            <div className="trend-insight"><span className={`trend-icon ${data.trend.trend.toLowerCase()}`}><Icon name="forecast" size={21} /></span><div><Tag tone={data.trend.trend.toLowerCase() === 'increasing' ? 'amber' : 'success'}>{data.trend.trend} trend</Tag><h2>Projected growth: {data.trend.projected_growth_rate_pct}%</h2><p>{data.trend.recommendation}</p></div></div>
            <div className="assumption-note"><Icon name="assistant" size={15} /><span>This is an illustrative projection from the backend’s current estimate, not a guaranteed bill. Actual costs vary with usage, pricing, and applied changes.</span></div>
          </Panel>
        </>
      )}
    </>
  )
}
