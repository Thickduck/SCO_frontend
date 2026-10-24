export interface User {
  id: string
  email: string
  name: string
  role: string
  is_admin: boolean
}

export interface ProfileUpdate {
  name: string
  email: string
  role: string
}

export interface CompanyDetails {
  name: string
  website: string
  industry: string
  contact_email: string
  address: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ResourceDetail {
  resource: InventoryResource | null
  metrics: Metric[]
  percentiles: Percentiles | null
}

export interface InventoryResource {
  resource_id: string
  name: string
  type: string
  region: string
  environment: string
  owner: string
  vcpu: number
  ram_gb: number
  disk_size_gb: number
  monthly_cost: number
  creation_date: string
}

export interface InventoryStats {
  total_resources: number
  total_monthly_cost: number
  total_vms: number
  total_volumes: number
  total_ips: number
}

export interface Metric {
  resource_id: string
  timestamp: string
  cpu_pct: number
  memory_pct: number
  disk_pct: number
  network_in_mb: number
  network_out_mb: number
  iops?: number
  is_anomaly?: string
}

export interface Percentiles {
  p95_cpu: number | null
  p99_cpu: number | null
  p95_memory: number | null
  p99_memory: number | null
}

export interface Recommendation {
  rec_id: string
  resource_id: string
  action: string
  reason: string
  estimated_monthly_saving: number
  risk_level: string
  status: string
}

export interface CostSummary {
  total_current_spend: number
}

export interface CostBreakdown {
  by_environment: Record<string, number>
  by_department: Record<string, number>
}

export interface CostForecast {
  current_monthly_spend: number
  forecast_30_days: number
  forecast_60_days: number
  forecast_90_days: number
}

export interface CostComparison {
  current_monthly_spend: number
  optimized_monthly_spend: number
  projected_monthly_savings: number
}

export interface Alert {
  alert_id: string
  severity: string
  message: string
  timestamp: string
}

export interface Forecast {
  trend: string
  projected_growth_rate_pct: number
  recommendation: string
}

export interface SimulationResult {
  simulatedMonthlySavings: number
  message: string
}

export interface Explanation {
  explanation: string
}

export interface ExportResult {
  format: string
  content: string
}

export interface Sustainability {
  carbon_saved_kg_co2e_per_month: number
  equivalent_trees_planted: number
  energy_saved_kwh: number
}

export interface RecommendationUpdate {
  success: boolean
  updated: number
}

export interface BatchRecommendationUpdate {
  success: boolean
  applied_count: number
  total_estimated_savings: number
}
