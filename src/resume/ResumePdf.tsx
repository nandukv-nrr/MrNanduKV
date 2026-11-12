import { Document, Font, Link, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer'
import { INK, TEMPLATES } from './templates'
import type { ResumeData } from './types'
import { buildView, type ResumeView, type ViewSection } from './view'

// Never split words across lines: hyphenated fragments confuse ATS keyword matching.
Font.registerHyphenationCallback((word) => [word])

/** The PDF's built-in fonts: real text, readable everywhere, nothing to download. */
const FONTS = {
  sans: { regular: 'Helvetica', bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique' },
  serif: { regular: 'Times-Roman', bold: 'Times-Bold', italic: 'Times-Italic' },
}

function ResumeDocument({ data, view }: { data: ResumeData; view: ResumeView }) {
  const spec = TEMPLATES[data.settings.template]
  const font = FONTS[spec.font]
  const color = { accent: data.settings.accent, text: INK.text, muted: INK.muted }
  const center = spec.headerAlign === 'center'

  const s = StyleSheet.create({
    page: { padding: spec.margin, fontFamily: font.regular, fontSize: spec.base, lineHeight: spec.lineHeight, color: INK.text },
    header: { marginBottom: spec.sectionGap, alignItems: center ? 'center' : 'flex-start' },
    name: { fontFamily: font.bold, fontSize: spec.nameSize, lineHeight: 1.15, color: color[spec.nameColor] },
    title: { fontSize: spec.base + 2, marginTop: 2, color: INK.text },
    contacts: { marginTop: 4, color: INK.muted, flexDirection: 'row', flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start' },
    link: { color: INK.muted, textDecoration: 'none' },
    section: { marginBottom: spec.sectionGap },
    heading: {
      fontFamily: font.bold,
      fontSize: spec.headingSize,
      letterSpacing: spec.headingTracking,
      textTransform: 'uppercase',
      color: color[spec.headingColor],
      paddingBottom: spec.headingRule ? 2 : 0,
      marginBottom: spec.headingRule ? 5 : 4,
      borderBottomWidth: spec.headingRule ? 0.75 : 0,
      borderBottomColor: spec.headingColor === 'text' ? INK.text : INK.rule,
    },
    entry: { marginBottom: spec.entryGap },
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    bold: { fontFamily: font.bold },
    sub: { fontFamily: font.italic },
    right: { flexShrink: 0, color: INK.muted },
    grow: { flex: 1 },
    para: { marginTop: 1 },
    bullet: { flexDirection: 'row', marginTop: 1.5 },
    dot: { width: 10 },
  })

  const renderSection = (section: ViewSection) => (
    <View key={section.id} style={s.section}>
      {/* Keep a heading with at least the start of its content. */}
      <Text style={s.heading} minPresenceAhead={30}>
        {section.heading}
      </Text>
      {section.kind === 'text' && <Text>{section.text}</Text>}
      {section.kind === 'rows' &&
        section.rows.map((row, i) => (
          <Text key={i} style={s.para}>
            {row.label ? <Text style={s.bold}>{row.label}: </Text> : null}
            {row.value}
          </Text>
        ))}
      {section.kind === 'entries' &&
        section.entries.map((entry, i) => (
          <View key={i} style={i < section.entries.length - 1 ? s.entry : undefined}>
            <View style={s.row} wrap={false}>
              <Text style={[s.bold, s.grow]}>{entry.title}</Text>
              {entry.date ? <Text style={s.right}>{entry.date}</Text> : null}
            </View>
            {entry.subtitle || entry.location ? (
              <View style={s.row} wrap={false}>
                {entry.link ? (
                  <Link src={entry.link} style={[s.link, s.sub, s.grow]}>
                    {entry.subtitle}
                  </Link>
                ) : (
                  <Text style={[s.sub, s.grow]}>{entry.subtitle}</Text>
                )}
                {entry.location ? <Text style={s.right}>{entry.location}</Text> : null}
              </View>
            ) : null}
            {entry.text ? <Text style={s.para}>{entry.text}</Text> : null}
            {entry.bullets.map((b, k) => (
              <View key={k} style={s.bullet} wrap={false}>
                <Text style={s.dot}>•</Text>
                <Text style={s.grow}>{b}</Text>
              </View>
            ))}
          </View>
        ))}
    </View>
  )

  return (
    <Document title={`${view.name} — Resume`} author={view.name} subject={view.title || 'Resume'} creator="Resume Builder">
      <Page size={data.settings.pageSize} style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{view.name}</Text>
          {view.title ? <Text style={s.title}>{view.title}</Text> : null}
          {view.contacts.length > 0 ? (
            // Separate items in a wrapping row, so a long line breaks between contacts, never inside one.
            <View style={s.contacts}>
              {view.contacts.map((c, i) => (
                <Text key={i}>
                  {c.href ? (
                    <Link src={c.href} style={s.link}>
                      {c.text}
                    </Link>
                  ) : (
                    c.text
                  )}
                  {i < view.contacts.length - 1 ? '  |  ' : ''}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
        {view.sections.map(renderSection)}
      </Page>
    </Document>
  )
}

/** Builds the PDF in the browser and returns it as a file blob. */
export function renderResumePdf(data: ResumeData): Promise<Blob> {
  return pdf(<ResumeDocument data={data} view={buildView(data)} />).toBlob()
}
