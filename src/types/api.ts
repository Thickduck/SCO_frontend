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
  monthly_budget: number
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
  attached_to?: string | null
}

export interface FleetResourceMetrics {
  resource_id: string
  name: string
  type: string
  region: string
  environment: string
  owner: string
  monthly_cost: number
  sample_count: number | null
  avg_cpu: number | null
  avg_memory: number | null
  avg_disk: number | null
  avg_network_in: number | null
  avg_network_out: number | null
  p95_cpu: number | null
  p95_memory: number | null
  max_cpu: number | null
  max_memory: number | null
  latest_cpu: number | null
  latest_memory: number | null
  latest_disk: number | null
  latest_network_in: number | null
  latest_network_out: number | null
  latest_timestamp: string | null
}

export interface FleetMetrics {
  summary: {
    resource_count: number
    measured_resource_count: number
    avg_cpu_pct: number
    avg_memory_pct: number
    avg_disk_pct: number
    avg_network_in_mb: number
    avg_network_out_mb: number
    high_cpu_resources: number
    high_memory_resources: number
  }
  resources: FleetResourceMetrics[]
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
  target_configuration?: string | null
  confidence?: number | null
  monthly_cost?: number
  environment?: string
}

export interface CostSummary {
  total_current_spend: number
}

export interface CostBreakdown {
  by_environment: Record<string, number>
  by_department: Record<string, number>
  potential_savings_by_environment: Record<string, number>
}

export interface CostForecast {
  current_monthly_spend: number
  forecast_30_days: number
  forecast_60_days: number
  forecast_90_days: number
  utilization_change_pct?: number
  method?: string
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
  type?: string
  reason?: string
}

export interface Forecast {
  trend: string
  projected_growth_rate_pct: number
  recommendation: string
  method?: string
}

export interface SimulationResult {
  simulatedMonthlySavings: number
  message: string
  resourceCount?: number
  resources?: number
  breakdown?: {
    shutdownDevAtNight: number
    rightsizeUnderutilized: number
  }
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
  assumptions?: {
    kwh_per_inr_saved: number
    kg_co2e_per_kwh: number
    kg_co2e_per_tree_year: number
    basis: string
  }
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

export interface OptimizationRun {
  summary: {
    candidate_count: number
    selected_count: number
    total_savings: number
    budget_used: number
    max_budget: number
  }
  recommendations: Array<{
    resource_id: string
    name: string
    type: string
    environment: string
    owner: string
    action: string
    monthly_cost: number
    estimated_savings: number
    confidence: number
    risk_level: string
    target_configuration: string | null
    reason: string
  }>
}
