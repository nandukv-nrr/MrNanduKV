import type { ProjectVisual as VisualKind } from '../data/types'

/**
 * Abstract interface schematics used as project covers until real screenshots
 * are added (see `screenshots` in src/data/projects.ts). They are illustrative
 * diagrams drawn in code — deliberately not imitations of the real UI.
 */

function ErpSchematic() {
  const rows = [0, 1, 2, 3, 4, 5]
  const colX = [248, 372, 470, 568, 666]
  const colW = [96, 70, 70, 70, 56]
  return (
    <>
      {/* sidebar */}
      <rect x="40" y="40" width="150" height="420" rx="12" className="v-panel" />
      <rect x="62" y="66" width="56" height="10" rx="5" className="v-accent" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="62" y={112 + i * 34} width={i === 1 ? 106 : 70 + ((i * 17) % 34)} height="8" rx="4" className={i === 1 ? 'v-strong' : 'v-dim'} />
      ))}
      <rect x="52" y="136" width="126" height="28" rx="8" className="v-outline" />

      {/* stat tiles */}
      {[0, 1, 2].map((i) => (
        <g key={i} className={`v-float v-float--${i}`}>
          <rect x={220 + i * 182} y="40" width="166" height="92" rx="12" className="v-panel" />
          <rect x={238 + i * 182} y="60" width="54" height="7" rx="3.5" className="v-dim" />
          <rect x={238 + i * 182} y="84" width={i === 0 ? 92 : 70} height="18" rx="5" className={i === 0 ? 'v-accent' : 'v-strong'} />
        </g>
      ))}

      {/* data grid */}
      <rect x="220" y="152" width="530" height="308" rx="12" className="v-panel" />
      {colX.map((x, c) => (
        <rect key={c} x={x} y="176" width={colW[c] * 0.6} height="7" rx="3.5" className="v-strong" />
      ))}
      <line x1="220" y1="200" x2="750" y2="200" className="v-line" />
      {rows.map((r) => (
        <g key={r}>
          <rect x="236" y={220 + r * 38} width="10" height="10" rx="2.5" className={r === 2 ? 'v-accent' : 'v-outline'} />
          {colX.map((x, c) => (
            <rect
              key={c}
              x={x + (c === 0 ? 10 : 0)}
              y={221 + r * 38}
              width={colW[c] * (0.55 + (((r + 1) * (c + 2) * 7) % 40) / 100)}
              height="8"
              rx="4"
              className={r === 2 ? 'v-strong' : 'v-dim'}
            />
          ))}
          {r < rows.length - 1 && <line x1="220" y1={244 + r * 38} x2="750" y2={244 + r * 38} className="v-line" />}
        </g>
      ))}
      <rect x="221" y="287" width="528" height="36" className="v-row" />
    </>
  )
}

function ExamSchematic() {
  return (
    <>
      {/* question sheet */}
      <rect x="60" y="40" width="480" height="420" rx="14" className="v-panel" />
      <rect x="88" y="70" width="64" height="9" rx="4.5" className="v-accent" />
      <rect x="88" y="104" width="380" height="12" rx="6" className="v-strong" />
      <rect x="88" y="128" width="270" height="12" rx="6" className="v-strong" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="88" y={178 + i * 58} width="424" height="44" rx="10" className={i === 1 ? 'v-outline v-outline--on' : 'v-outline'} />
          <circle cx="112" cy={200 + i * 58} r="7" className={i === 1 ? 'v-accent' : 'v-outline'} />
          <rect x="134" y={196 + i * 58} width={150 + ((i * 53) % 120)} height="8" rx="4" className={i === 1 ? 'v-strong' : 'v-dim'} />
        </g>
      ))}
      <rect x="412" y="418" width="100" height="24" rx="12" className="v-accent" />
      <rect x="88" y="424" width="70" height="10" rx="5" className="v-dim" />

      {/* timer */}
      <g className="v-float v-float--0">
        <rect x="570" y="40" width="170" height="190" rx="14" className="v-panel" />
        <circle cx="655" cy="124" r="46" className="v-ring" />
        <circle cx="655" cy="124" r="46" className="v-ring v-ring--on" pathLength="100" strokeDasharray="68 100" transform="rotate(-90 655 124)" />
        <rect x="631" y="118" width="48" height="12" rx="6" className="v-strong" />
        <rect x="625" y="196" width="60" height="8" rx="4" className="v-dim" />
      </g>

      {/* question map */}
      <g className="v-float v-float--1">
        <rect x="570" y="250" width="170" height="210" rx="14" className="v-panel" />
        <rect x="590" y="272" width="60" height="8" rx="4" className="v-dim" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x={590 + (i % 4) * 34}
            y={298 + Math.floor(i / 4) * 36}
            width="24"
            height="24"
            rx="6"
            className={i < 5 ? 'v-strong' : i === 5 ? 'v-accent' : 'v-outline'}
          />
        ))}
      </g>
    </>
  )
}

export function ProjectVisual({ kind, label }: { kind: VisualKind; label: string }) {
  return (
    <svg className={`visual visual--${kind}`} viewBox="0 0 800 500" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="500" className="v-bg" />
      <g className="v-grid" aria-hidden="true">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`x${i}`} x1={i * 57} y1="0" x2={i * 57} y2="500" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`y${i}`} x1="0" y1={i * 62.5} x2="800" y2={i * 62.5} />
        ))}
      </g>
      {kind === 'erp' ? <ErpSchematic /> : <ExamSchematic />}
    </svg>
  )
}
