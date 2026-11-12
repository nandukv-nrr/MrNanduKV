import { Plus, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { rank } from './suggestions'

interface ShellProps {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  wide?: boolean
  /** Use a group label instead of <label for> (controls made of several inputs). */
  group?: boolean
  children: ReactNode
}

/** Label + control + hint / error, shared by every field. */
export function FieldShell({ id, label, hint, error, wide, group, children }: ShellProps) {
  return (
    <div className={`field${wide ? ' field--wide' : ''}`} role={group ? 'group' : undefined} aria-labelledby={group ? `${id}-l` : undefined}>
      {group ? (
        <span id={`${id}-l`} className="field__label">
          {label}
        </span>
      ) : (
        <label htmlFor={id}>{label}</label>
      )}
      {children}
      {error ? (
        <p id={`${id}-e`} className="field__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-h`} className="field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export const describedBy = (id: string, hint?: ReactNode, error?: string) => (error ? `${id}-e` : hint ? `${id}-h` : undefined)

/** Suggestion list shared by Combo and TagInput. Returns props for the input plus the list element. */
function useSuggestions(id: string, matches: string[], onPick: (value: string) => void) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const show = open && matches.length > 0

  useEffect(() => setActive(-1), [matches.length])

  /** Handles list navigation. Returns true when the key was used. */
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!matches.length) return false
      e.preventDefault()
      setOpen(true)
      setActive((i) => (e.key === 'ArrowDown' ? (i + 1) % matches.length : (i <= 0 ? matches.length : i) - 1))
      return true
    }
    if (e.key === 'Enter' && show && active >= 0) {
      e.preventDefault()
      onPick(matches[active])
      setOpen(false)
      return true
    }
    if (e.key === 'Escape' && show) {
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
      return true
    }
    return false
  }

  const inputProps = {
    role: 'combobox' as const,
    'aria-expanded': show,
    'aria-controls': `${id}-list`,
    'aria-autocomplete': 'list' as const,
    'aria-activedescendant': show && active >= 0 ? `${id}-o${active}` : undefined,
    autoComplete: 'off',
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  }

  const list = (
    <ul id={`${id}-list`} className="rb-suggest" role="listbox" hidden={!show} data-lenis-prevent>
      {matches.map((m, i) => (
        <li
          key={m}
          id={`${id}-o${i}`}
          role="option"
          aria-selected={i === active}
          // mousedown, not click: keeps focus in the input so the list does not close first.
          onMouseDown={(e) => {
            e.preventDefault()
            onPick(m)
            setOpen(false)
          }}
          onMouseEnter={() => setActive(i)}
        >
          {m}
        </li>
      ))}
    </ul>
  )

  return { inputProps, list, onKey, setOpen }
}

interface ComboProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  hint?: ReactNode
  wide?: boolean
}

/** Text input with type-ahead suggestions. Any text is allowed; suggestions are a shortcut. */
export function Combo({ label, value, onChange, options, placeholder, hint, wide }: ComboProps) {
  const id = useId()
  const matches = useMemo(() => {
    const found = rank(options, value)
    // Nothing to suggest once the field already holds exactly the one match.
    return found.length === 1 && found[0].toLowerCase() === value.trim().toLowerCase() ? [] : found
  }, [options, value])
  const s = useSuggestions(id, matches, onChange)

  return (
    <FieldShell id={id} label={label} hint={hint} wide={wide}>
      <div className="rb-combo">
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          aria-describedby={describedBy(id, hint)}
          {...s.inputProps}
          onChange={(e) => {
            onChange(e.target.value)
            s.setOpen(true)
          }}
          onKeyDown={s.onKey}
        />
        {s.list}
      </div>
    </FieldShell>
  )
}

const splitTags = (value: string) =>
  value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

interface TagInputProps {
  label: string
  /** Comma-separated. */
  value: string
  onChange: (value: string) => void
  options: string[]
  /** One-tap ideas shown under the field. */
  ideas?: string[]
  placeholder?: string
  hint?: ReactNode
}

/** Skills as removable tags, with type-ahead and one-tap ideas. */
export function TagInput({ label, value, onChange, options, ideas = [], placeholder, hint }: TagInputProps) {
  const id = useId()
  const [draft, setDraft] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const tags = splitTags(value)
  const has = (t: string) => tags.some((x) => x.toLowerCase() === t.toLowerCase())

  const add = (raw: string) => {
    const fresh = splitTags(raw).filter((t, i, all) => !has(t) && all.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i)
    if (fresh.length) onChange([...tags, ...fresh].join(', '))
    setDraft('')
  }
  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag).join(', '))

  const matches = useMemo(() => rank(options.filter((o) => !has(o)), draft), [options, draft, value]) // eslint-disable-line react-hooks/exhaustive-deps
  const s = useSuggestions(id, matches, add)
  const quick = ideas.filter((i) => !has(i)).slice(0, 10)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (s.onKey(e)) return
    if ((e.key === 'Enter' || e.key === ',') && draft.trim()) {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Enter') {
      e.preventDefault()
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      remove(tags[tags.length - 1])
    }
  }

  return (
    <FieldShell id={id} label={label} hint={hint} wide>
      <div className="rb-combo">
        {/* Clicking the padding around the tags focuses the text input. */}
        <div className="rb-tags" onMouseDown={(e) => e.target === e.currentTarget && (e.preventDefault(), input.current?.focus())}>
          {tags.map((tag) => (
            <span key={tag} className="rb-tag">
              {tag}
              <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
                <X aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            ref={input}
            id={id}
            type="text"
            value={draft}
            placeholder={tags.length ? 'Add another…' : placeholder}
            aria-describedby={describedBy(id, hint)}
            {...s.inputProps}
            onBlur={() => {
              s.setOpen(false)
              if (draft.trim()) add(draft)
            }}
            onChange={(e) => {
              // Pasting "a, b, c" adds all three at once.
              if (e.target.value.includes(',')) add(e.target.value)
              else setDraft(e.target.value)
              s.setOpen(true)
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        {s.list}
      </div>
      {quick.length > 0 && (
        <div className="rb-ideas" role="group" aria-label={`Suggested ${label.toLowerCase()}`}>
          <span className="mono">Suggested</span>
          {quick.map((idea) => (
            <button key={idea} type="button" className="rb-idea" onClick={() => add(idea)}>
              <Plus aria-hidden="true" />
              {idea}
            </button>
          ))}
        </div>
      )}
    </FieldShell>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}

export function Select({ label, value, onChange, options, placeholder = 'Choose…' }: SelectProps) {
  const id = useId()
  // Keep a value that is not in the list (older drafts, imported files) selectable.
  const all = value && !options.includes(value) ? [value, ...options] : options
  return (
    <FieldShell id={id} label={label}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {all.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const THIS_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: THIS_YEAR + 6 - 1970 }, (_, i) => String(THIS_YEAR + 5 - i))

function parseDate(value: string) {
  const month = MONTHS.find((m) => new RegExp(`\\b${m}`, 'i').test(value)) ?? ''
  const year = value.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''
  return { month, year }
}

interface MonthYearProps {
  label: string
  /** Stored as text: "Jan 2022", "2022" or "". */
  value: string
  onChange: (value: string) => void
  /** Shown instead of the pickers, e.g. "Present" for a current job. */
  fixed?: string
}

/** Month and year pickers — consistent dates without typing. Month is optional. */
export function MonthYear({ label, value, onChange, fixed }: MonthYearProps) {
  const id = useId()
  const { month, year } = parseDate(value)
  const set = (m: string, y: string) => onChange([m, y].filter(Boolean).join(' '))
  return (
    <FieldShell id={id} label={label} group>
      {fixed ? (
        <p className="rb-fixed">{fixed}</p>
      ) : (
        <div className="rb-monthyear">
          <select aria-label={`${label} month`} value={month} onChange={(e) => set(e.target.value, year)}>
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select aria-label={`${label} year`} value={year} onChange={(e) => set(month, e.target.value)}>
            <option value="">Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}
    </FieldShell>
  )
}

interface BulletsProps {
  label: string
  /** One bullet per line. */
  value: string
  onChange: (value: string) => void
  hint?: ReactNode
  placeholder?: string
  addLabel?: string
}

/** Bullet points edited one at a time: Enter adds the next, Backspace on an empty one removes it. */
export function Bullets({ label, value, onChange, hint, placeholder, addLabel = 'Add bullet point' }: BulletsProps) {
  const id = useId()
  const lines = value === '' ? [''] : value.split('\n')
  const refs = useRef<(HTMLTextAreaElement | null)[]>([])
  const focusNext = useRef<number | null>(null)

  useEffect(() => {
    if (focusNext.current === null) return
    refs.current[focusNext.current]?.focus()
    focusNext.current = null
  })

  // Boxes grow with their text. Browsers without CSS `field-sizing` get the height set here.
  useEffect(() => {
    if (typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content')) return
    for (const el of refs.current) {
      if (!el) continue
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight + 2}px`
    }
  }, [value])

  const commit = (next: string[], focus?: number) => {
    if (focus !== undefined) focusNext.current = focus
    onChange(next.join('\n'))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, i: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!lines[i].trim()) return
      const next = [...lines]
      next.splice(i + 1, 0, '')
      commit(next, i + 1)
    } else if (e.key === 'Backspace' && lines[i] === '' && lines.length > 1) {
      e.preventDefault()
      commit(
        lines.filter((_, k) => k !== i),
        Math.max(0, i - 1),
      )
    }
  }

  return (
    <FieldShell id={id} label={label} hint={hint} wide group>
      <ul className="rb-bullets">
        {lines.map((line, i) => (
          <li key={i}>
            <span aria-hidden="true">•</span>
            <textarea
              ref={(el) => {
                refs.current[i] = el
              }}
              rows={1}
              value={line}
              placeholder={i === 0 ? placeholder : undefined}
              aria-label={`${label}, point ${i + 1}`}
              onChange={(e) => {
                // A pasted list becomes one bullet per line.
                const parts = e.target.value.split('\n').map((p) => p.replace(/^\s*[-•*–]\s*/, ''))
                const next = [...lines]
                next.splice(i, 1, ...parts)
                commit(next, parts.length > 1 ? i + parts.length - 1 : undefined)
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
            />
            <button
              type="button"
              className="rb-icon"
              disabled={lines.length === 1 && !line}
              onClick={() => commit(lines.length === 1 ? [''] : lines.filter((_, k) => k !== i))}
              aria-label={`Remove point ${i + 1}`}
            >
              <X aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="rb-add rb-add--small" onClick={() => commit([...lines, ''], lines.length)}>
        <Plus aria-hidden="true" /> {addLabel}
      </button>
    </FieldShell>
  )
}
