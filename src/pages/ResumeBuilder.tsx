import { Download, FileDown, FileUp, Lock, RotateCcw, Sparkles } from 'lucide-react'
import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import { resumeBuilderPage } from '../data/pages'
import { useSeo } from '../hooks/useSeo'
import { ResumeForm, validate, type FormErrors } from '../resume/ResumeForm'
import { ResumePreview } from '../resume/ResumePreview'
import { sampleResume } from '../resume/sample'
import { emptyResume, isEmpty, normalize, useResume } from '../resume/store'
import { ACCENTS, PAGE, TEMPLATE_LIST, TEMPLATES, usesAccent } from '../resume/templates'
import type { PageSize, ResumeData } from '../resume/types'
import { resumeFileName } from '../resume/view'
import '../styles/resume.css'

function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function ResumeBuilder() {
  useSeo(resumeBuilderPage)
  const [data, update] = useResume()
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<{ kind: 'idle' | 'working' | 'done' | 'error'; text: string }>({ kind: 'idle', text: '' })
  const [overflow, setOverflow] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const onOverflow = useCallback((over: boolean) => setOverflow(over), [])

  const spec = TEMPLATES[data.settings.template]
  const setSettings = (patch: Partial<ResumeData['settings']>) => update((d) => ({ ...d, settings: { ...d.settings, ...patch } }))

  // Errors appear on the first download attempt, then clear as each one is fixed.
  const change: typeof update = (patch) => {
    update(patch)
    if (Object.keys(errors).length) {
      const next = typeof patch === 'function' ? patch(data) : { ...data, ...patch }
      const remaining = validate(next)
      setErrors(remaining)
      setStatus(Object.keys(remaining).length ? { kind: 'error', text: Object.values(remaining)[0] } : { kind: 'idle', text: '' })
    }
  }

  const download = async () => {
    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length) {
      setTab('edit')
      setStatus({ kind: 'error', text: Object.values(found)[0] })
      return
    }
    setStatus({ kind: 'working', text: 'Building your PDF…' })
    try {
      // The PDF engine is large, so it loads only when someone downloads.
      const { renderResumePdf } = await import('../resume/ResumePdf')
      saveFile(await renderResumePdf(data), resumeFileName(data.personal.fullName))
      setStatus({ kind: 'done', text: 'Downloaded. Check your downloads folder.' })
    } catch {
      setStatus({ kind: 'error', text: 'The PDF could not be created. Try again, or switch to another browser.' })
    }
  }

  const fillExample = () => {
    if (!isEmpty(data) && !window.confirm('Replace what you have typed with the example resume?')) return
    update(sampleResume(data.settings))
    setErrors({})
    setStatus({ kind: 'idle', text: '' })
  }

  const clearAll = () => {
    if (isEmpty(data) || !window.confirm('Delete everything you have typed? This cannot be undone.')) return
    update({ ...emptyResume(), settings: data.settings })
    setErrors({})
    setStatus({ kind: 'idle', text: '' })
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    saveFile(blob, resumeFileName(data.personal.fullName).replace(/\.pdf$/, '_data.json'))
  }

  const importData = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!parsed || typeof parsed !== 'object' || !('personal' in parsed)) throw new Error('not a resume file')
      update(normalize(parsed))
      setErrors({})
      setStatus({ kind: 'done', text: 'Resume data imported.' })
    } catch {
      setStatus({ kind: 'error', text: 'That file is not a resume data file. Choose one saved with “Export data”.' })
    }
  }

  const downloadButton = (
    <button type="button" className="btn btn--primary" onClick={download} disabled={status.kind === 'working'}>
      {status.kind === 'working' ? 'Building PDF…' : 'Download PDF'} <Download aria-hidden="true" />
    </button>
  )

  return (
    <main id="main" className="page rb">
      <header className="rb-head container">
        <p className="mono">
          <span className="accent">Free tool</span> — no sign-up
        </p>
        <h1>
          Resume <span className="serif accent">builder.</span>
        </h1>
        <p className="rb-head__lead">
          Fill in your details, pick a template and download a clean PDF that applicant tracking systems (ATS) can read.
        </p>
        <p className="rb-head__privacy">
          <Lock aria-hidden="true" /> Your details stay in this browser. Nothing is uploaded or stored on a server.
        </p>
        <div className="rb-actions">
          <button type="button" className="rb-action" onClick={fillExample}>
            <Sparkles aria-hidden="true" /> Fill with example
          </button>
          <button type="button" className="rb-action" onClick={() => fileInput.current?.click()}>
            <FileUp aria-hidden="true" /> Import data
          </button>
          <button type="button" className="rb-action" onClick={exportData} disabled={isEmpty(data)}>
            <FileDown aria-hidden="true" /> Export data
          </button>
          <button type="button" className="rb-action" onClick={clearAll} disabled={isEmpty(data)}>
            <RotateCcw aria-hidden="true" /> Clear all
          </button>
          <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
      </header>

      <div className="container">
        <div className="rb-tabs" role="tablist" aria-label="Builder view">
          <button type="button" role="tab" id="rb-tab-edit" aria-selected={tab === 'edit'} aria-controls="rb-edit" onClick={() => setTab('edit')}>
            Edit
          </button>
          <button type="button" role="tab" id="rb-tab-preview" aria-selected={tab === 'preview'} aria-controls="rb-preview" onClick={() => setTab('preview')}>
            Preview
          </button>
        </div>

        <div className="rb-layout" data-tab={tab}>
          <div id="rb-edit" className="rb-edit" role="tabpanel" aria-labelledby="rb-tab-edit">
            <section className="rb-design" aria-labelledby="rb-design-title">
              <h2 id="rb-design-title" className="mono">
                Template
              </h2>
              <div className="rb-templates" role="radiogroup" aria-labelledby="rb-design-title">
                {TEMPLATE_LIST.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={data.settings.template === t.id}
                    className="rb-template"
                    onClick={() => setSettings({ template: t.id })}
                  >
                    <span
                      className="rb-thumb"
                      data-align={t.headerAlign}
                      data-rule={t.headingRule}
                      data-font={t.font}
                      style={{ color: usesAccent(t) ? data.settings.accent : '#111' }}
                      aria-hidden="true"
                    >
                      <i className="rb-thumb__name" data-accent={t.nameColor === 'accent'} />
                      <i className="rb-thumb__line" />
                      <i className="rb-thumb__head" />
                      <i className="rb-thumb__line" />
                      <i className="rb-thumb__line rb-thumb__line--short" />
                      <i className="rb-thumb__head" />
                      <i className="rb-thumb__line" />
                    </span>
                    <span className="rb-template__name">{t.name}</span>
                    <span className="rb-template__blurb">{t.blurb}</span>
                  </button>
                ))}
              </div>

              <div className="rb-options">
                <div>
                  <h3 className="mono" id="rb-accent-title">
                    Accent colour
                  </h3>
                  <div className="rb-swatches" role="radiogroup" aria-labelledby="rb-accent-title">
                    {ACCENTS.map((a) => (
                      <button
                        key={a.value}
                        type="button"
                        role="radio"
                        aria-checked={data.settings.accent === a.value}
                        aria-label={a.name}
                        title={a.name}
                        className="rb-swatch"
                        style={{ background: a.value }}
                        disabled={!usesAccent(spec)}
                        onClick={() => setSettings({ accent: a.value })}
                      />
                    ))}
                  </div>
                  {!usesAccent(spec) && <p className="field__hint">The {spec.name} template is black and white.</p>}
                </div>
                <div>
                  <h3 className="mono" id="rb-size-title">
                    Page size
                  </h3>
                  <div className="rb-segment" role="radiogroup" aria-labelledby="rb-size-title">
                    {(Object.keys(PAGE) as PageSize[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        role="radio"
                        aria-checked={data.settings.pageSize === size}
                        onClick={() => setSettings({ pageSize: size })}
                      >
                        {PAGE[size].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <ResumeForm data={data} update={change} errors={errors} />
          </div>

          <div id="rb-preview" className="rb-side" role="tabpanel" aria-labelledby="rb-tab-preview">
            <div className="rb-side__sticky">
              <div className="rb-side__bar">
                {downloadButton}
                <p className={`rb-status${status.kind === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">
                  {status.text}
                </p>
              </div>
              {overflow && (
                <p className="rb-note">
                  Your resume runs onto a second page (the dashed line marks the break). One page is best for under ten years of experience — try the
                  Compact template or trim a few bullet points.
                </p>
              )}
              <div className="rb-paper" data-lenis-prevent tabIndex={0} role="region" aria-label="Resume preview">
                <ResumePreview data={data} onOverflow={onOverflow} />
              </div>
              <p className="rb-foot">The PDF uses real, selectable text in a single column, with standard section headings — the format ATS software reads best.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rb-mobilebar">{downloadButton}</div>
    </main>
  )
}
