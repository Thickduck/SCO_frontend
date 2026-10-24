import { useState } from 'react'
import { api } from '../services/api'
import { Icon } from '../components/Icon'
import { Button, LoadState, PageHeader, Panel } from '../components/UI'
import { useToast } from '../hooks/useToast'
import { formatCurrency } from '../utils/format'

export function SimulatorPage() {
  const [shutdown, setShutdown] = useState(true)
  const [rightsize, setRightsize] = useState(true)
  const [result, setResult] = useState<{ simulatedMonthlySavings: number; message: string }>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const toast = useToast()

  async function simulate() {
    setLoading(true)
    setError(undefined)
    try {
      const response = await api.simulate(shutdown, rightsize)
      setResult(response)
      toast('What-if scenario calculated.')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not run the simulation.'
      setError(message)
      toast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="MODEL BEFORE YOU CHANGE" title="What-if simulator" description="Estimate potential impact by changing a few operating assumptions. Nothing is modified in your cloud environment." />
      <div className="simulator-layout">
        <Panel title="Scenario assumptions" subtitle="Choose the actions to include in the estimate">
          <div className="scenario-options">
            <label className="scenario-option">
              <span className={`toggle ${shutdown ? 'toggle-on' : ''}`}><input type="checkbox" checked={shutdown} onChange={(event) => setShutdown(event.target.checked)} /><i /></span>
              <span className="scenario-icon"><Icon name="clock" size={18} /></span>
              <span className="scenario-copy"><strong>Shut down development VMs at night</strong><small>Schedule non-production instances from 8 PM to 8 AM.</small></span>
            </label>
            <label className="scenario-option">
              <span className={`toggle ${rightsize ? 'toggle-on' : ''}`}><input type="checkbox" checked={rightsize} onChange={(event) => setRightsize(event.target.checked)} /><i /></span>
              <span className="scenario-icon"><Icon name="recommendations" size={18} /></span>
              <span className="scenario-copy"><strong>Right-size underutilized resources</strong><small>Include resources whose usage suggests excess capacity.</small></span>
            </label>
          </div>
          <div className="scenario-assumption"><Icon name="assistant" size={16} /><p>Illustrative assumptions: the backend estimates ₹1,450/month for scheduled development shutdowns and ₹2,300/month for right-sizing. Actual savings depend on workload and pricing.</p></div>
          <Button onClick={() => void simulate()} disabled={loading || (!shutdown && !rightsize)}>{loading && <span className="button-spinner" />}Run simulation</Button>
          <LoadState loading={false} error={error} />
        </Panel>
        <Panel title="Estimated impact" subtitle="Monthly savings from your selected scenario" className="simulation-result">
          {result ? (
            <>
              <span className="simulation-result-icon"><Icon name="forecast" size={20} /></span>
              <strong className="simulation-total">{formatCurrency(result.simulatedMonthlySavings)}</strong>
              <span className="simulation-period">estimated monthly savings</span>
              <div className="simulation-divider" />
              <p>{result.message}</p>
              <div className="simulation-breakdown">{shutdown && <span><i className="mix-indicator mix-blue" />Night shutdown <strong>₹1,450/mo</strong></span>}{rightsize && <span><i className="mix-indicator mix-violet" />Right-sizing <strong>₹2,300/mo</strong></span>}</div>
            </>
          ) : <div className="simulation-empty"><span><Icon name="analytics" size={21} /></span><strong>Your scenario appears here</strong><p>Choose one or more assumptions, then run the simulation to estimate potential monthly savings.</p></div>}
        </Panel>
      </div>
      <div className="assumption-note"><Icon name="assistant" size={15} /><span>The simulator uses fixed illustrative values returned by the API. It does not create, stop, resize, or delete cloud resources.</span></div>
    </>
  )
}
