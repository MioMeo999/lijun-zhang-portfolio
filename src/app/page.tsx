'use client'

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Image from 'next/image'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  createLucideIcon,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Music2,
  Play,
  Users,
  X,
} from 'lucide-react'
import {
  performanceVideos,
  pressItems,
} from '@/data/portfolioMedia'
import { engagementArchive } from '@/data/portfolioEngagements'
import styles from './page.module.css'
import { ArchiveMemoirModal, type ArchiveMemoirModalHandle } from './ArchiveMemoirModal'
import { PressVideoModal, type PressVideoModalHandle } from './PressVideoModal'
import { ContactQrCodes } from './ContactQrCodes'
import {
  formatEngagementDate,
  preloadMemoirImage,
  wideArchiveImages,
} from './archiveShared'
import { readDurationMs } from './motionUtils'
import { lockPageScroll } from './pageScrollLock'
import { useSiteMotion } from './useSiteMotion'

const Instagram = createLucideIcon('Instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: 'instagram-frame' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: 'instagram-lens' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'instagram-dot' }],
])

const Youtube = createLucideIcon('Youtube', [
  ['path', { d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17', key: 'youtube-frame' }],
  ['path', { d: 'm10 15 5-3-5-3z', key: 'youtube-play' }],
])

const socialProfiles = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/miolijun999/',
    icon: Instagram,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@lijun6',
    icon: Youtube,
  },
]

const researchReportUrl =
  'https://www.healthybuildingsnetwork.org/blog/sonic-belonging.html'

const navItems = [
  { href: '#story', label: 'About' },
  { href: '#practice', label: 'Approach' },
  { href: '#research', label: 'Research' },
  { href: '#archive', label: 'Engagements' },
  { href: '#videos', label: 'Watch' },
  { href: '#media', label: 'Press' },
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
    note: 'Overseas edition · August 2025',
  },
  CGTN: {
    eyebrow: 'CGTN Europe · October 2025',
    description:
      'A Mid-Autumn feature exploring Chinese cultural celebration, music, and friendship between communities in Manchester.',
    note: 'Mid-Autumn feature · October 2025',
  },
}

const pressLogoStyle = (width: number): CSSProperties & { '--press-logo-width': string } => ({
  '--press-logo-width': `${width}px`,
})

const portraitArchiveImages = new Set([
  '/images/timeline/discover-guzheng-performance-2026.jpg',
  '/images/timeline/wu-fest-acoustic-2025.jpg',
  '/images/timeline/harrogate-grammar-school-2025.jpg',
  '/images/timeline/york-resident-festival-2026.jpg',
  '/images/timeline/world-unite-acoustic-2025.jpg',
  '/images/timeline/sonic-belonging-2026.jpg',
  '/images/timeline/silk-road-workshop-2026.jpg',
])

const tallArchiveImages = new Set([
  '/images/timeline/wu-fest-acoustic-2025.jpg',
])

const archiveAnchorIds = new Set([
  'dragon-boat-festival-2026',
  'summer-celebration-2026',
  'sonic-belonging-2026',
  '6',
  '8',
  '12',
])

const archiveFeatureIds = new Set([
  '19',
  '2',
  '9',
  '11',
  '13',
  '18',
])

const archiveMobileWideIds = new Set([
  'dragon-boat-festival-2026',
  '6',
  '8',
  '12',
  '18',
])

const archiveImagePositions: Record<string, string> = {
  'dragon-boat-festival-2026': 'center 44%',
  'summer-celebration-2026': 'center 46%',
  'sonic-belonging-2026': 'center 30%',
  '19': 'center 30%',
  '6': 'center 42%',
  '8': 'center 42%',
  '9': 'center 30%',
  '12': 'center 44%',
  '13': 'center 28%',
}

function ModernImage({
  src,
  alt,
  className = '',
  sizes,
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  sizes: string
  priority?: boolean
}) {
  return (
    <div className={`${styles.modernImage} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        {...(priority ? { priority: true } : { loading: 'eager' as const })}
      />
      <span className={styles.imageSignal} aria-hidden="true" />
    </div>
  )
}

export default function InkResonancePage() {
  const siteRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<HTMLSpanElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)
  const menuTimerRef = useRef<number | undefined>(undefined)
  const memoirModalRef = useRef<ArchiveMemoirModalHandle>(null)
  const pressVideoModalRef = useRef<PressVideoModalHandle>(null)
  // The menu stays mounted while it leaves so its exit can play.
  const [menuState, setMenuState] = useState<'closed' | 'open' | 'closing'>('closed')
  const [activeSection, setActiveSection] = useState('story')
  const [activePressId, setActivePressId] = useState(pressItems[0].id)

  const menuOpen = menuState === 'open'
  const featuredVideos = performanceVideos.filter((video) => video.featured)
  const additionalVideos = performanceVideos.filter((video) => !video.featured)
  const sortedEngagements = [...engagementArchive].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const archivePreviewItems = sortedEngagements.slice(0, 9)
  const archiveRemainingItems = sortedEngagements.slice(9)

  const openMemoir = useCallback(
    (item: (typeof engagementArchive)[number], card: HTMLElement | null, trigger?: HTMLElement | null) => {
      // The card's thumbnail is already on screen; the dialog shows it until its own photo arrives.
      const thumbSrc = card?.querySelector('img')?.currentSrc ?? ''
      const focusTarget = trigger ?? card?.querySelector<HTMLElement>('button') ?? null
      memoirModalRef.current?.open(item, focusTarget, thumbSrc)
    },
    [],
  )

  const closeMenu = useCallback(() => {
    setMenuState((state) => (state === 'open' ? 'closing' : state))
  }, [])

  const toggleMenu = () => {
    if (menuState === 'open') closeMenu()
    else {
      window.clearTimeout(menuTimerRef.current)
      setMenuState('open')
    }
  }

  const renderArchiveMemoirCard = (
    item: (typeof engagementArchive)[number],
    index: number,
  ) => {
    const isPortrait = portraitArchiveImages.has(item.images[0])
    const isWide = wideArchiveImages.has(item.images[0])
    const isTall = tallArchiveImages.has(item.images[0])
    const warmModalPhoto = () => preloadMemoirImage(item.images[0])

    return (
      <article
        className={[
          styles.archiveMemoirCard,
          isPortrait ? styles.archiveMemoirCardPortrait : '',
          isWide ? styles.archiveMemoirCardWide : '',
          isTall ? styles.archiveMemoirCardTall : '',
          archiveAnchorIds.has(item.id) ? styles.archiveMemoirCardAnchor : '',
          archiveFeatureIds.has(item.id) ? styles.archiveMemoirCardFeature : '',
          archiveMobileWideIds.has(item.id) ? styles.archiveMemoirCardMobileWide : '',
        ].filter(Boolean).join(' ')}
        key={item.id}
        data-reveal="visual"
        onPointerEnter={warmModalPhoto}
        onPointerDown={warmModalPhoto}
        onFocus={warmModalPhoto}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('button')) return
          openMemoir(item, event.currentTarget)
        }}
      >
        <span className={styles.archiveMemoirPin} aria-hidden="true" />
        <button
          type="button"
          className={styles.archiveMemoirPhoto}
          aria-label={`Open details for ${item.event}`}
          onClick={(event) => {
            openMemoir(item, event.currentTarget.closest('article'), event.currentTarget)
          }}
        >
          <Image
            src={item.images[0]}
            alt={item.imageAlt ?? item.event}
            fill
            sizes="(max-width: 560px) 88vw, (max-width: 800px) 48vw, (max-width: 1050px) 42vw, 31vw"
            loading={index < 2 ? 'eager' : 'lazy'}
            style={{ objectPosition: archiveImagePositions[item.id] ?? 'center' }}
          />
          <span className={styles.archiveReportCue}>
            Open details <ArrowUpRight size={12} />
          </span>
        </button>
        <button
          type="button"
          className={styles.archiveMemoirCaption}
          onClick={(event) => {
            openMemoir(item, event.currentTarget.closest('article'), event.currentTarget)
          }}
          aria-label={`Open details for ${item.event}`}
        >
          <span className={styles.archiveMemoirMeta}>
            <time dateTime={item.date}>{formatEngagementDate(item.date)}</time>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          </span>
          <span className={styles.archiveMemoirType}>{item.tags.join(' · ')}</span>
          <strong>{item.event}</strong>
          <span className={styles.archiveMemoirLocation}>
            <MapPin size={12} />{item.venue}
          </span>
        </button>
      </article>
    )
  }

  useSiteMotion(siteRef, scrollProgressRef)

  // Lock the page for as long as the menu is on screen (including its exit), and
  // let Escape dismiss it.
  useEffect(() => {
    if (menuState === 'closed') return

    const unlock = lockPageScroll()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      unlock()
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [closeMenu, menuState])

  // The menu is removed once its exit has played (or at once for reduced motion).
  useEffect(() => {
    if (menuState !== 'closing') return

    const exitMs = mobileNavRef.current
      ? readDurationMs(
          window.getComputedStyle(mobileNavRef.current).getPropertyValue('--menu-exit'),
          220,
        )
      : 220
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    menuTimerRef.current = window.setTimeout(
      () => setMenuState('closed'),
      reducedMotion ? 0 : exitMs + 30,
    )

    return () => window.clearTimeout(menuTimerRef.current)
  }, [menuState])

  useEffect(() => {
    const root = siteRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const navigableSections = navItems
      .map((item) => root.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section))

    const navigationObserver = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (activeEntry?.target.id) setActiveSection(activeEntry.target.id)
      },
      { threshold: [0, 0.15, 0.35], rootMargin: '-28% 0px -56% 0px' },
    )

    navigableSections.forEach((section) => navigationObserver.observe(section))

    return () => navigationObserver.disconnect()
  }, [])

  useEffect(() => {
    const root = siteRef.current
    if (!root || !('ResizeObserver' in window)) return

    const grids = Array.from(
      root.querySelectorAll<HTMLElement>(`.${styles.archiveMemoirGrid}`),
    )
    const cards = grids.flatMap((grid) =>
      Array.from(grid.querySelectorAll<HTMLElement>(`.${styles.archiveMemoirCard}`)),
    )
    let layoutFrame: number | null = null

    const balanceArchiveRows = () => {
      grids.forEach((grid) => {
        const gridStyles = window.getComputedStyle(grid)
        const rowHeight = Number.parseFloat(gridStyles.gridAutoRows)
        const rowGap = Number.parseFloat(gridStyles.rowGap)

        if (!rowHeight || Number.isNaN(rowGap)) return

        grid.querySelectorAll<HTMLElement>(`.${styles.archiveMemoirCard}`).forEach((card) => {
          if (!card.offsetParent) return

          const cardStyles = window.getComputedStyle(card)
          const tilt = Math.abs(
            Number.parseFloat(cardStyles.getPropertyValue('--memoir-tilt')) || 0,
          )
          const lift = Math.abs(
            Number.parseFloat(cardStyles.getPropertyValue('--memoir-lift')) || 0,
          )
          const rotatedEdge = Math.sin((tilt * Math.PI) / 180) * card.offsetWidth
          const breathingRoom = window.innerWidth <= 700 ? 14 : 24
          const visualHeight = card.offsetHeight + lift + rotatedEdge + breathingRoom
          const rowSpan = Math.ceil((visualHeight + rowGap) / (rowHeight + rowGap))

          card.style.gridRowStart = `span ${rowSpan}`
          card.style.gridRowEnd = 'auto'
        })
      })
    }

    const scheduleArchiveBalance = () => {
      if (layoutFrame !== null) window.cancelAnimationFrame(layoutFrame)
      layoutFrame = window.requestAnimationFrame(() => {
        layoutFrame = null
        balanceArchiveRows()
      })
    }

    const cardObserver = new ResizeObserver(scheduleArchiveBalance)
    cards.forEach((card) => cardObserver.observe(card))
    root.querySelectorAll<HTMLDetailsElement>(`.${styles.archiveMore}`).forEach((details) => {
      details.addEventListener('toggle', scheduleArchiveBalance)
    })
    window.addEventListener('resize', scheduleArchiveBalance)
    document.fonts.ready.then(scheduleArchiveBalance)
    scheduleArchiveBalance()

    return () => {
      if (layoutFrame !== null) window.cancelAnimationFrame(layoutFrame)
      cardObserver.disconnect()
      root.querySelectorAll<HTMLDetailsElement>(`.${styles.archiveMore}`).forEach((details) => {
        details.removeEventListener('toggle', scheduleArchiveBalance)
      })
      window.removeEventListener('resize', scheduleArchiveBalance)
    }
  }, [])

  return (
    <div className={styles.site} ref={siteRef}>
      <span className={styles.scrollProgress} aria-hidden="true">
        <span ref={scrollProgressRef} />
      </span>
      <header className={styles.header}>
        <a href="#home" className={styles.identity} aria-label="Lijun Zhang, home">
          <span className={styles.brandDot} aria-hidden="true" />
          <strong>LIJUN ZHANG</strong>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              href={item.href}
              className={activeSection === item.href.slice(1) ? styles.navActive : undefined}
              aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={styles.headerCta}>
          Collaborate <ArrowUpRight size={15} />
        </a>

        <button
          type="button"
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuState !== 'closed' && (
          <nav
            id="mobile-navigation"
            ref={mobileNavRef}
            className={`${styles.mobileNav} ${menuState === 'closing' ? styles.mobileNavClosing : ''}`}
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <a
                href={item.href}
                className={activeSection === item.href.slice(1) ? styles.navActive : undefined}
                aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section id="home" className={styles.hero}>
          <div className={styles.heroIndex}>
            <span>PORTFOLIO · 2026</span>
            <span>LISTEN · MEET · RESONATE</span>
          </div>

          <div className={styles.heroWords}>
            <h1>
              <span className={styles.heroName}>Lijun Zhang</span>
              <span className={styles.heroInstrument}>GUZHENG</span>
            </h1>
            <div className={styles.heroTagline}>
              <span>Performing across Britain.</span>
              <span>Researching how music makes belonging.</span>
            </div>
            <div className={styles.heroStatement}>
              <span aria-hidden="true" />
              <div>
                <strong>ARTIST · RESEARCHER · CULTURAL CONNECTOR</strong>
                <p>Guzheng artist · PhD candidate, University of Leeds</p>
              </div>
            </div>
            <div className={styles.heroActions}>
              <a href="#archive">Twenty-six rooms</a>
              <a href="#videos"><Play size={11} fill="currentColor" /> Listen</a>
            </div>
          </div>

          <div className={styles.heroPortraitFrame} data-scroll-media data-scroll-strength="18">
            <ModernImage
              src="/images/about-portrait.jpg"
              alt="Lijun Zhang playing the Guzheng"
              className={styles.heroPortrait}
              sizes="(max-width: 800px) 82vw, 34vw"
              priority
            />
            <span>Portrait / 01</span>
          </div>

          <div className={styles.heroSideNote} aria-hidden="true">
            <span />
            <span>Portfolio · 2026 — Listen · Meet · Resonate</span>
          </div>

          <a href="#story" className={styles.scrollCue}>Explore <ArrowDown size={16} /></a>
        </section>

        <div className={styles.affiliations} aria-label="Selected media and institutional associations">
          <span>Featured by</span>
          <a href="#media">CCTV</a>
          <a href="#media">People&apos;s Daily</a>
          <a href="#media">CGTN</a>
          <a href="#research">University of Leeds</a>
          <a href="#archive">Business Confucius Institute</a>
          <a href="#research">Healthy Buildings Network</a>
        </div>

        <section id="story" className={styles.story} data-chapter>
          <div
            className={styles.storyBackdrop}
            aria-hidden="true"
            data-reveal="visual"
            data-scroll-media
            data-scroll-strength="22"
          >
            <Image
              src="/images/bg-home.jpg"
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
            />
          </div>
          <div className={styles.sectionMarker} data-reveal="marker">
            <span>01</span>
            <p>POSITION / STORY</p>
          </div>
          <div className={styles.storyHeadline} data-reveal="heading">
            <span data-reveal-line>My practice</span>
            <h2 data-reveal-line>Music is not an object to preserve.</h2>
            <h2 data-reveal-line><em>It is a place to meet.</em></h2>
          </div>
          <div className={styles.storyBody} data-reveal="copy">
            <p>
              Lijun Zhang is a musician and cultural connector based in the
              United Kingdom. Through the Guzheng, he creates opportunities for
              people from different backgrounds to meet, learn, and connect
              through shared musical experiences.
            </p>
            <p>
              Alongside his artistic practice, Lijun is pursuing a PhD at the
              University of Leeds. His work moves between performance,
              education, community engagement, artistic collaboration, and
              research into belonging and inclusive shared space.
            </p>
            <div className={styles.storyMeta}>
              <span><MapPin size={15} /> Leeds, UK</span>
              <span><GraduationCap size={15} /> University of Leeds</span>
              <span><Music2 size={15} /> Guzheng</span>
            </div>
          </div>
        </section>

        <section id="practice" className={styles.practice} data-chapter>
          <div className={styles.practiceIntro}>
            <div className={styles.sectionMarkerLight} data-reveal="marker">
              <span>02</span>
              <p>ARTISTIC PRACTICE</p>
            </div>
            <h2 data-reveal="heading">
              <span data-reveal-line>One practice.</span>
              <em data-reveal-line>Three movements.</em>
            </h2>
            <p data-reveal="copy">
              Tradition becomes contemporary when it is experienced together:
              on stage, through inquiry, and in community.
            </p>
          </div>

          <div className={styles.practiceGrid}>
            <article data-reveal="visual">
              <span className={styles.practiceNumber}>01 / LIVE</span>
              <Music2 size={30} />
              <h3>Performance</h3>
              <p>
                Guzheng performances that move between classical repertoire,
                contemporary collaboration, and cross-cultural fusion.
              </p>
              <a href="#archive">Explore all activities <ArrowUpRight size={15} /></a>
            </article>
            <article data-reveal="visual">
              <span className={styles.practiceNumber}>02 / INQUIRY</span>
              <BookOpen size={30} />
              <h3>Research</h3>
              <p>
                Practice-led work exploring music, wellbeing, cultural
                familiarity, participation, and the feeling of belonging.
              </p>
              <a href="#research">Current research <ArrowUpRight size={15} /></a>
            </article>
            <article data-reveal="visual">
              <span className={styles.practiceNumber}>03 / TOGETHER</span>
              <Users size={30} />
              <h3>Community</h3>
              <p>
                Workshops and shared experiences created with schools,
                universities, cultural organisations, and local communities.
              </p>
              <a href="#archive">Explore all activities <ArrowUpRight size={15} /></a>
            </article>
          </div>
        </section>

        <section id="research" className={styles.research} data-chapter>
          <div
            className={styles.researchPoster}
            data-reveal="visual"
            data-scroll-media
            data-scroll-strength="12"
          >
            <a
              href={researchReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read the Sonic Belonging project report (opens in a new tab)"
            >
              <Image
                src="/images/research/sonic-belonging-poster.png"
                alt="Sonic Belonging project report poster"
                fill
                sizes="(max-width: 800px) 75vw, 27vw"
                loading="lazy"
              />
              <span className={styles.researchPosterAction}>
                Read report <ArrowUpRight size={13} />
              </span>
            </a>
            <span>Field report · 2026</span>
          </div>

          <div className={styles.researchCopy}>
            <div className={styles.researchLabel} data-reveal="marker">
              <span>03</span>
              <p>FEATURED RESEARCH</p>
            </div>
            <h2 data-reveal="heading">
              <span data-reveal-line>Sonic</span>
              <em data-reveal-line>Belonging</em>
            </h2>
            <h3 data-reveal="copy">Co-designing community music spaces for wellbeing and social inclusion.</h3>
            <p data-reveal="copy">
              Supported by the Healthy Buildings Network at the University of
              Leeds, the project brought Chinese and Indian music, dance,
              cultural participation, and shared reflection into university and
              community spaces.
            </p>
            <p data-reveal="copy">
              Across three workshops, it asked how atmosphere, accessibility,
              cultural familiarity, and opportunities for participation can
              make shared environments feel more welcoming and socially
              connected.
            </p>
            <a
              data-reveal="copy"
              href={researchReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read the Sonic Belonging project report (opens in a new tab)"
            >
              Read the project report <ArrowUpRight size={17} />
            </a>
          </div>

          <div className={styles.researchDiagram} aria-label="Three themes: sound, place, belonging" data-reveal="visual">
            <span>01<small>Sound</small></span>
            <span>02<small>Place</small></span>
            <span>03<small>Belonging</small></span>
          </div>
        </section>

        <section id="archive" className={styles.archive} data-chapter>
          <div className={styles.archiveHead}>
            <div className={styles.sectionMarker} data-reveal="marker">
              <span>04</span>
              <p>ACTIVITY ARCHIVE</p>
            </div>
            <h2 data-reveal="heading">
              <span data-reveal-line>Rooms remembered,</span>
              <em data-reveal-line>in sound and colour.</em>
            </h2>
            <p data-reveal="copy">
              A travelling memoir of performances, workshops, collaborations,
              and the people encountered along the way.
            </p>
          </div>

          <div className={styles.archiveMemoirGrid} aria-label="Activity archive, newest to oldest">
            {archivePreviewItems.map(renderArchiveMemoirCard)}
          </div>
          <details className={styles.archiveMore}>
            <summary>
              View the complete memoir · {engagementArchive.length}
              <span aria-hidden="true">+</span>
            </summary>
            <div className={`${styles.archiveMemoirGrid} ${styles.archiveMemoirGridMore}`}>
              {archiveRemainingItems.map((item, index) => (
                renderArchiveMemoirCard(item, index + archivePreviewItems.length)
              ))}
            </div>
          </details>
          <div className={styles.archiveFooter}>
            <p className={styles.archiveCount}>
              {engagementArchive.length} engagements · February 2024—September 2026
            </p>
            <p>Performance · Workshops · Community</p>
          </div>
        </section>

        <section id="videos" className={styles.videos} data-chapter>
          <div className={styles.videosHead}>
            <div className={styles.sectionMarkerLight} data-reveal="marker">
              <span>05</span>
              <p>PERFORMANCE VIDEOS</p>
            </div>
            <div data-reveal="heading">
              <span data-reveal-line>Selected by the artist</span>
              <h2>
                <span data-reveal-line>Watch the music</span>
                <em data-reveal-line>in motion.</em>
              </h2>
            </div>
            <p data-reveal="copy">
              A performance-led collection of solo work, ensembles, and
              cross-cultural collaborations—separate from broadcast and press
              coverage.
            </p>
          </div>

          <div className={styles.videoGrid}>
            {featuredVideos.map((video, index) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal="visual"
                className={index === 0 ? styles.videoLead : ''}
                aria-label={`Watch ${video.title} on YouTube (opens in a new tab)`}
              >
                <div className={styles.videoThumb}>
                  <img
                    src={video.thumbnailUrl || `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
                    }}
                  />
                  <span className={styles.videoWash} aria-hidden="true" />
                  <span className={styles.videoPlay}><Play size={18} fill="currentColor" /></span>
                  <span className={styles.videoIndex}>0{index + 1}</span>
                </div>
                <div className={styles.videoInfo}>
                  <span>{video.category}</span>
                  <h3>{video.title}</h3>
                  <small>Watch on YouTube <ArrowUpRight size={13} /></small>
                </div>
              </a>
            ))}
          </div>

          <details className={styles.videoMore}>
            <summary>
              View the complete collection · {performanceVideos.length}
              <span aria-hidden="true">+</span>
            </summary>
            <div className={`${styles.videoGrid} ${styles.videoGridExpanded}`}>
              {additionalVideos.map((video, index) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal="visual"
                  aria-label={`Watch ${video.title} on YouTube (opens in a new tab)`}
                >
                  <div className={styles.videoThumb}>
                    <img
                      src={video.thumbnailUrl || `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
                      }}
                    />
                    <span className={styles.videoPlay}><Play size={18} fill="currentColor" /></span>
                    <span className={styles.videoIndex}>
                      {String(index + featuredVideos.length + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className={styles.videoInfo}>
                    <span>{video.category}</span>
                    <h3>{video.title}</h3>
                    <small>Watch on YouTube <ArrowUpRight size={13} /></small>
                  </div>
                </a>
              ))}
            </div>
          </details>
        </section>

        <section id="media" className={styles.media} data-chapter>
          <div className={`${styles.mediaHead} ${styles.coverageHead}`}>
            <div className={styles.coverageLabel} data-reveal="marker">
              <span aria-hidden="true" />
              <p>COVERAGE</p>
            </div>
            <h2 data-reveal="heading">
              <span data-reveal-line>Covered by international media, and by</span>
              <span data-reveal-line>the institutions I work alongside.</span>
            </h2>
          </div>

          <div className={styles.pressSwitcher} data-reveal="visual">
            {pressItems.map((item) => (
              <input
                className={styles.pressControl}
                type="radio"
                name="press-story"
                id={`press-control-${item.id}`}
                checked={activePressId === item.id}
                tabIndex={-1}
                aria-hidden="true"
                onChange={() => {
                  setActivePressId(item.id)
                }}
                key={`control-${item.id}`}
              />
            ))}
            <div className={styles.pressTabs} role="tablist" aria-label="Media coverage">
              {pressItems.map((item) => (
                <label
                  htmlFor={`press-control-${item.id}`}
                  id={`press-tab-${item.id}`}
                  role="tab"
                  tabIndex={activePressId === item.id ? 0 : -1}
                  aria-selected={activePressId === item.id}
                  aria-controls={`press-${item.id}`}
                  className={activePressId === item.id ? styles.pressTabActive : undefined}
                  style={pressLogoStyle(item.logoWidth ?? 150)}
                  onKeyDown={(event) => {
                    const currentIndex = pressItems.findIndex((pressItem) => pressItem.id === item.id)
                    const isForward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
                    const isBackward = event.key === 'ArrowLeft' || event.key === 'ArrowUp'

                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActivePressId(item.id)
                      return
                    }

                    if (!isForward && !isBackward) return

                    event.preventDefault()
                    const nextIndex = isForward
                      ? (currentIndex + 1) % pressItems.length
                      : (currentIndex - 1 + pressItems.length) % pressItems.length
                    const nextItem = pressItems[nextIndex]
                    setActivePressId(nextItem.id)
                    window.requestAnimationFrame(() => {
                      document.getElementById(`press-tab-${nextItem.id}`)?.focus()
                    })
                  }}
                  key={item.id}
                >
                  <span className={styles.pressLogo}>
                    <Image
                      src={item.logoUrl}
                      alt={`${item.name} logo`}
                      fill
                      sizes="220px"
                    />
                  </span>
                  <strong>{item.name}</strong>
                  <small>{pressNotes[item.name].note}</small>
                </label>
              ))}
            </div>

            <div className={styles.pressPanels}>
              {pressItems.map((item) => (
                <section
                  className={`${styles.pressFeature} ${activePressId === item.id ? styles.pressFeatureActive : ''}`}
                  id={`press-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`press-tab-${item.id}`}
                  aria-hidden={activePressId !== item.id}
                  key={item.id}
                >
                  <div
                    className={[
                      styles.pressFeatureVisual,
                      item.videoUrl
                        ? styles.pressFeatureVideo
                        : item.featureImageUrl
                          ? styles.pressFeaturePhoto
                          : styles.pressFeatureEditorial,
                      item.id === '2' ? styles.pressFeaturePortrait : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {item.featureImageUrl || item.posterUrl || item.screenshotUrl ? (
                      item.videoUrl ? (
                        <button
                          type="button"
                          className={styles.pressVideoTrigger}
                          onClick={(event) => {
                            pressVideoModalRef.current?.open(item, event.currentTarget)
                          }}
                          aria-label={`Play ${item.name} coverage video`}
                        >
                          <Image
                            src={item.featureImageUrl || item.posterUrl || item.screenshotUrl || ''}
                            alt=""
                            aria-hidden="true"
                            fill
                            className={styles.pressVisualBackdrop}
                            sizes="(max-width: 800px) 100vw, 48vw"
                          />
                          <Image
                            src={item.featureImageUrl || item.posterUrl || item.screenshotUrl || ''}
                            alt={item.featureImageAlt ?? `${item.name} coverage preview`}
                            fill
                            className={styles.pressVisualSubject}
                            sizes="(max-width: 800px) 100vw, 48vw"
                          />
                          <span><Play size={18} fill="currentColor" /></span>
                        </button>
                      ) : item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pressEditorialLink}
                          aria-label={`${item.linkLabel ?? `Read the ${item.name} news report`} (opens in a new tab)`}
                        >
                          <Image
                            src={item.featureImageUrl || item.posterUrl || item.screenshotUrl || ''}
                            alt=""
                            aria-hidden="true"
                            fill
                            className={styles.pressVisualBackdrop}
                            sizes="(max-width: 800px) 100vw, 48vw"
                          />
                          <Image
                            src={item.featureImageUrl || item.posterUrl || item.screenshotUrl || ''}
                            alt={item.featureImageAlt ?? `${item.name} coverage preview`}
                            fill
                            className={styles.pressVisualSubject}
                            sizes="(max-width: 800px) 100vw, 48vw"
                          />
                        </a>
                      ) : (
                        <Image
                          src={item.featureImageUrl || item.posterUrl || item.screenshotUrl || ''}
                          alt={item.featureImageAlt ?? `${item.name} coverage preview`}
                          fill
                          className={styles.pressVisualSubject}
                          sizes="(max-width: 800px) 100vw, 48vw"
                        />
                      )
                    ) : null}
                    <span className={styles.pressVisualLabel}>
                      {item.mediaLabel ?? (item.videoUrl ? 'Broadcast film' : 'Print edition')}
                    </span>
                  </div>
                  <div className={styles.pressFeatureCopy}>
                    <span>{pressNotes[item.name].eyebrow}</span>
                    <h3>{item.name}</h3>
                    <p>{pressNotes[item.name].description}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.linkLabel ?? `Read the ${item.name} coverage`} (opens in a new tab)`}
                      >
                        {item.linkLabel ?? 'Read the coverage'} <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <span className={styles.pressUnavailable}>
                        Broadcast only — no online article
                      </span>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>

        </section>

        <section id="contact" className={styles.contact} data-chapter>
          <div className={styles.contactTopline} data-reveal="marker">
            <span>07 / CONTACT</span>
            <span>Performance · Research · Education · Collaboration</span>
          </div>
          <h2 data-reveal="heading">
            <span data-reveal-line>Let&apos;s make</span>
            <em data-reveal-line>a place to meet.</em>
          </h2>
          <a href="mailto:zhanglijun109@gmail.com" className={styles.email} data-reveal="copy">
            <Mail size={24} />
            <span>zhanglijun109@gmail.com</span>
            <ArrowUpRight size={24} />
          </a>

          <div className={styles.contactLower} data-reveal="visual">
            <div className={styles.contactDetails}>
              <span><MapPin size={15} /> Leeds, United Kingdom</span>
              <span><CalendarDays size={15} /> Available for selected projects</span>
              <div className={styles.socialProfiles} aria-label="Social media profiles">
                {socialProfiles.map((profile) => {
                  const SocialIcon = profile.icon
                  return (
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit Lijun Zhang on ${profile.name}`}
                      key={profile.name}
                    >
                      <SocialIcon size={17} />
                      <span>{profile.name}</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )
                })}
              </div>
            </div>
            <ContactQrCodes />
          </div>
        </section>
      </main>

      <ArchiveMemoirModal ref={memoirModalRef} />
      <PressVideoModal ref={pressVideoModalRef} />

      <footer className={styles.footer}>
        <a href="#home" className={styles.footerIdentity}>
          <span className={styles.seal}>LZ</span>
          <strong>LIJUN ZHANG</strong>
        </a>
        <p>Musician · Researcher · Cultural Connector</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  )
}
