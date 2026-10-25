import type { Recommendation } from '../types/api'

export function formatCurrency(value: number, compact = false) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: compact && value >= 100000 ? 'compact' : 'standard',
  }).format(value)
}

export function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: value.includes('T') ? 'short' : undefined }).format(date)
}

export function formatPercentile(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(1)}%` : 'Unavailable'
}

export function riskTone(value: string) {
  const normalized = value.toLowerCase()
  return normalized === 'low' || normalized === 'safe' ? 'success' : normalized === 'high' ? 'danger' : 'amber'
}

export function getDistinct<T>(items: T[], getValue: (item: T) => string) {
  return [...new Set(items.map(getValue).filter(Boolean))].sort((a, b) => a.localeCompare(b))
}

export function sumRecommendationSavings(recommendations: Recommendation[]) {
  const byResource = new Map<string, { saving: number; monthlyCost?: number }>()
  for (const recommendation of recommendations) {
    const current = byResource.get(recommendation.resource_id) ?? { saving: 0, monthlyCost: recommendation.monthly_cost }
    current.saving += recommendation.estimated_monthly_saving
    current.monthlyCost = recommendation.monthly_cost ?? current.monthlyCost
    byResource.set(recommendation.resource_id, current)
  }
  return [...byResource.values()].reduce(
    (sum, item) => sum + Math.min(item.saving, item.monthlyCost ?? item.saving),
    0,
  )
}

export function recommendationSavingsByEnvironment(recommendations: Recommendation[]) {
  const byResource = new Map<string, { environment: string; saving: number; monthlyCost?: number }>()
  for (const recommendation of recommendations) {
    const current = byResource.get(recommendation.resource_id) ?? {
      environment: recommendation.environment ?? 'Other',
      saving: 0,
      monthlyCost: recommendation.monthly_cost,
    }
    current.saving += recommendation.estimated_monthly_saving
    current.monthlyCost = recommendation.monthly_cost ?? current.monthlyCost
    byResource.set(recommendation.resource_id, current)
  }
  const totals: Record<string, number> = {}
  for (const item of byResource.values()) {
    totals[item.environment] = (totals[item.environment] ?? 0)
      + Math.min(item.saving, item.monthlyCost ?? item.saving)
  }
  return totals
}
