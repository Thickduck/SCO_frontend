import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../services/api'
import { Icon } from '../components/Icon'
import { Button, LoadState, PageHeader, Panel } from '../components/UI'
import { useToast } from '../hooks/useToast'
import { useApiQuery } from '../hooks/useApiQuery'
import { SelectField } from '../components/UI'

export function AiExplainPage() {
  const [resourceId, setResourceId] = useState('')
  const inventory = useApiQuery(api.inventory, 'explain-inventory')
  const [answer, setAnswer] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const toast = useToast()

  async function explain(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!resourceId.trim()) {
      setError('Select a resource to explain.')
      return
    }
    setLoading(true)
    setError(undefined)
    setAnswer(undefined)
    try {
      const response = await api.explain(resourceId.trim())
      setAnswer(response.explanation)
      toast('Explanation is ready.')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not generate an explanation.'
      setError(message)
      toast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="PLAIN-LANGUAGE INSIGHTS" title="AI explain" description="Turn resource metrics into a concise explanation your team can review. Recommendations never apply changes automatically." />
      <div className="explain-layout">
        <Panel title="Explain a resource" subtitle="Share the resource identifier and the utilization context">
          <form className="form-stack" onSubmit={(event) => void explain(event)}>
            <LoadState loading={inventory.loading} error={inventory.error} onRetry={() => void inventory.reload()} />
            {inventory.data && <SelectField label="Resource" ariaLabel="Select resource to explain" value={resourceId} onChange={setResourceId} options={['', ...inventory.data.map((resource) => resource.resource_id)]} />}
            {error && <div className="form-error" role="alert">{error}</div>}
            <Button type="submit" disabled={loading}>{loading && <span className="button-spinner" />}<Icon name="assistant" size={16} /> Explain recommendation</Button>
          </form>
          <div className="form-hint"><Icon name="assistant" size={15} /><span>Uses recorded metrics, current prices, and pending recommendations. The local rule-based explanation is not an LLM decision or cloud action.</span></div>
        </Panel>
        <Panel title="Explanation" subtitle="Review the reasoning before acting">
          {answer ? <div className="explanation-result"><span><Icon name="assistant" size={19} /></span><p>{answer}</p><div className="explanation-disclaimer">Validate this guidance against peak load, service-level objectives, and your team’s change process.</div></div> : <div className="simulation-empty"><span><Icon name="assistant" size={21} /></span><strong>Your explanation appears here</strong><p>Provide metrics context to get a clear, resource-specific summary.</p></div>}
        </Panel>
      </div>
    </>
  )
}
