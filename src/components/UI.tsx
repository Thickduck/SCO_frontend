import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from './Icon'

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  )
}

export function Button({ variant = 'primary', size = 'normal', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; size?: 'normal' | 'small' }) {
  return <button {...props} className={`button button-${variant} button-${size} ${className}`} />
}

export function StatCard({ label, value, caption, icon, tone = 'violet' }: { label: string; value: string; caption?: string; icon: string; tone?: string }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top"><span className="stat-label">{label}</span><span className={`stat-icon tone-${tone}`}><Icon name={icon} size={17} /></span></div>
      <strong className="stat-value">{value}</strong>
      {caption && <span className="stat-caption">{caption}</span>}
    </article>
  )
}

export function Panel({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>
      {children}
    </section>
  )
}

export function LoadState({ loading, error, onRetry }: { loading: boolean; error?: string; onRetry?: () => void }) {
  if (loading) return <div className="load-state"><span className="spinner" />Loading live data…</div>
  if (error) return <div className="inline-error"><strong>We couldn’t load this data.</strong><span>{error}</span>{onRetry && <Button variant="secondary" size="small" onClick={onRetry}>Try again</Button>}</div>
  return null
}

export function EmptyState({ title, message, icon = 'inventory' }: { title: string; message: string; icon?: string }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} size={22} /></span><strong>{title}</strong><p>{message}</p></div>
}

export function SelectField({ label, value, onChange, options, ariaLabel }: { label?: string; value: string; onChange: (value: string) => void; options: string[]; ariaLabel?: string }) {
  return (
    <label className="select-field">
      {label && <span>{label}</span>}
      <select aria-label={ariaLabel ?? label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`tag tag-${tone}`}>{children}</span>
}
