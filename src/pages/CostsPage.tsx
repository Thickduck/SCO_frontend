import { useCallback } from 'react'
import { api } from '../services/api'
import { useApiQuery } from '../hooks/useApiQuery'
import { Bars } from '../components/Charts'
import { Icon } from '../components/Icon'
import { LoadState, PageHeader, Panel, StatCard } from '../components/UI'
import { formatCurrency } from '../utils/format'

export function CostsPage() {
  const loadCosts = useCallback(async () => {
    const [summary, breakdown, forecast, comparison] = await Promise.all([
      api.costSummary(), api.costBreakdown(), api.costForecast(), api.costComparison(),
    ])
    return { summary, breakdown, forecast, comparison }
  }, [])
  const query = useApiQuery(loadCosts, 'costs')

  const data = query.data
  return (
    <>
      <PageHeader eyebrow="FINANCIAL CONTROL" title="Cost analysis" description="Understand what drives your cloud bill today and how the current trajectory compares with an optimized footprint." action={<button className="text-action" type="button" onClick={() => void query.reload()} disabled={query.loading}><Icon name="clock" size={15} /> Refresh costs</button>} />
      <LoadState loading={query.loading} error={query.error} onRetry={() => void query.reload()} />
      {data && (
        <>
          <div className="stat-grid stat-grid-four">
            <StatCard label="Current monthly spend" value={formatCurrency(data.summary.total_current_spend)} caption="Based on inventory pricing" icon="costs" />
            <StatCard label="Optimized spend" value={formatCurrency(data.comparison.optimized_monthly_spend)} caption="If pending actions are applied" icon="recommendations" tone="green" />
            <StatCard label="Potential savings" value={formatCurrency(data.comparison.projected_monthly_savings)} caption="Estimated per month" icon="analytics" tone="blue" />
            <StatCard label="90-day forecast" value={formatCurrency(data.forecast.forecast_90_days)} caption={`From ${formatCurrency(data.forecast.current_monthly_spend)} today`} icon="forecast" tone="amber" />
          </div>
          <div className="content-grid-two">
            <Panel title="Spend by environment" subtitle="Monthly cost grouped by environment">
              <Bars values={Object.entries(data.breakdown.by_environment).map(([label, value]) => ({ label, value }))} />
            </Panel>
            <Panel title="Spend by team" subtitle="Monthly cost grouped by resource owner">
              <Bars values={Object.entries(data.breakdown.by_department).map(([label, value]) => ({ label, value }))} color="blue" />
            </Panel>
          </div>
          <Panel title="Current spend vs. optimized" subtitle="Comparison assumes pending recommendations are accepted">
            <div className="comparison">
              <div className="comparison-labels"><span>Current monthly spend<strong>{formatCurrency(data.comparison.current_monthly_spend)}</strong></span><span>Projected monthly savings<strong className="text-green">{formatCurrency(data.comparison.projected_monthly_savings)}</strong></span><span>After optimization<strong>{formatCurrency(data.comparison.optimized_monthly_spend)}</strong></span></div>
              <div className="comparison-track"><span style={{ width: `${data.comparison.current_monthly_spend > 0 ? Math.min((data.comparison.optimized_monthly_spend / data.comparison.current_monthly_spend) * 100, 100) : 0}%` }} /><i /></div>
              <div className="comparison-foot"><span><i className="legend-cpu" />Projected spend</span><span><i className="legend-memory" />Savings opportunity</span></div>
            </div>
          </Panel>
          <Panel title="Projected spend" subtitle="Illustrative trajectory at the current growth rate">
            <div className="forecast-cards">
              {[['Today', data.forecast.current_monthly_spend], ['30 days', data.forecast.forecast_30_days], ['60 days', data.forecast.forecast_60_days], ['90 days', data.forecast.forecast_90_days]].map(([period, value]) => <div className="forecast-card" key={String(period)}><span>{period}</span><strong>{formatCurrency(Number(value))}</strong></div>)}
            </div>
          </Panel>
          <div className="assumption-note"><Icon name="assistant" size={15} /><span>Cost figures are illustrative and reflect the prices and resources returned by the current inventory API. Optimized spend uses the backend’s estimate of pending recommendation savings.</span></div>
        </>
      )}
    </>
  )
}
