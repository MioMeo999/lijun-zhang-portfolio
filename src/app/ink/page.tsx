'use client'

import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ArrowUpRight,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Music2,
  Play,
  X,
} from 'lucide-react'
import { performanceVideos, pressItems } from '@/data/portfolioMedia'
import { engagementArchive } from '@/data/portfolioEngagements'
import styles from './ink.module.css'

/* ---------------------------------------------------------------------------
 * INK & RESONANCE — visual exploration
 *
 * Same person, same work, same words. A different way of holding them.
 *
 * The content and its order are carried over from the live site unchanged;
 * the one adjustment is that the two lines at the heart of the identity —
 * "Music is not an object to preserve. / It is a place to meet." — have been
 * lifted out of the Story paragraph block and given a screen of their own,
 * placed immediately before it. In a handscroll the inscription gets its own
 * stretch of empty silk. That is the whole change.
 * ------------------------------------------------------------------------ */

type Tone = 'qing' | 'nong' | 'po'

const tones: Array<{ id: Tone; name: string; label: string }> = [
  { id: 'qing', name: '淡墨', label: 'Light' },
  { id: 'nong', name: '潑墨', label: 'Atmospheric' },
  { id: 'po', name: '破墨', label: 'Editorial' },
]

const navItems = [
  { href: '#story', label: 'About' },
  { href: '#practice', label: 'Approach' },
  { href: '#research', label: 'Research' },
  { href: '#archive', label: 'Engagements' },
  { href: '#videos', label: 'Watch' },
  { href: '#press', label: 'Press' },
]

const researchReportUrl =
  'https://www.healthybuildingsnetwork.org/blog/sonic-belonging.html'

const socialLinks = [
  { id: 'wechat', name: 'WeChat', qrCode: '/images/social/wechat-qr.png' },
  { id: 'instagram', name: 'Instagram', qrCode: '/images/social/instagram-qr.png' },
  { id: 'whatsapp', name: 'WhatsApp', qrCode: '/images/social/whatsapp-qr.jpg' },
]

const pressNotes: Record<string, { eyebrow: string; description: ReactNode; note: string }> = {
  'China Daily': {
    eyebrow: 'China Daily · Vision China · September 2026',
    description: (
      <>
        Live coverage of the London Vision China event{' '}
        <em>Listen to Each Other, Open New Horizons</em>, opening with an ensemble performance of
        guzheng, erhu and violin. I performed as part of the opening programme, bringing music into a
        wider conversation about cultural dialogue and connection.
      </>
    ),
    note: 'Vision China · September 2026',
  },
  CCTV: {
    eyebrow: 'China Central Television · Broadcast',
    description:
      'China’s national broadcaster featured Guzheng performance and UK–China cultural exchange work as part of its coverage of Chinese cultural activity overseas.',
    note: 'Broadcast segment',
  },
  "People's Daily": {
    eyebrow: 'People’s Daily Overseas Edition · 21 August 2025',
    description:
      'Print coverage of performances and community cultural work in the United Kingdom, including collaborations with schools and community organisations.',
    note: 'Overseas edition · 2025',
  },
  CGTN: {
    eyebrow: 'CGTN Europe · October 2025',
    description:
      'A Mid-Autumn feature exploring Chinese cultural celebration, music, and friendship between communities in Manchester.',
    note: 'Mid-Autumn feature · 2025',
  },
}

const describeEngagement = (tags: string[]) => {
  const hasWorkshop = tags.includes('workshop')
  const hasPerformance = tags.includes('performance')
  const hasCommunity = tags.includes('community')

  if (hasWorkshop && hasPerformance && hasCommunity)
    return 'Performance, participation and community exchange brought together in one shared cultural programme.'
  if (hasWorkshop && hasPerformance)
    return 'A participatory encounter moving between live performance, demonstration and shared learning.'
  if (hasPerformance && hasCommunity)
    return 'A live musical gathering shaped around celebration, cultural connection and a shared audience.'
  if (hasWorkshop && hasCommunity)
    return 'An open learning space connecting traditional music with conversation, participation and community.'
  if (hasWorkshop)
    return 'A hands-on session exploring sound, tradition and the social possibilities of making music together.'
  return 'A live guzheng performance presented as part of an evolving, research-led artistic practice.'
}

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year.slice(2)}`
}

/** Section index: a numeral, a stroke that lifts off, and a word. */
function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <div className={styles.index} data-ink>
      <span className={styles.indexNumber}>{n}</span>
      <span className={styles.micro}>{label}</span>
    </div>
  )
}

export default function InkExplorationPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const threadInkRef = useRef<HTMLSpanElement>(null)
  const threadDotRef = useRef<HTMLSpanElement>(null)

  const [tone, setTone] = useState<Tone>('nong')
  const [veiled, setVeiled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('story')
  const [activePressId, setActivePressId] = useState(pressItems[0].id)
  const [pressVideoId, setPressVideoId] = useState<string | null>(null)
  const [qrId, setQrId] = useState<string | null>(null)
  const [engagement, setEngagement] = useState<(typeof engagementArchive)[number] | null>(null)

  const sorted = [...engagementArchive].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const preview = sorted.slice(0, 9)
  const remaining = sorted.slice(9)
  const featured = performanceVideos.filter((v) => v.featured)
  const rest = performanceVideos.filter((v) => !v.featured)
  const activePressVideo = pressItems.find((p) => p.id === pressVideoId && p.videoUrl)
  const activeQr = socialLinks.find((s) => s.id === qrId)
  const activePress = pressItems.find((p) => p.id === activePressId) ?? pressItems[0]

  /* Tone is a viewing preference, so it survives a reload. */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('ink-tone')
      if (stored === 'qing' || stored === 'nong' || stored === 'po') setTone(stored)
    } catch {
      /* private browsing — the default tone is fine */
    }
  }, [])

  const chooseTone = useCallback((next: Tone) => {
    setTone(next)
    try {
      window.localStorage.setItem('ink-tone', next)
    } catch {
      /* nothing to remember, nothing to fix */
    }
  }, [])

  /* Arrival. One cascade per chapter, in document order, so a heading and the
     paragraph under it share a rhythm instead of running two of their own. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
    chapters.forEach((chapter) => {
      chapter.querySelectorAll<HTMLElement>('[data-ink]').forEach((el, i) => {
        el.style.setProperty('--enter', `${Math.min(i, 7) * 80}ms`)
      })
    })

    root.classList.add(styles.booting)
    void root.offsetWidth
    const boot = window.requestAnimationFrame(() => root.classList.remove(styles.booting))

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      chapters.forEach((c) => c.classList.add(styles.visible))
      return () => window.cancelAnimationFrame(boot)
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add(styles.visible)
          obs.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    chapters.forEach((c) => observer.observe(c))

    return () => {
      window.cancelAnimationFrame(boot)
      observer.disconnect()
    }
  }, [])

  /* The thread. Read on scroll, written on a frame — the dot lags the scroll
     slightly, which is the whole idea: the response outlives the gesture. */
  useEffect(() => {
    const ink = threadInkRef.current
    const dot = threadDotRef.current
    if (!ink || !dot) return

    let frame: number | null = null
    let current = 0
    let target = 0

    const render = () => {
      frame = null
      current += (target - current) * 0.11
      ink.style.transform = `scaleY(${current.toFixed(4)})`
      dot.style.transform = `translateY(${(current * window.innerHeight).toFixed(1)}px)`
      if (Math.abs(target - current) > 0.0006) frame = window.requestAnimationFrame(render)
    }

    const onScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      target = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0
      setVeiled(window.scrollY > 40)
      if (frame === null) frame = window.requestAnimationFrame(render)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  /* Which section the reader is inside. */
  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const sections = navItems
      .map((item) => root.querySelector<HTMLElement>(item.href))
      .filter((s): s is HTMLElement => Boolean(s))

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (top?.target.id) setActiveSection(top.target.id)
      },
      { threshold: [0, 0.16, 0.4], rootMargin: '-26% 0px -54% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* Anything that covers the page closes on Escape and locks the scroll. */
  const overlayOpen = Boolean(engagement || pressVideoId || qrId || menuOpen)
  useEffect(() => {
    if (!overlayOpen) return

    const previous = document.body.style.overflow
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setEngagement(null)
      setPressVideoId(null)
      setQrId(null)
      setMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [overlayOpen])

  const renderArchiveItem = (item: (typeof engagementArchive)[number], index: number) => (
    <button
      type="button"
      className={`${styles.archiveItem} ${styles.tonalImage}`}
      key={item.id}
      onClick={() => setEngagement(item)}
      data-ink
    >
      <span className={styles.archiveFrame}>
        <Image
          src={item.images[0]}
          alt={item.event}
          fill
          sizes="(max-width: 560px) 92vw, (max-width: 860px) 46vw, 30vw"
          loading={index < 3 ? 'eager' : 'lazy'}
        />
      </span>
      <span className={styles.archiveMeta}>
        <span className={styles.archiveDate}>
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span>{item.tags.join(' · ')}</span>
        </span>
        <span className={styles.archiveTitle}>{item.event}</span>
        <span className={styles.archiveVenue}>
          <MapPin size={12} aria-hidden="true" />
          {item.venue}
        </span>
      </span>
    </button>
  )

  const renderVideo = (
    video: (typeof performanceVideos)[number],
    index: number,
    lead = false,
  ) => (
    <a
      key={video.id}
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.videoItem} ${lead ? styles.videoLead : ''}`}
      aria-label={`Watch ${video.title} on YouTube (opens in a new tab)`}
      data-ink
    >
      <span className={styles.videoFrame}>
        <img
          src={video.thumbnailUrl || `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
          }}
        />
        <span className={styles.videoIndex}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.videoCue} aria-hidden="true">
          <Play size={15} fill="currentColor" />
        </span>
      </span>
      <span className={styles.videoMeta}>
        <span className={styles.videoCategory}>{video.category}</span>
        <span className={styles.videoTitle}>{video.title}</span>
      </span>
    </a>
  )

  return (
    <div className={styles.page} data-tone={tone} ref={rootRef}>
      <div className={styles.exploreFlag}>
        <span className={styles.flagLabel}>Visual exploration · not the live site</span>

        <div className={styles.toneSwitch} role="group" aria-label="Ink dilution">
          {tones.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.toneButton} ${tone === t.id ? styles.toneButtonActive : ''}`}
              onClick={() => chooseTone(t.id)}
              aria-pressed={tone === t.id}
            >
              <b aria-hidden="true">{t.name}</b>
              <i>{t.label}</i>
            </button>
          ))}
        </div>

        <a href="/" className={styles.flagReturn}>Return to the current portfolio</a>
      </div>

      {/* Atmosphere: generated, never photographed. */}
      <span className={`${styles.washField} ${styles.washTop}`} aria-hidden="true" />
      <span className={`${styles.washField} ${styles.washMid}`} aria-hidden="true" />
      <span className={`${styles.washField} ${styles.washArchive}`} aria-hidden="true" />
      <span className={`${styles.washField} ${styles.washPress}`} aria-hidden="true" />
      <span className={`${styles.washField} ${styles.washLow}`} aria-hidden="true" />

      <span className={styles.thread} aria-hidden="true">
        <span className={styles.threadInk} ref={threadInkRef} />
        <span className={styles.threadDot} ref={threadDotRef} />
      </span>

      <header className={`${styles.header} ${veiled ? styles.headerVeiled : ''}`}>
        <a href="#home" className={styles.identity} aria-label="Lijun Zhang, top of page">
          <span className={styles.seal} aria-hidden="true">張</span>
          <span className={styles.identityName}>LIJUN ZHANG</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href.slice(1) ? styles.navActive : undefined}
              aria-current={activeSection === item.href.slice(1) ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerRight}>
          <a href="#contact" className={styles.contactLink}>
            Collaborate <ArrowUpRight size={13} />
          </a>

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className={styles.mobileNav} aria-label="Mobile">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      )}

      <main>
        {/* ---- HERO ---------------------------------------------------- */}
        {/* The figure sits low and right of centre; the upper left is given
            away entirely. The emptiness is the composition. */}
        <section id="home" className={`${styles.canvas} ${styles.hero} ${styles.visible}`} data-chapter>
          <span className={styles.mistBand} style={{ top: '52%' } as CSSProperties} aria-hidden="true" />

          <div className={styles.heroWords}>
            <p className={`${styles.micro} ${styles.heroEyebrow}`} data-ink>
              Ink &amp; Resonance · Portfolio 2026
            </p>
            <h1 className={styles.displayXL} data-ink>
              <span className={styles.heroName}>Lijun Zhang</span>
              <span className={styles.heroRole}>Guzheng artist, researcher, cultural connector</span>
            </h1>
            <div className={styles.heroLines} data-ink>
              <span>Performing across Britain.</span>
              <span>Researching how music makes belonging.</span>
            </div>
            <div className={styles.heroActions} data-ink>
              <a href="#archive" className={styles.strokeLink}>
                Twenty-two rooms
              </a>
              <a href="#videos" className={`${styles.strokeLink} ${styles.strokeLinkQuiet}`}>
                <Play size={10} fill="currentColor" /> Listen
              </a>
            </div>
          </div>

          {/* Rectangular crop, but three of its edges are not there. */}
          <figure className={`${styles.heroFigure} ${styles.inkEdge} ${styles.tonalImage}`} data-ink>
            <Image
              src="/images/about-portrait.jpg"
              alt="Lijun Zhang playing the guzheng"
              fill
              sizes="(max-width: 860px) 92vw, 40vw"
              priority
            />
          </figure>

          <div className={styles.heroCorner} aria-hidden="true">
            <p className={styles.micro}>Leeds · United Kingdom</p>
            <p className={styles.micro}>Listen · Meet · Resonate</p>
          </div>
        </section>

        <div className={styles.seam} aria-hidden="true" />

        {/* ---- COLOPHON ------------------------------------------------ */}
        {/* 題跋. In a scroll the inscription goes in the empty part of the
            painting. Nothing else is on this screen. */}
        <section className={`${styles.canvas} ${styles.colophon}`} data-chapter>
          <div className={styles.colophonInner}>
            <blockquote className={styles.colophonQuote} data-ink>
              <span>Music is not an object to preserve.</span>
              <span><em>It is a place to meet.</em></span>
            </blockquote>
            <div className={styles.colophonSign} data-ink>
              <p>
                Lijun Zhang
                <br />
                Artist · Researcher · Cultural Connector
              </p>
              <span className={`${styles.seal} ${styles.sealLarge}`} aria-hidden="true">張</span>
            </div>
          </div>
        </section>

        <div className={`${styles.seam} ${styles.seamRight}`} aria-hidden="true" />

        {/* ---- STORY --------------------------------------------------- */}
        {/* The void crosses to the left margin and the text is pushed right —
            scrolling should feel like unrolling, not paging. */}
        <section id="story" className={`${styles.canvas} ${styles.story}`} data-chapter>
          <div className={styles.storyMark}>
            <SectionIndex n="01" label="Story" />
          </div>

          <div className={styles.storyBody}>
            <h2 className={`${styles.displayL} ${styles.storyHead}`} data-ink>
              A practice built <em>between places.</em>
            </h2>
            <p className={styles.body} data-ink>
              Lijun Zhang is a musician and cultural connector based in the United
              Kingdom. Through the Guzheng, he creates opportunities for people from
              different backgrounds to meet, learn, and connect through shared musical
              experiences.
            </p>
            <p className={styles.body} data-ink>
              Alongside his artistic practice, Lijun is pursuing a PhD at the University
              of Leeds. His work moves between performance, education, community
              engagement, artistic collaboration, and research into belonging and
              inclusive shared space.
            </p>
            <div className={styles.storyFacts} data-ink>
              <span><MapPin size={13} aria-hidden="true" /> Leeds, UK</span>
              <span><GraduationCap size={13} aria-hidden="true" /> University of Leeds</span>
              <span><Music2 size={13} aria-hidden="true" /> Guzheng</span>
            </div>
          </div>

          <div className={styles.storyAside} data-ink>
            <p className={styles.annotation}>
              Featured by CCTV, People’s Daily and CGTN; working with the University of
              Leeds, the Business Confucius Institute, and the Healthy Buildings Network.
            </p>
          </div>
        </section>

        <div className={styles.seam} aria-hidden="true" />

        {/* ---- PRACTICE ------------------------------------------------ */}
        {/* 三遠 — the three distances. Three panels stepped down and back
            rather than set in a row: recession, not a card grid. */}
        <section id="practice" className={`${styles.canvas} ${styles.practice} ${styles.tinted}`} data-chapter>
          <div className={styles.practiceHead}>
            <SectionIndex n="02" label="Approach" />
            <h2 className={styles.displayL} data-ink style={{ marginTop: '1.4rem' }}>
              One practice. <em>Three movements.</em>
            </h2>
            <p className={styles.lead} data-ink>
              Tradition becomes contemporary when it is experienced together: on stage,
              through inquiry, and in community.
            </p>
          </div>

          <article className={`${styles.movement} ${styles.movementA}`} data-ink>
            <p className={styles.micro}>01 / Live</p>
            <h3>Performance</h3>
            <span className={styles.movementDistance} aria-hidden="true">高遠</span>
            <p className={styles.body}>
              Guzheng performances that move between classical repertoire, contemporary
              collaboration, and cross-cultural fusion.
            </p>
            <a href="#archive" className={styles.strokeLink}>
              Explore all activities <ArrowUpRight size={12} />
            </a>
          </article>

          <article className={`${styles.movement} ${styles.movementB}`} data-ink>
            <p className={styles.micro}>02 / Inquiry</p>
            <h3>Research</h3>
            <span className={styles.movementDistance} aria-hidden="true">深遠</span>
            <p className={styles.body}>
              Practice-led work exploring music, wellbeing, cultural familiarity,
              participation, and the feeling of belonging.
            </p>
            <a href="#research" className={styles.strokeLink}>
              Current research <ArrowUpRight size={12} />
            </a>
          </article>

          <article className={`${styles.movement} ${styles.movementC}`} data-ink>
            <p className={styles.micro}>03 / Together</p>
            <h3>Community</h3>
            <span className={styles.movementDistance} aria-hidden="true">平遠</span>
            <p className={styles.body}>
              Workshops and shared experiences created with schools, universities,
              cultural organisations, and local communities.
            </p>
            <a href="#archive" className={styles.strokeLink}>
              Explore all activities <ArrowUpRight size={12} />
            </a>
          </article>
        </section>

        <div className={`${styles.seam} ${styles.seamRight}`} aria-hidden="true" />

        {/* ---- RESEARCH ------------------------------------------------ */}
        <section id="research" className={`${styles.canvas} ${styles.research}`} data-chapter>
          <span className={`${styles.mistBand} ${styles.mistBandSlow}`} style={{ top: '18%' } as CSSProperties} aria-hidden="true" />

          <div className={styles.researchVisual} data-ink>
            <a
              href={researchReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.researchPoster} ${styles.inkEdge} ${styles.tonalImage}`}
              aria-label="Read the Sonic Belonging project report (opens in a new tab)"
            >
              <Image
                src="/images/research/sonic-belonging-poster.png"
                alt="Sonic Belonging project report poster"
                fill
                sizes="(max-width: 860px) 74vw, 28vw"
                loading="lazy"
              />
              <span className={styles.researchPosterCue}>
                Read report <ArrowUpRight size={11} />
              </span>
            </a>
            <p className={styles.micro} style={{ marginTop: '1rem' }}>Field report · 2026</p>
          </div>

          <div className={styles.researchCopy}>
            <SectionIndex n="03" label="Featured research" />
            <h2 className={`${styles.displayL} ${styles.researchTitle}`} data-ink>
              Sonic <em>Belonging</em>
            </h2>
            <p className={styles.lead} data-ink>
              Co-designing community music spaces for wellbeing and social inclusion.
            </p>
            <p className={styles.body} data-ink>
              Supported by the Healthy Buildings Network at the University of Leeds, the
              project brought Chinese and Indian music, dance, cultural participation, and
              shared reflection into university and community spaces.
            </p>
            <p className={styles.body} data-ink>
              Across three workshops, it asked how atmosphere, accessibility, cultural
              familiarity, and opportunities for participation can make shared environments
              feel more welcoming and socially connected.
            </p>

            <div className={styles.researchThemes} data-ink>
              <span>01<strong>Sound</strong></span>
              <span>02<strong>Place</strong></span>
              <span>03<strong>Belonging</strong></span>
            </div>

            <a
              href={researchReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.strokeLink}
              data-ink
            >
              Read the project report <ArrowUpRight size={12} />
            </a>
          </div>
        </section>

        <div className={styles.seam} aria-hidden="true" />

        {/* ---- ARCHIVE -------------------------------------------------- */}
        {/* No cards. A photograph, a hairline, the words — set at three
            different heights so a row never reads as a row. */}
        <section id="archive" className={`${styles.canvas} ${styles.archive} ${styles.tinted}`} data-chapter>
          <div className={styles.archiveHead}>
            <SectionIndex n="04" label="Activity archive" />
            <h2 className={styles.displayL} data-ink style={{ marginTop: '1.4rem' }}>
              Rooms remembered, <em>in sound and colour.</em>
            </h2>
            <p className={styles.lead} data-ink>
              A travelling memoir of performances, workshops, collaborations, and the
              people encountered along the way.
            </p>
          </div>

          <div className={styles.archiveCount} data-ink>
            <p className={styles.micro}>{engagementArchive.length} engagements</p>
            <p className={styles.annotation}>February 2024 — June 2026</p>
          </div>

          <div className={styles.archiveGrid}>{preview.map(renderArchiveItem)}</div>

          <details className={styles.archiveMore}>
            <summary>
              View the complete memoir · {engagementArchive.length}
            </summary>
            <div className={`${styles.archiveGrid} ${styles.archiveMoreGrid}`}>
              {remaining.map((item, i) => renderArchiveItem(item, i + preview.length))}
            </div>
          </details>

          <div className={styles.archiveFooter}>
            <p className={styles.micro}>Performance · Workshops · Community</p>
            <p className={styles.micro}>Photographs return to colour when looked at</p>
          </div>
        </section>

        <div className={`${styles.seam} ${styles.seamRight}`} aria-hidden="true" />

        {/* ---- VIDEOS --------------------------------------------------- */}
        <section id="videos" className={`${styles.canvas} ${styles.videos}`} data-chapter>
          <div className={styles.videosHead}>
            <SectionIndex n="05" label="Performance videos" />
            <h2 className={styles.displayL} data-ink style={{ marginTop: '1.4rem' }}>
              Watch the music <em>in motion.</em>
            </h2>
            <p className={styles.lead} data-ink>
              A performance-led collection of solo work, ensembles, and cross-cultural
              collaborations — separate from broadcast and press coverage.
            </p>
          </div>

          <div className={styles.videoGrid}>
            {featured.map((video, i) => renderVideo(video, i, i === 0))}
          </div>

          <details className={styles.archiveMore} style={{ gridColumn: '3 / span 9' }}>
            <summary>View the complete collection · {performanceVideos.length}</summary>
            <div className={`${styles.videoGrid} ${styles.archiveMoreGrid}`}>
              {rest.map((video, i) => renderVideo(video, i + featured.length))}
            </div>
          </details>
        </section>

        <div className={styles.seam} aria-hidden="true" />

        {/* ---- PRESS ---------------------------------------------------- */}
        <section id="press" className={`${styles.canvas} ${styles.press} ${styles.tinted}`} data-chapter>
          <div className={styles.pressHead}>
            <SectionIndex n="06" label="Coverage" />
            <h2 className={styles.displayL} data-ink style={{ marginTop: '1.4rem' }}>
              Covered by international media, and by
              <em> the institutions I work alongside.</em>
            </h2>
          </div>

          <div className={styles.pressTabs} role="tablist" aria-label="Media coverage" data-ink>
            {pressItems.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`ink-press-tab-${item.id}`}
                aria-selected={activePressId === item.id}
                aria-controls={`ink-press-panel-${item.id}`}
                tabIndex={activePressId === item.id ? 0 : -1}
                className={`${styles.pressTab} ${activePressId === item.id ? styles.pressTabActive : ''}`}
                onClick={() => {
                  setActivePressId(item.id)
                  setPressVideoId(null)
                }}
                onKeyDown={(event) => {
                  const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
                  const back = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                  if (!forward && !back) return
                  event.preventDefault()
                  const i = pressItems.findIndex((p) => p.id === item.id)
                  const next = pressItems[
                    forward
                      ? (i + 1) % pressItems.length
                      : (i - 1 + pressItems.length) % pressItems.length
                  ]
                  setActivePressId(next.id)
                  setPressVideoId(null)
                  window.requestAnimationFrame(() =>
                    document.getElementById(`ink-press-tab-${next.id}`)?.focus(),
                  )
                }}
              >
                <strong>{item.name}</strong>
                <small>{pressNotes[item.name].note}</small>
              </button>
            ))}
          </div>

          <div
            className={styles.pressPanel}
            role="tabpanel"
            id={`ink-press-panel-${activePress.id}`}
            aria-labelledby={`ink-press-tab-${activePress.id}`}
            data-ink
          >
            {activePress.videoUrl ? (
              <button
                type="button"
                className={`${styles.pressVisual} ${styles.inkEdge} ${styles.tonalImage}`}
                onClick={() => setPressVideoId(activePress.id)}
                aria-label={`Play ${activePress.name} coverage video`}
              >
                <Image
                  src={activePress.posterUrl || activePress.screenshotUrl || ''}
                  alt={`${activePress.name} coverage preview`}
                  fill
                  sizes="(max-width: 860px) 92vw, 46vw"
                />
                <span className={styles.pressPlay} aria-hidden="true">
                  <Play size={15} fill="currentColor" />
                </span>
              </button>
            ) : (
              <a
                href={activePress.link ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.pressVisual} ${styles.inkEdge} ${styles.tonalImage}`}
                aria-label={`${activePress.linkLabel ?? `Read the ${activePress.name} coverage`} (opens in a new tab)`}
              >
                <Image
                  src={activePress.featureImageUrl || activePress.posterUrl || activePress.screenshotUrl || ''}
                  alt={activePress.featureImageAlt ?? `${activePress.name} coverage preview`}
                  fill
                  sizes="(max-width: 860px) 92vw, 46vw"
                />
              </a>
            )}

            <div className={styles.pressCopy}>
              <p className={styles.micro}>{pressNotes[activePress.name].eyebrow}</p>
              <p className={styles.body}>{pressNotes[activePress.name].description}</p>
              {activePress.link ? (
                <a
                  href={activePress.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.strokeLink}
                >
                  {activePress.linkLabel ?? 'Read the coverage'} <ArrowUpRight size={12} />
                </a>
              ) : (
                <p className={styles.pressUnavailable}>Broadcast only — no online article</p>
              )}
            </div>
          </div>
        </section>

        <div className={`${styles.seam} ${styles.seamRight}`} aria-hidden="true" />

        {/* ---- CONTACT -------------------------------------------------- */}
        {/* The scroll ends in empty silk. */}
        <section id="contact" className={`${styles.canvas} ${styles.contact}`} data-chapter>
          <div className={styles.contactMain}>
            <SectionIndex n="07" label="Contact" />
            <h2 className={styles.displayL} data-ink>
              Let’s make <em>a place to meet.</em>
            </h2>
            <a href="mailto:zhanglijun109@gmail.com" className={styles.email} data-ink>
              <Mail size={20} aria-hidden="true" />
              zhanglijun109@gmail.com
            </a>
            <div className={styles.contactDetails} data-ink>
              <span><MapPin size={14} aria-hidden="true" /> Leeds, United Kingdom</span>
              <span><CalendarDays size={14} aria-hidden="true" /> Available for selected projects</span>
            </div>
            <div className={styles.contactSocial} data-ink>
              <a
                href="https://www.instagram.com/miolijun999/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.strokeLink}
              >
                Instagram <ArrowUpRight size={12} />
              </a>
              <a
                href="https://www.youtube.com/@lijun6"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.strokeLink}
              >
                YouTube <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          <div className={styles.contactAside}>
            <p className={styles.micro} data-ink>Or scan</p>
            <div className={styles.qrList} data-ink>
              {socialLinks.map((social) => (
                <button
                  key={social.id}
                  type="button"
                  className={styles.qrItem}
                  onClick={() => setQrId(social.id)}
                  aria-haspopup="dialog"
                >
                  <span className={styles.qrThumb}>
                    <Image src={social.qrCode} alt="" width={52} height={52} />
                  </span>
                  <span className={styles.qrLabel}>
                    <strong>{social.name}</strong>
                    <small>Tap to enlarge</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <a href="#home" className={styles.footerIdentity}>
          <span className={styles.seal} aria-hidden="true">張</span>
          <span className={styles.identityName}>LIJUN ZHANG</span>
        </a>
        <p className={styles.micro}>Artist · Researcher · Cultural Connector</p>
        <a href="#home" className={styles.micro}>Back to top</a>
      </footer>

      {/* ---- OVERLAYS ---------------------------------------------------- */}

      {engagement && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="ink-memory-title">
          <button
            type="button"
            className={styles.modalFog}
            onClick={() => setEngagement(null)}
            aria-label="Close"
          />
          <div className={styles.modalPanel}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setEngagement(null)}
              aria-label="Close"
              autoFocus
            >
              <X size={17} />
            </button>
            <div className={styles.modalImage}>
              <Image
                src={engagement.images[0]}
                alt={engagement.event}
                fill
                sizes="(max-width: 860px) 92vw, 56vw"
              />
            </div>
            <div className={styles.modalCopy}>
              <p className={styles.micro}>
                {formatDate(engagement.date)} · {engagement.tags.join(' · ')}
              </p>
              <h3 className={styles.displayM} id="ink-memory-title">{engagement.event}</h3>
              <p className={styles.body}>{describeEngagement(engagement.tags)}</p>
              <p className={styles.annotation}>{engagement.venue}</p>
              {engagement.link && (
                <a
                  href={engagement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.strokeLink}
                >
                  Read the full event <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {activePressVideo && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${activePressVideo.name} coverage`}>
          <button
            type="button"
            className={styles.modalFog}
            onClick={() => setPressVideoId(null)}
            aria-label="Close video"
          />
          <div className={`${styles.modalPanel} ${styles.modalVideo}`}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setPressVideoId(null)}
              aria-label="Close video"
              autoFocus
            >
              <X size={17} />
            </button>
            <video
              autoPlay
              controls
              playsInline
              poster={activePressVideo.posterUrl || activePressVideo.screenshotUrl}
            >
              <source src={activePressVideo.videoUrl || undefined} />
            </video>
          </div>
        </div>
      )}

      {activeQr && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="ink-qr-title">
          <button
            type="button"
            className={styles.modalFog}
            onClick={() => setQrId(null)}
            aria-label="Close"
          />
          <div className={`${styles.modalPanel} ${styles.modalPanelNarrow}`}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setQrId(null)}
              aria-label="Close"
              autoFocus
            >
              <X size={17} />
            </button>
            <p className={styles.micro} id="ink-qr-title">{activeQr.name}</p>
            <Image src={activeQr.qrCode} alt={`${activeQr.name} QR code`} width={420} height={420} />
            <p className={styles.annotation}>Scan with your phone camera</p>
          </div>
        </div>
      )}
    </div>
  )
}
