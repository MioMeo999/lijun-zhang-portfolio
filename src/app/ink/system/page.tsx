import type { Metadata } from 'next'
import ink from '../ink.module.css'
import styles from './system.module.css'

export const metadata: Metadata = {
  title: 'Ink & Resonance — the system',
  description:
    'The reference sheet for the ink exploration: what each principle of Chinese ink painting became in the interface.',
  robots: { index: false, follow: false },
}

/* The five axioms are not decoration on this page — they are the build order.
   Each one is a claim about ink painting on the left and the mechanic it turned
   into on the right. If a mechanic cannot be stated in that second column, it
   does not belong in the design. */
const axioms = [
  {
    n: '01',
    idea: 'Void is content',
    glyph: '留白',
    mechanic:
      'Twelve columns, and nothing is ever allowed to fill them — the widest block on the page spans seven. Which columns stay empty changes section to section, so the emptiness travels down the page instead of sitting in a fixed margin. The vertical rhythm is uneven on purpose: some sections nearly touch, one is given a screen with a single sentence on it.',
  },
  {
    n: '02',
    idea: 'The brush defines the edge',
    glyph: '筆意',
    mechanic:
      'No card has a border, a fill, or a shadow. A photograph is held by a hairline that is dense where the brush pressed and gone at both ends. Images are masked so two or three of their edges dissolve into the paper rather than being cropped by a rectangle. Section dividers are the same evaporating stroke, never a full-width rule.',
  },
  {
    n: '03',
    idea: 'Movement is suggested, not shown',
    glyph: '氣韻',
    mechanic:
      'Nothing slides in from off-screen. Elements arrive at density: they begin out of focus and at low opacity, then resolve, the way ink soaks into paper and finds its own edge. The two mist fields drift at speeds slow enough that you cannot catch them moving, only notice they have moved.',
  },
  {
    n: '04',
    idea: 'Accent through mineral colour',
    glyph: '設色',
    mechanic:
      'Six tones of ink carry the whole page. Four ground-mineral pigments are permitted, and their combined area on any screen stays near five percent. Cinnabar appears on the seal, on one dot under the active nav item, and on a single node in a divider. Photographs rest inside the palette and give their colour back only when someone looks at them.',
  },
  {
    n: '05',
    idea: 'Restraint creates resonance',
    glyph: '含蓄',
    mechanic:
      'Three type sizes do almost all the work. Micro-labels stay pale enough to read as marginal annotation rather than signage. The identity line is given a screen of its own with nothing else on it, because a painting puts its inscription in the empty part.',
  },
  {
    n: '06',
    idea: 'The note is the pluck; the music is the decay',
    glyph: '韻',
    mechanic:
      'Taken from the guzheng rather than the brush. Every interaction attacks in about 210ms and releases over about 880ms. Underlines draw quickly under the pointer and take almost a second to lift; colour returns to a photograph at once and fades back slowly. The response consistently outlives the gesture that caused it.',
  },
]

const ramp = [
  { glyph: '焦', name: 'Burnt', hex: '#16150f', on: '#f3f0e8' },
  { glyph: '濃', name: 'Thick', hex: '#2b2820', on: '#f3f0e8' },
  { glyph: '重', name: 'Heavy', hex: '#4c483d', on: '#f3f0e8' },
  { glyph: '淡', name: 'Light', hex: '#7a7568', on: '#f3f0e8' },
  { glyph: '清', name: 'Clear', hex: '#a8a394', on: '#16150f' },
  { glyph: '水', name: 'Water', hex: '#cdc8b9', on: '#16150f' },
]

const minerals = [
  { glyph: '石青', name: 'Azurite', hex: '#3b566a' },
  { glyph: '石綠', name: 'Malachite', hex: '#5f7568' },
  { glyph: '赭石', name: 'Ochre', hex: '#a07f4c' },
  { glyph: '朱砂', name: 'Cinnabar', hex: '#9c3a26' },
]

const dilutions = [
  {
    glyph: '淡墨',
    label: 'Light ink',
    swatch: '#faf8f3',
    notes: [
      'Atmosphere almost switched off; the paper stays close to silk',
      'Images crop square, with one soft edge instead of three',
      'The stepped elements barely step — an even, catalogue rhythm',
      'The darkest ink never reaches black',
    ],
  },
  {
    glyph: '潑墨',
    label: 'Poured ink',
    swatch: '#f3f0e8',
    notes: [
      'The default reading, and the one the portfolio is designed around',
      'Ink washes and drifting mist carry the empty ground',
      'Alternating sections sit on a soft swell of deeper paper',
      'Images dissolve on three edges',
    ],
  },
  {
    glyph: '破墨',
    label: 'Broken ink',
    swatch: '#eeeae0',
    notes: [
      'Type set larger, tracked tighter, in a darker ink',
      'The portrait lifts out of its row and runs off the right edge',
      'Section markers switch from ink to cinnabar',
      'The recession between the three movements roughly doubles',
    ],
  },
]

const refusals = [
  {
    title: 'No ink imagery',
    body:
      'Not one brush stroke, mountain, mist bank, or paper texture is a picture. The grain is fractal noise generated in the stylesheet; the washes are gradients; the torn edges are masks. Nothing here could be found in a stock library.',
  },
  {
    title: 'No cultural props',
    body:
      'No lanterns, no dragons, no cloud motifs, no calligraphic Latin type, no vermillion fields. The seal stays because a name-stamp is what an artist actually signs with, and it is 2rem wide.',
  },
  {
    title: 'Almost no Chinese text',
    body:
      'The characters that remain each carry meaning that the design depends on: the names of the three dilutions, and the three distances of landscape painting beside the three movements of the practice. Used as ornament, they were removed.',
  },
  {
    title: 'Nothing was rewritten',
    body:
      'Every sentence, section, and link is carried over from the live site. The one change is that two lines were given their own screen: “Music is not an object to preserve. It is a place to meet.”',
  },
]

export default function InkSystemPage() {
  return (
    <div className={ink.page} data-tone="nong">
      <div className={ink.exploreFlag}>
        <span className={ink.flagLabel}>Reference sheet · ink &amp; resonance</span>
        <span />
        <a href="/ink" className={ink.flagReturn}>Back to the exploration</a>
      </div>

      <span className={`${ink.washField} ${ink.washTop}`} aria-hidden="true" />
      <span className={`${ink.washField} ${ink.washMid}`} aria-hidden="true" />

      <main className={`${ink.canvas} ${styles.sheet}`}>
        <header className={styles.masthead}>
          <p className={ink.micro} style={{ marginBottom: '1.6rem' }}>
            The translation, stated
          </p>
          <h1 className={styles.mastheadTitle}>
            What ink painting knows, <em>written as an interface.</em>
          </h1>
          <p className={ink.lead}>
            This is not a website decorated with ink. It is a website built out of
            six claims about how ink painting composes, each one turned into a
            mechanic you can point at in the stylesheet. Where a principle could
            not be turned into a mechanic, it was left out.
          </p>
        </header>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2>Six axioms, and what each became</h2>
            <p className={ink.micro}>Principle → mechanic</p>
          </div>
          <div className={styles.axioms}>
            {axioms.map((axiom) => (
              <article className={styles.axiom} key={axiom.n}>
                <span className={styles.axiomNumber}>{axiom.n}</span>
                <h3 className={styles.axiomIdea}>
                  {axiom.idea}
                  <small aria-hidden="true">{axiom.glyph}</small>
                </h3>
                <p className={styles.axiomMechanic}>{axiom.mechanic}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2>墨分五色 — ink divides into tones</h2>
            <p className={ink.micro}>Six inks · four minerals</p>
          </div>
          <div className={styles.ramp}>
            {ramp.map((step) => (
              <div
                className={styles.rampStep}
                key={step.hex}
                style={{ background: step.hex, color: step.on }}
              >
                <b aria-hidden="true">{step.glyph}</b>
                <small>{step.name}<br />{step.hex}</small>
              </div>
            ))}
          </div>
          <div className={styles.minerals}>
            {minerals.map((mineral) => (
              <div className={styles.mineral} key={mineral.hex} style={{ background: mineral.hex }}>
                <b aria-hidden="true">{mineral.glyph}</b>
                <small>{mineral.name}<br />{mineral.hex}</small>
              </div>
            ))}
            <p className={styles.mineralNote}>
              The minerals are a budget, not a palette. Their combined area on any
              screen stays near five percent, and cinnabar is reserved almost
              entirely for the seal — which is why it still reads as a signature
              rather than as a brand colour.
            </p>
          </div>
        </section>

        <section className={`${styles.block} ${styles.blockNarrow}`}>
          <div className={styles.blockHead}>
            <h2>Three voices</h2>
            <p className={ink.micro}>Brush · writing · annotation</p>
          </div>
          <div className={styles.specimen}>
            <div className={styles.specimenRow}>
              <p className={styles.specimenLabel}>
                Display
                <span>Cormorant Garamond 300</span>
              </p>
              <p className={ink.displayL} style={{ margin: 0 }}>
                A place to <em>meet.</em>
              </p>
            </div>
            <div className={styles.specimenRow}>
              <p className={styles.specimenLabel}>
                Reading
                <span>Literata 300 · 1.88 leading</span>
              </p>
              <p className={ink.body}>
                Kept from the current site at the display size, because its thin
                strokes are the closest Latin type comes to a fine brush line, and
                because the exploration should still sound like the same person.
                Literata replaces the previous body face: it is built for long-form
                screen reading and carries the warmth of something printed.
              </p>
            </div>
            <div className={styles.specimenRow}>
              <p className={styles.specimenLabel}>
                Annotation
                <span>Inter 400 · .24em tracking</span>
              </p>
              <p className={ink.micro}>Only ever small, only ever pale</p>
            </div>
          </div>
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2>Three dilutions of one ink</h2>
            <p className={ink.micro}>Not three websites</p>
          </div>
          <div className={styles.dilutions}>
            {dilutions.map((dilution) => (
              <article className={styles.dilution} key={dilution.label}>
                <p className={styles.dilutionName}>
                  <span aria-hidden="true">{dilution.glyph}</span>
                  <i>{dilution.label}</i>
                </p>
                <span
                  className={styles.dilutionSwatch}
                  style={{ background: dilution.swatch }}
                  aria-hidden="true"
                />
                <ul className={styles.dilutionList}>
                  {dilution.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.block} ${styles.blockNarrow}`}>
          <div className={styles.blockHead}>
            <h2>韻 — attack and release</h2>
            <p className={ink.micro}>210ms in · 880ms out</p>
          </div>
          <div className={styles.curves}>
            <div className={styles.curve}>
              <svg viewBox="0 0 200 90" role="img" aria-label="Attack curve: rises fast, settles early">
                <path
                  d="M0 88 C 44 88, 62 6, 200 2"
                  fill="none"
                  stroke="var(--ink-1)"
                  strokeWidth="1.4"
                />
              </svg>
              <p className={ink.micro}>Attack · under the pointer</p>
              <p className={ink.annotation}>
                The stroke lands almost immediately. A plucked string does not ease in.
              </p>
            </div>
            <div className={styles.curve}>
              <svg viewBox="0 0 200 90" role="img" aria-label="Release curve: falls slowly with a long tail">
                <path
                  d="M0 2 C 30 22, 58 72, 200 88"
                  fill="none"
                  stroke="var(--cinnabar)"
                  strokeWidth="1.4"
                />
              </svg>
              <p className={ink.micro}>Release · after the pointer leaves</p>
              <p className={ink.annotation}>
                Four times longer, and almost still for its last third. This is the
                one thing on the page a visitor will feel without being able to name.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.block}>
          <div className={styles.blockHead}>
            <h2>What was deliberately not done</h2>
            <p className={ink.micro}>The harder half of the brief</p>
          </div>
          <div className={styles.refusals}>
            {refusals.map((refusal) => (
              <div className={styles.refusal} key={refusal.title}>
                <b>{refusal.title}</b>
                <span>{refusal.body}</span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.backLinks}>
          <a href="/ink" className={ink.strokeLink}>The exploration</a>
          <a href="/" className={ink.strokeLink}>The current portfolio</a>
        </div>
      </main>
    </div>
  )
}
