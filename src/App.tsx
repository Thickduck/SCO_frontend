import { Component, useEffect, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import './App.css'
import { AppShell } from './components/AppShell'
import { Icon } from './components/Icon'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import { ToastProvider } from './context/ToastContext'
import { AiExplainPage } from './pages/AiExplainPage'
import { AlertsPage } from './pages/AlertsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CostsPage } from './pages/CostsPage'
import { CompanyPage } from './pages/CompanyPage'
import { DashboardPage } from './pages/DashboardPage'
import { ExportPage } from './pages/ExportPage'
import { ForecastPage } from './pages/ForecastPage'
import { InventoryPage } from './pages/InventoryPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { ProfilePage } from './pages/ProfilePage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { SimulatorPage } from './pages/SimulatorPage'
import { SustainabilityPage } from './pages/SustainabilityPage'
import { getNavigationForRole } from './utils/navigation'

class PageErrorBoundary extends Component<
  { children: ReactNode; onNavigate: (path: string) => void },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page rendering failed:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="inline-error page-error" role="alert">
          <strong>This page couldn’t be displayed.</strong>
          <span>Your other workspace pages are still available.</span>
          <button type="button" className="button button-secondary button-small" onClick={() => this.props.onNavigate('/')}>
            Return to overview
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppContent() {
  const { user, loading, logout, updateProfile } = useAuth()
  const { dark, toggle } = useTheme()
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (user && (path === '/login' || path === '/register')) {
      window.history.replaceState({}, '', '/')
    }
  }, [user, path])

  const allowedPath = !user || path === '/profile'
    || getNavigationForRole(user.role).some((group) => group.items.some((item) => item.path === path))
  const visiblePath = allowedPath ? path : '/'
  useEffect(() => {
    if (!allowedPath) window.history.replaceState({}, '', '/')
  }, [allowedPath])

  function navigate(destination: string) {
    window.history.pushState({}, '', destination)
    setPath(destination)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function signOut() {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <div className="boot-screen"><span className="boot-mark"><Icon name="cloud" size={24} /></span><span className="spinner" /><p>Loading your workspace…</p></div>
  }

  if (!user) {
    if (path !== '/register') return <LoginPage />
    return <RegisterPage />
  }

  const pages: Record<string, ReactNode> = {
    '/': <DashboardPage userName={user.name} userRole={user.role} />,
    '/inventory': <InventoryPage />,
    '/analytics': <AnalyticsPage />,
    '/recommendations': <RecommendationsPage />,
    '/costs': <CostsPage />,
    '/alerts': <AlertsPage />,
    '/forecast': <ForecastPage />,
    '/simulator': <SimulatorPage />,
    '/assistant': <AiExplainPage />,
    '/export': <ExportPage />,
    '/sustainability': <SustainabilityPage />,
    '/company': <CompanyPage user={user} />,
  }
  if (visiblePath === '/profile') {
    pages[visiblePath] = <ProfilePage user={user} onSave={updateProfile} />
  }

  if (visiblePath === '/login' || visiblePath === '/register') {
    return <AppShell user={user} path="/" navigate={navigate} onLogout={signOut} onToggleTheme={toggle} dark={dark}><DashboardPage userName={user.name} userRole={user.role} /></AppShell>
  }

  return (
    <AppShell user={user} path={visiblePath} navigate={navigate} onLogout={signOut} onToggleTheme={toggle} dark={dark}>
      <PageErrorBoundary key={visiblePath} onNavigate={navigate}>
        {pages[visiblePath] ?? <DashboardPage userName={user.name} userRole={user.role} />}
      </PageErrorBoundary>
    </AppShell>
  )
}

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  )
}

export default App
