import type { ReactElement } from 'react'
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

function StoreSchematic() {
  return (
    <>
      {/* top bar */}
      <rect x="60" y="60" width="680" height="44" rx="12" className="v-panel" />
      <rect x="84" y="77" width="74" height="10" rx="5" className="v-strong" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={318 + i * 62} y="79" width="42" height="6" rx="3" className="v-dim" />
      ))}
      <circle cx="708" cy="82" r="10" className="v-outline" />
      <circle cx="716" cy="74" r="4.5" className="v-accent" />

      {/* hero banner */}
      <rect x="60" y="120" width="420" height="168" rx="12" className="v-panel" />
      <rect x="88" y="148" width="58" height="7" rx="3.5" className="v-accent" />
      <rect x="88" y="170" width="270" height="18" rx="6" className="v-strong" />
      <rect x="88" y="198" width="200" height="18" rx="6" className="v-strong" />
      <rect x="88" y="230" width="230" height="7" rx="3.5" className="v-dim" />
      <rect x="88" y="252" width="104" height="24" rx="12" className="v-accent" />

      {/* featured garment */}
      <g className="v-float v-float--0">
        <rect x="500" y="120" width="240" height="168" rx="12" className="v-panel" />
        <path
          d="M594 150 L610 141 Q620 152 630 141 L646 150 L664 170 L650 180 L646 174 L646 262 L594 262 L594 174 L590 180 L576 170 Z"
          className="v-accent"
        />
        <rect x="690" y="140" width="34" height="14" rx="7" className="v-outline" />
      </g>

      {/* product grid */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className={i === 1 ? 'v-float v-float--1' : undefined}>
          <rect x={60 + i * 172} y="304" width="160" height="156" rx="12" className="v-panel" />
          <rect x={72 + i * 172} y="316" width="136" height="88" rx="8" className={i === 1 ? 'v-row' : 'v-grid-fill'} />
          <rect x={72 + i * 172} y="418" width={70 + ((i * 23) % 40)} height="8" rx="4" className="v-strong" />
          <rect x={72 + i * 172} y="436" width="44" height="8" rx="4" className={i === 1 ? 'v-accent' : 'v-dim'} />
          <circle cx={194 + i * 172} cy="440" r="6" className="v-outline" />
        </g>
      ))}
    </>
  )
}

function FootballSchematic() {
  const home = [
    [280, 104],
    [220, 150],
    [340, 150],
    [180, 205],
    [280, 200],
    [380, 205],
  ]
  const away = [
    [280, 416],
    [215, 370],
    [345, 370],
    [175, 318],
    [280, 322],
    [385, 318],
  ]
  return (
    <>
      {/* pitch */}
      <rect x="60" y="60" width="440" height="400" rx="14" className="v-panel" />
      <rect x="84" y="84" width="392" height="352" rx="6" className="v-outline" />
      <line x1="84" y1="260" x2="476" y2="260" className="v-outline" />
      <circle cx="280" cy="260" r="44" className="v-outline" />
      <circle cx="280" cy="260" r="4" className="v-dim" />
      <rect x="200" y="84" width="160" height="56" className="v-outline" />
      <rect x="200" y="380" width="160" height="56" className="v-outline" />
      {home.map(([x, y], i) => (
        <circle key={`h${i}`} cx={x} cy={y} r="9" className="v-accent" />
      ))}
      {away.map(([x, y], i) => (
        <circle key={`a${i}`} cx={x} cy={y} r="9" className="v-strong" />
      ))}

      {/* scoreboard */}
      <g className="v-float v-float--0">
        <rect x="520" y="60" width="220" height="124" rx="14" className="v-panel" />
        <circle cx="562" cy="112" r="17" className="v-outline v-outline--on" />
        <circle cx="698" cy="112" r="17" className="v-outline" />
        <rect x="602" y="100" width="56" height="24" rx="6" className="v-strong" />
        <rect x="604" y="146" width="52" height="14" rx="7" className="v-accent" />
      </g>

      {/* player stats */}
      <g className="v-float v-float--1">
        <rect x="520" y="200" width="220" height="260" rx="14" className="v-panel" />
        <rect x="540" y="222" width="70" height="8" rx="4" className="v-dim" />
        {[0.82, 0.56, 0.7, 0.38, 0.64].map((w, i) => (
          <g key={i}>
            <rect x="540" y={254 + i * 40} width="36" height="7" rx="3.5" className="v-dim" />
            <rect x="590" y={253 + i * 40} width="130" height="9" rx="4.5" className="v-track" />
            <rect x="590" y={253 + i * 40} width={130 * w} height="9" rx="4.5" className={i === 0 ? 'v-accent' : 'v-strong'} />
          </g>
        ))}
      </g>
    </>
  )
}

function FinanceSchematic() {
  return (
    <>
      {/* trend chart */}
      <rect x="60" y="60" width="460" height="252" rx="14" className="v-panel" />
      <rect x="86" y="84" width="80" height="8" rx="4" className="v-dim" />
      <rect x="86" y="104" width="130" height="20" rx="6" className="v-strong" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="86" y1={170 + i * 34} x2="494" y2={170 + i * 34} className="v-line" />
      ))}
      <path d="M86 260 L150 238 L214 248 L278 204 L342 214 L406 176 L494 160 L494 272 L86 272 Z" className="v-row" />
      <path d="M86 260 L150 238 L214 248 L278 204 L342 214 L406 176 L494 160" className="v-stroke" />
      <circle cx="406" cy="176" r="6" className="v-accent" />

      {/* category donut */}
      <g className="v-float v-float--0">
        <rect x="540" y="60" width="200" height="252" rx="14" className="v-panel" />
        <circle cx="640" cy="150" r="52" className="v-ring" />
        <circle cx="640" cy="150" r="52" className="v-ring v-ring--on" pathLength="100" strokeDasharray="42 100" transform="rotate(-90 640 150)" />
        <circle
          cx="640"
          cy="150"
          r="52"
          className="v-ring v-ring--alt"
          pathLength="100"
          strokeDasharray="24 100"
          strokeDashoffset="-46"
          transform="rotate(-90 640 150)"
        />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="566" y={234 + i * 22} width="10" height="10" rx="3" className={i === 0 ? 'v-accent' : i === 1 ? 'v-strong' : 'v-dim'} />
            <rect x="586" y={236 + i * 22} width={70 - i * 12} height="6" rx="3" className="v-dim" />
          </g>
        ))}
      </g>

      {/* transactions */}
      <rect x="60" y="328" width="460" height="132" rx="14" className="v-panel" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx="94" cy={362 + i * 34} r="11" className={i === 1 ? 'v-outline v-outline--on' : 'v-outline'} />
          <rect x="118" y={358 + i * 34} width={120 + ((i * 37) % 60)} height="8" rx="4" className="v-strong" />
          <rect x="426" y={358 + i * 34} width="68" height="8" rx="4" className={i === 1 ? 'v-accent' : 'v-dim'} />
        </g>
      ))}

      {/* savings goal */}
      <g className="v-float v-float--1">
        <rect x="540" y="328" width="200" height="132" rx="14" className="v-panel" />
        <rect x="562" y="352" width="76" height="8" rx="4" className="v-dim" />
        <rect x="562" y="374" width="104" height="18" rx="6" className="v-strong" />
        <rect x="562" y="414" width="156" height="10" rx="5" className="v-track" />
        <rect x="562" y="414" width="104" height="10" rx="5" className="v-accent" />
      </g>
    </>
  )
}

const SCHEMATICS: Record<VisualKind, () => ReactElement> = {
  erp: ErpSchematic,
  exam: ExamSchematic,
  store: StoreSchematic,
  football: FootballSchematic,
  finance: FinanceSchematic,
}

export function ProjectVisual({ kind, label }: { kind: VisualKind; label: string }) {
  const Schematic = SCHEMATICS[kind]
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
      <Schematic />
    </svg>
  )
}
