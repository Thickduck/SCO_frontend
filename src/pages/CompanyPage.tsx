import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, LoadState, PageHeader, Panel } from '../components/UI'
import { useApiQuery } from '../hooks/useApiQuery'
import { useToast } from '../hooks/useToast'
import { api } from '../services/api'
import type { CompanyDetails, User } from '../types/api'

const emptyCompany: CompanyDetails = {
  name: '',
  website: '',
  industry: '',
  contact_email: '',
  address: '',
}

export function CompanyPage({ user }: { user: User }) {
  const query = useApiQuery(api.company, 'company-details')
  const toast = useToast()
  const [company, setCompany] = useState<CompanyDetails>()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const isAdmin = user.is_admin === true

  const values = company ?? query.data ?? emptyCompany

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    setSaving(true)
    try {
      const updated = await api.updateCompany(values)
      setCompany(updated)
      query.setData(updated)
      window.dispatchEvent(new CustomEvent('sco:company-updated', { detail: updated }))
      toast('Company details saved.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update company details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE"
        title="Company"
        description="Company information shared across your SmartCloud workspace."
      />
      <LoadState loading={query.loading} error={query.error} onRetry={() => void query.reload()} />
      {query.data && (
        <Panel title="Company details" subtitle={isAdmin ? 'Only workspace admins can change these details.' : 'Contact a workspace admin to request changes.'}>
          <form className="profile-form" onSubmit={(event) => void submit(event)}>
            <div className="company-edit-fields">
              <label className="form-field"><span>Company name</span><input value={values.name} onChange={(event) => setCompany({ ...values, name: event.target.value })} readOnly={!isAdmin} maxLength={160} required /></label>
              <label className="form-field"><span>Website</span><input type="url" value={values.website} onChange={(event) => setCompany({ ...values, website: event.target.value })} readOnly={!isAdmin} maxLength={255} placeholder="https://example.com" /></label>
              <label className="form-field"><span>Industry</span><input value={values.industry} onChange={(event) => setCompany({ ...values, industry: event.target.value })} readOnly={!isAdmin} maxLength={120} /></label>
              <label className="form-field"><span>Contact email</span><input type="email" value={values.contact_email} onChange={(event) => setCompany({ ...values, contact_email: event.target.value })} readOnly={!isAdmin} maxLength={254} /></label>
              <label className="form-field company-address"><span>Address</span><textarea value={values.address} onChange={(event) => setCompany({ ...values, address: event.target.value })} readOnly={!isAdmin} rows={3} maxLength={500} /></label>
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            {isAdmin && <Button type="submit" disabled={saving || query.loading}>{saving && <span className="button-spinner" />}Save company details</Button>}
          </form>
        </Panel>
      )}
    </>
  )
}
