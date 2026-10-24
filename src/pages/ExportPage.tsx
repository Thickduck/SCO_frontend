import { useState } from 'react'
import { api } from '../services/api'
import type { ExportResult } from '../types/api'
import { Icon } from '../components/Icon'
import { Button, PageHeader, Panel, Tag } from '../components/UI'
import { useToast } from '../hooks/useToast'

const formats = [
  { id: 'terraform', name: 'Terraform', extension: '.tf', language: 'HCL', detail: 'Infrastructure-as-code sample for an optimized resource.' },
  { id: 'csv', name: 'CSV', extension: '.csv', language: 'CSV', detail: 'Resource inventory with estimated monthly cost.' },
  { id: 'bash', name: 'Bash script', extension: '.sh', language: 'Shell', detail: 'A sample remediation command for review.' },
] as const
type ExportFormat = (typeof formats)[number]['id']

export function ExportPage() {
  const [format, setFormat] = useState<ExportFormat>('terraform')
  const [result, setResult] = useState<ExportResult>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const toast = useToast()

  async function loadExport() {
    setLoading(true)
    setError(undefined)
    try {
      setResult(await api.export(format))
      toast(`${format.toUpperCase()} export is ready.`)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not load this export.'
      setError(message)
      toast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.content)
      toast('Export copied to clipboard.')
    } catch {
      toast('Clipboard access was blocked by the browser. Select and copy the preview instead.', 'error')
    }
  }

  function download() {
    if (!result) return
    const selected = formats.find((item) => item.id === format)
    if (!selected) return
    const url = URL.createObjectURL(new Blob([result.content], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `smartcloud-optimizer${selected.extension}`
    anchor.click()
    URL.revokeObjectURL(url)
    toast('Export downloaded.')
  }

  const selectedFormat = formats.find((item) => item.id === format)
  return (
    <>
      <PageHeader eyebrow="TAKE INSIGHTS WITH YOU" title="Export center" description="Preview and download infrastructure snippets or resource data for your team’s review." />
      <div className="export-layout">
        <Panel title="Choose an export" subtitle="Content is provided by the backend API">
          <div className="export-options">
            {formats.map((item) => <button className={`export-option ${format === item.id ? 'selected' : ''}`} key={item.id} type="button" onClick={() => { setFormat(item.id); setResult(undefined); setError(undefined) }}><span className="export-option-icon"><Icon name={item.id === 'csv' ? 'inventory' : item.id === 'terraform' ? 'cloud' : 'export'} size={19} /></span><span><strong>{item.name}</strong><small>{item.detail}</small></span><Tag>{item.language}</Tag></button>)}
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <Button onClick={() => void loadExport()} disabled={loading}>{loading && <span className="button-spinner" />}Generate {selectedFormat?.name} export</Button>
          <div className="form-hint"><Icon name="assistant" size={15} /><span>Always review generated commands and IaC changes in a safe environment before applying them.</span></div>
        </Panel>
        <Panel title="Preview" subtitle={result ? `${selectedFormat?.language} · ${result.content.length} characters` : 'Generate an export to see its contents'} action={result && <div className="preview-actions"><Button size="small" variant="secondary" onClick={() => void copy()}><Icon name="export" size={14} /> Copy</Button><Button size="small" variant="secondary" onClick={download}><Icon name="export" size={14} /> Download</Button></div>}>
          {result ? <pre className="code-preview"><code>{result.content}</code></pre> : <div className="simulation-empty preview-empty"><span><Icon name="export" size={21} /></span><strong>No export generated</strong><p>Choose a format and generate a preview. Nothing will be applied to your infrastructure.</p></div>}
        </Panel>
      </div>
    </>
  )
}
