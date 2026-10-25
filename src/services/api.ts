import type {
  Alert,
  AuthResponse,
  BatchRecommendationUpdate,
  CompanyDetails,
  CostBreakdown,
  CostComparison,
  CostForecast,
  CostSummary,
  Explanation,
  ExportResult,
  FleetMetrics,
  Forecast,
  InventoryResource,
  InventoryStats,
  Metric,
  OptimizationRun,
  Percentiles,
  ProfileUpdate,
  Recommendation,
  RecommendationUpdate,
  SimulationResult,
  Sustainability,
  User,
} from '../types/api'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5001/api').replace(/\/$/, '')

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('sco.token')
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error('Unable to reach the SmartCloud Optimizer API. Check that the backend is running.')
  }

  const contentType = response.headers.get('content-type') ?? ''
  const payload: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload &&
      typeof payload.error === 'string'
        ? payload.error
        : `Request failed (${response.status})`
    throw new Error(message)
  }
  return payload as T
}

function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

export const api = {
  login: (email: string, password: string) =>
    post<AuthResponse>('/auth/login', { email, password }),
  register: (email: string, password: string, name: string, role: string) =>
    post<AuthResponse>('/auth/register', { email, password, name, role }),
  me: () => request<{ user: User }>('/auth/me'),
  updateProfile: (profile: ProfileUpdate) =>
    request<AuthResponse>('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  company: () => request<CompanyDetails>('/company'),
  updateCompany: (company: CompanyDetails) =>
    request<CompanyDetails>('/company', { method: 'PUT', body: JSON.stringify(company) }),
  inventory: () => request<InventoryResource[]>('/inventory'),
  inventoryStats: () => request<InventoryStats>('/inventory/stats'),
  fleetMetrics: () => request<FleetMetrics>('/metrics/fleet'),
  resource: (id: string) => request<InventoryResource>(`/resources/${encodeURIComponent(id)}`),
  metrics: (id: string) => request<Metric[]>(`/metrics/${encodeURIComponent(id)}`),
  percentiles: (id: string) =>
    request<Percentiles>(`/metrics/${encodeURIComponent(id)}/percentiles`),
  anomalies: () => request<Metric[]>('/metrics/anomalies'),
  recommendations: () => request<Recommendation[]>('/recommendations'),
  runOptimization: (maxBudget: number) =>
    post<OptimizationRun>('/optimization/run', { maxBudget }),
  updateRecommendation: (id: string, status: 'Applied' | 'Dismissed') =>
    post<RecommendationUpdate>(`/recommendations/${encodeURIComponent(id)}/action`, { status }),
  batchApplyRecommendations: (rec_ids: string[]) =>
    post<BatchRecommendationUpdate>('/recommendations/batch-apply', { rec_ids }),
  costSummary: () => request<CostSummary>('/costs/summary'),
  costBreakdown: () => request<CostBreakdown>('/costs/breakdown'),
  costForecast: () => request<CostForecast>('/costs/forecast'),
  costComparison: () => request<CostComparison>('/costs/before-vs-after'),
  alerts: () => request<Alert[]>('/alerts'),
  forecast: () => request<Forecast>('/forecast'),
  simulate: (shutdownDevAtNight: boolean, rightsizeUnderutilized: boolean) =>
    post<SimulationResult>('/simulator/what-if', {
      shutdownDevAtNight,
      rightsizeUnderutilized,
    }),
  explain: (resource_id: string) =>
    post<Explanation>('/ai/explain', { resource_id }),
  export: (format: 'terraform' | 'csv' | 'bash') =>
    request<ExportResult>(`/export/${format}`),
  sustainability: () => request<Sustainability>('/sustainability'),
}
