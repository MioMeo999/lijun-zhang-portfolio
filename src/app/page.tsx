'use client'

import {
  type CSSProperties,
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

const Instagram = createLucideIcon('Instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: 'instagram-frame' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: 'instagram-lens' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'instagram-dot' }],
])

const Youtube = createLucideIcon('Youtube', [
  ['path', { d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17', key: 'youtube-frame' }],
  ['path', { d: 'm10 15 5-3-5-3z', key: 'youtube-play' }],
])

const socialLinks = [
  {
    id: 'wechat',
    name: 'WeChat',
    qrCode: '/images/social/wechat-qr.png',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    qrCode: '/images/social/instagram-qr.png',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    qrCode: '/images/social/whatsapp-qr.jpg',
  },
]

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

const formatEngagementDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year.slice(2)}`
}

// Kept in step with `--step` in page.module.css. One unit for every stagger on
// the page; the cap stops tall sections trailing on after the eye has moved.
const CASCADE_STEP_MS = 70
const MAX_CASCADE_STEPS = 7

const navItems = [
  { href: '#story', label: 'About' },
  { href: '#practice', label: 'Approach' },
  { href: '#research', label: 'Research' },
  { href: '#archive', label: 'Engagements' },
  { href: '#videos', label: 'Watch' },
  { href: '#media', label: 'Press' },
]

const pressNotes: Record<string, { eyebrow: string; description: string; note: string }> = {
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

const describeEngagement = (tags: string[]) => {
  const hasWorkshop = tags.includes('workshop')
  const hasPerformance = tags.includes('performance')
  const hasCommunity = tags.includes('community')

  if (hasWorkshop && hasPerformance && hasCommunity) {
    return 'Performance, participation and community exchange brought together in one shared cultural programme.'
  }

  if (hasWorkshop && hasPerformance) {
    return 'A participatory encounter moving between live performance, demonstration and shared learning.'
  }

  if (hasPerformance && hasCommunity) {
    return 'A live musical gathering shaped around celebration, cultural connection and a shared audience.'
  }

  if (hasWorkshop && hasCommunity) {
    return 'An open learning space connecting traditional music with conversation, participation and community.'
  }

  if (hasWorkshop) {
    return 'A hands-on session exploring sound, tradition and the social possibilities of making music together.'
  }

  return 'A live guzheng performance presented as part of an evolving, research-led artistic practice.'
}

const portraitArchiveImages = new Set([
  '/images/timeline/wu-fest-acoustic-2025.jpg',
  '/images/timeline/harrogate-grammar-school-2025.jpg',
  '/images/timeline/york-resident-festival-2026.jpg',
  '/images/timeline/world-unite-acoustic-2025.jpg',
  '/images/timeline/sonic-belonging-2026.jpg',
  '/images/timeline/silk-road-workshop-2026.jpg',
])

const wideArchiveImages = new Set([
  '/images/timeline/vision-china-london-2026.jpg',
  '/images/timeline/lihua-school-awards-2024.jpg',
  '/images/timeline/wu-fest-teaser-2025.jpg',
  '/images/timeline/york-spring-gala-2026.jpg',
  '/images/timeline/lccs-summer-fair-2025.jpg',
  '/images/timeline/leeds-chinese-new-year-2026.jpg',
  '/images/timeline/lubs-global-impact-day-2026.jpeg',
  '/images/timeline/dragon-new-year-2024-leeds.jpg',
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
  const memoirCloseRef = useRef<HTMLButtonElement>(null)
  const memoirTriggerRef = useRef<HTMLElement | null>(null)
  const pressVideoCloseRef = useRef<HTMLButtonElement>(null)
  const pressVideoTriggerRef = useRef<HTMLElement | null>(null)
  const qrCloseRef = useRef<HTMLButtonElement>(null)
  const qrTriggerRef = useRef<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedEngagement, setSelectedEngagement] = useState<(typeof engagementArchive)[number] | null>(null)
  const [isMemoirClosing, setIsMemoirClosing] = useState(false)
  const [activeSection, setActiveSection] = useState('story')
  const [activePressId, setActivePressId] = useState(pressItems[0].id)
  const [activePressVideoId, setActivePressVideoId] = useState<string | null>(null)
  const [activeQrId, setActiveQrId] = useState<string | null>(null)

  const featuredVideos = performanceVideos.filter((video) => video.featured)
  const additionalVideos = performanceVideos.filter((video) => !video.featured)
  const activePressVideo = pressItems.find((item) => item.id === activePressVideoId && item.videoUrl)
  const activeQr = socialLinks.find((social) => social.id === activeQrId)
  const sortedEngagements = [...engagementArchive].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const archivePreviewItems = sortedEngagements.slice(0, 9)
  const archiveRemainingItems = sortedEngagements.slice(9)
  const selectedEngagementImageIsWide = selectedEngagement
    ? wideArchiveImages.has(selectedEngagement.images[0])
    : false
  const selectedEngagementResources = selectedEngagement
    ? [
        {
          label: selectedEngagement.linkLabel ?? 'Read the full event',
          href: selectedEngagement.link,
        },
        ...(selectedEngagement.externalResources ?? []),
        ...(selectedEngagement.videoLink
          ? [{ label: 'Watch performance video', href: selectedEngagement.videoLink }]
          : []),
      ]
    : []

  const openMemoir = useCallback((item: (typeof engagementArchive)[number], trigger: HTMLElement | null) => {
    memoirTriggerRef.current = trigger
    setIsMemoirClosing(false)
    setSelectedEngagement(item)
  }, [])

  const closeMemoir = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSelectedEngagement(null)
      return
    }

    setIsMemoirClosing(true)
  }, [])

  const renderArchiveMemoirCard = (
    item: (typeof engagementArchive)[number],
    index: number,
  ) => {
    const isPortrait = portraitArchiveImages.has(item.images[0])
    const isWide = wideArchiveImages.has(item.images[0])
    const isTall = tallArchiveImages.has(item.images[0])
    const cardStyle = {
      '--archive-index': Math.min(index, 8),
    } as CSSProperties

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
        style={cardStyle}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('button')) return
          openMemoir(item, null)
        }}
      >
        <span className={styles.archiveMemoirPin} aria-hidden="true" />
        <button
          type="button"
          className={styles.archiveMemoirPhoto}
          aria-label={`Open details for ${item.event}`}
          onClick={(event) => {
            openMemoir(item, event.currentTarget)
          }}
        >
          <Image
            src={item.images[0]}
            alt={item.event}
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
            openMemoir(item, event.currentTarget)
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

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!selectedEngagement) return

    const trigger = memoirTriggerRef.current
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMemoir()
      }
    }

    document.body.style.overflow = 'hidden'
    memoirCloseRef.current?.focus()
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      if (trigger?.isConnected) {
        window.requestAnimationFrame(() => trigger.focus({ preventScroll: true }))
      }
    }
  }, [closeMemoir, selectedEngagement])

  useEffect(() => {
    if (!activePressVideoId) return

    const trigger = pressVideoTriggerRef.current
    const previousOverflow = document.body.style.overflow
    const closePressVideoOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePressVideoId(null)
    }

    document.body.style.overflow = 'hidden'
    pressVideoCloseRef.current?.focus()
    window.addEventListener('keydown', closePressVideoOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closePressVideoOnEscape)
      if (trigger?.isConnected) {
        window.requestAnimationFrame(() => trigger.focus())
      }
    }
  }, [activePressVideoId])

  useEffect(() => {
    if (!activeQrId) return

    const trigger = qrTriggerRef.current
    const previousOverflow = document.body.style.overflow
    const closeQrOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveQrId(null)
    }

    document.body.style.overflow = 'hidden'
    qrCloseRef.current?.focus()
    window.addEventListener('keydown', closeQrOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeQrOnEscape)
      if (trigger?.isConnected) {
        window.requestAnimationFrame(() => trigger.focus())
      }
    }
  }, [activeQrId])

  useEffect(() => {
    const root = siteRef.current
    if (!root) return

    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // One cascade per chapter, in document order, so a heading's lines and the
    // copy beneath them sit on the same rhythm instead of running two
    // overlapping ones. The heading element itself is only a wrapper — its
    // lines take its place in the sequence.
    chapters.forEach((chapter) => {
      let step = 0

      chapter
        .querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-line]')
        .forEach((element) => {
          if (element.matches("[data-reveal='heading']")) return
          element.style.setProperty(
            '--enter-delay',
            `${Math.min(step, MAX_CASCADE_STEPS) * CASCADE_STEP_MS}ms`,
          )
          step += 1
        })
    })

    // Commit the hidden state with transitions switched off, then release them
    // on the next frame so nothing animates on the way *into* hiding.
    root.classList.add(styles.motionBoot, styles.motionReady)
    void root.offsetWidth
    let revealFrame = 0
    const bootFrame = window.requestAnimationFrame(() => {
      root.classList.remove(styles.motionBoot)
    })

    const revealHashChapter = () => {
      const hash = window.location.hash.slice(1)
      chapters.find((chapter) => chapter.id === hash)?.classList.add(styles.chapterVisible)
    }

    revealHashChapter()
    window.addEventListener('hashchange', revealHashChapter)

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // Wait for the frame after the boot class is dropped, otherwise the
      // reveal coalesces with it and the gentle fade is skipped entirely.
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = window.requestAnimationFrame(() => {
          chapters.forEach((chapter) => chapter.classList.add(styles.chapterVisible))
        })
      })

      return () => {
        window.cancelAnimationFrame(bootFrame)
        window.cancelAnimationFrame(revealFrame)
        window.removeEventListener('hashchange', revealHashChapter)
      }
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add(styles.chapterVisible)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
    )

    chapters.forEach((chapter) => revealObserver.observe(chapter))

    return () => {
      window.cancelAnimationFrame(bootFrame)
      window.cancelAnimationFrame(revealFrame)
      revealObserver.disconnect()
      window.removeEventListener('hashchange', revealHashChapter)
    }
  }, [])

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
    if (!root) return

    let scrollAnimationFrame: number | null = null
    let previousInlineScrollBehavior = ''

    const stopScrollAnimation = () => {
      if (scrollAnimationFrame === null) return
      window.cancelAnimationFrame(scrollAnimationFrame)
      scrollAnimationFrame = null
      document.documentElement.style.scrollBehavior = previousInlineScrollBehavior
    }

    const handleInternalNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) return

      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor || !root.contains(anchor)) return

      const targetId = anchor.hash.slice(1)
      if (!targetId || targetId.startsWith('qr-')) return

      const target = document.getElementById(targetId)
      if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      event.preventDefault()
      stopScrollAnimation()

      const startY = window.scrollY
      const headerHeight = root.querySelector('header')?.getBoundingClientRect().height ?? 0
      const targetY = Math.max(0, target.getBoundingClientRect().top + startY - headerHeight - 14)
      const distance = targetY - startY
      const duration = Math.min(960, Math.max(620, 560 + Math.abs(distance) * .08))
      const startTime = window.performance.now()

      if (window.location.hash !== anchor.hash) {
        window.history.pushState(null, '', anchor.hash)
      }

      previousInlineScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'

      const animateScroll = (timestamp: number) => {
        const progress = Math.min(1, (timestamp - startTime) / duration)
        const easedProgress = progress < .5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startY + distance * easedProgress)

        if (progress < 1) {
          scrollAnimationFrame = window.requestAnimationFrame(animateScroll)
          return
        }

        scrollAnimationFrame = null
        document.documentElement.style.scrollBehavior = previousInlineScrollBehavior
      }

      scrollAnimationFrame = window.requestAnimationFrame(animateScroll)
    }

    const handleScrollInterruption = () => stopScrollAnimation()
    const handleKeyInterruption = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
        stopScrollAnimation()
      }
    }

    root.addEventListener('click', handleInternalNavigation)
    window.addEventListener('wheel', handleScrollInterruption, { passive: true })
    window.addEventListener('touchstart', handleScrollInterruption, { passive: true })
    window.addEventListener('keydown', handleKeyInterruption)

    return () => {
      stopScrollAnimation()
      root.removeEventListener('click', handleInternalNavigation)
      window.removeEventListener('wheel', handleScrollInterruption)
      window.removeEventListener('touchstart', handleScrollInterruption)
      window.removeEventListener('keydown', handleKeyInterruption)
    }
  }, [])

  useEffect(() => {
    const root = siteRef.current
    const progressBar = scrollProgressRef.current
    if (!root || !progressBar) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const driftItems = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-media]'))
      .map((wrapper) => {
        const image = wrapper.querySelector<HTMLElement>('img')
        if (!image) return null

        return {
          current: 0,
          image,
          strength: Number.parseFloat(wrapper.dataset.scrollStrength ?? '16'),
          target: 0,
          wrapper,
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))

    let animationFrame: number | null = null
    let progressCurrent = 0
    let progressTarget = 0

    const renderScrollMotion = () => {
      animationFrame = null
      let shouldContinue = false

      progressCurrent += (progressTarget - progressCurrent) * .14
      if (Math.abs(progressTarget - progressCurrent) > .001) shouldContinue = true
      progressBar.style.transform = `scaleY(${progressCurrent.toFixed(4)})`

      if (!prefersReducedMotion) {
        driftItems.forEach((item) => {
          item.current += (item.target - item.current) * .09
          if (Math.abs(item.target - item.current) > .08) shouldContinue = true
          item.image.style.transform = `translate3d(0, ${item.current.toFixed(2)}px, 0) scale(1.045)`
        })
      }

      if (shouldContinue) animationFrame = window.requestAnimationFrame(renderScrollMotion)
    }

    const scheduleScrollMotion = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight
      progressTarget = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0

      if (!prefersReducedMotion) {
        driftItems.forEach((item) => {
          const rect = item.wrapper.getBoundingClientRect()
          const viewportDistance = window.innerHeight + rect.height
          const relativePosition = (rect.top + rect.height / 2 - window.innerHeight / 2) / viewportDistance
          item.target = Math.max(-1, Math.min(1, relativePosition)) * item.strength
        })
      }

      if (animationFrame === null) animationFrame = window.requestAnimationFrame(renderScrollMotion)
    }

    window.addEventListener('scroll', scheduleScrollMotion, { passive: true })
    window.addEventListener('resize', scheduleScrollMotion)
    scheduleScrollMotion()

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', scheduleScrollMotion)
      window.removeEventListener('resize', scheduleScrollMotion)
      driftItems.forEach((item) => {
        item.image.style.transform = ''
      })
    }
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
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuOpen && (
          <nav id="mobile-navigation" className={styles.mobileNav} aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                href={item.href}
                className={activeSection === item.href.slice(1) ? styles.navActive : undefined}
                aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                key={item.href}
                onClick={() => setMenuOpen(false)}
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
              <a href="#archive">Twenty-two rooms</a>
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

          <div className={styles.practiceGrid} data-reveal="visual">
            <article>
              <span className={styles.practiceNumber}>01 / LIVE</span>
              <Music2 size={30} />
              <h3>Performance</h3>
              <p>
                Guzheng performances that move between classical repertoire,
                contemporary collaboration, and cross-cultural fusion.
              </p>
              <a href="#archive">Explore all activities <ArrowUpRight size={15} /></a>
            </article>
            <article>
              <span className={styles.practiceNumber}>02 / INQUIRY</span>
              <BookOpen size={30} />
              <h3>Research</h3>
              <p>
                Practice-led work exploring music, wellbeing, cultural
                familiarity, participation, and the feeling of belonging.
              </p>
              <a href="#research">Current research <ArrowUpRight size={15} /></a>
            </article>
            <article>
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

          <div className={styles.videoGrid} data-reveal="visual">
            {featuredVideos.map((video, index) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
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
                  setActivePressVideoId(null)
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
                  onKeyDown={(event) => {
                    const currentIndex = pressItems.findIndex((pressItem) => pressItem.id === item.id)
                    const isForward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
                    const isBackward = event.key === 'ArrowLeft' || event.key === 'ArrowUp'

                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActivePressId(item.id)
                      setActivePressVideoId(null)
                      return
                    }

                    if (!isForward && !isBackward) return

                    event.preventDefault()
                    const nextIndex = isForward
                      ? (currentIndex + 1) % pressItems.length
                      : (currentIndex - 1 + pressItems.length) % pressItems.length
                    const nextItem = pressItems[nextIndex]
                    setActivePressId(nextItem.id)
                    setActivePressVideoId(null)
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
                  aria-hidden={activePressId !== item.id}
                  key={item.id}
                >
                  <div
                    className={[
                      styles.pressFeatureVisual,
                      item.videoUrl ? styles.pressFeatureVideo : styles.pressFeatureEditorial,
                      item.id === '2' ? styles.pressFeaturePortrait : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {item.posterUrl || item.screenshotUrl ? (
                      item.videoUrl ? (
                        <button
                          type="button"
                          className={styles.pressVideoTrigger}
                          onClick={(event) => {
                            pressVideoTriggerRef.current = event.currentTarget
                            setActivePressVideoId(item.id)
                          }}
                          aria-label={`Play ${item.name} coverage video`}
                        >
                          <Image
                            src={item.posterUrl || item.screenshotUrl || ''}
                            alt=""
                            aria-hidden="true"
                            fill
                            className={styles.pressVisualBackdrop}
                            sizes="(max-width: 800px) 100vw, 48vw"
                          />
                          <Image
                            src={item.posterUrl || item.screenshotUrl || ''}
                            alt={`${item.name} coverage preview`}
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
                          aria-label={`Read the ${item.name} news report (opens in a new tab)`}
                        >
                          <Image
                            src={item.posterUrl || item.screenshotUrl || ''}
                            alt=""
                            aria-hidden="true"
                            fill
                            className={styles.pressVisualBackdrop}
                            sizes="(max-width: 800px) 100vw, 48vw"
                          />
                          <Image
                            src={item.posterUrl || item.screenshotUrl || ''}
                            alt={`${item.name} coverage preview`}
                            fill
                            className={styles.pressVisualSubject}
                            sizes="(max-width: 800px) 100vw, 48vw"
                          />
                        </a>
                      ) : (
                        <Image
                          src={item.posterUrl || item.screenshotUrl || ''}
                          alt={`${item.name} coverage preview`}
                          fill
                          className={styles.pressVisualSubject}
                          sizes="(max-width: 800px) 100vw, 48vw"
                        />
                      )
                    ) : null}
                    <span className={styles.pressVisualLabel}>
                      {item.videoUrl ? 'Broadcast film' : 'Print edition'}
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
                        aria-label={`Read the ${item.name} coverage (opens in a new tab)`}
                      >
                        Read the coverage <ArrowUpRight size={15} />
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

          {activePressVideo ? (
            <div
              className={`${styles.pressVideoModal} ${styles.pressVideoModalOpen}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="press-video-title"
            >
              <button
                type="button"
                className={styles.pressVideoBackdrop}
                onClick={() => setActivePressVideoId(null)}
                aria-label="Close video"
              />
              <div className={styles.pressVideoPanel}>
                <div className={styles.pressVideoHead}>
                  <span id="press-video-title">{activePressVideo.name} · Coverage clip</span>
                  <button ref={pressVideoCloseRef} type="button" onClick={() => setActivePressVideoId(null)} aria-label="Close video">
                    <X size={20} />
                  </button>
                </div>
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
          ) : null}
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
            <div className={styles.qrList}>
              {socialLinks.map((social) => (
                <a
                  href={`#qr-${social.id}`}
                  key={social.id}
                  aria-label={`Enlarge ${social.name} QR code`}
                  aria-haspopup="dialog"
                  aria-expanded={activeQrId === social.id}
                  onClick={(event) => {
                    event.preventDefault()
                    qrTriggerRef.current = event.currentTarget
                    setActiveQrId(social.id)
                  }}
                >
                  <span className={styles.qrImage}>
                    <Image
                      src={social.qrCode}
                      alt={`${social.name} QR code`}
                      width={92}
                      height={92}
                    />
                  </span>
                  <span>{social.name}</span>
                  <small>Tap to enlarge</small>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedEngagement && (
        <div
          className={`${styles.memoirModal} ${isMemoirClosing ? styles.memoirModalClosing : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="memoir-modal-title"
        >
          <button
            type="button"
            className={styles.memoirModalBackdrop}
            onClick={closeMemoir}
            aria-label="Close memory"
          />
          <div
            className={`${styles.memoirModalPanel} ${isMemoirClosing ? styles.memoirModalPanelClosing : ''}`}
            onAnimationEnd={(event) => {
              if (!isMemoirClosing || event.target !== event.currentTarget) return

              setSelectedEngagement(null)
              setIsMemoirClosing(false)
            }}
          >
            <button
              type="button"
              className={styles.memoirModalClose}
              ref={memoirCloseRef}
              onClick={closeMemoir}
              aria-label="Close memory"
            >
              <X size={19} />
            </button>
            <div
              className={`${styles.memoirModalImage} ${selectedEngagementImageIsWide ? styles.memoirModalImageWide : ''}`}
            >
              {selectedEngagementImageIsWide && (
                <Image
                  src={selectedEngagement.images[0]}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 800px) 92vw, 56vw"
                  className={styles.memoirModalImageBackdrop}
                />
              )}
              <Image
                src={selectedEngagement.images[0]}
                alt={selectedEngagement.event}
                fill
                sizes="(max-width: 800px) 92vw, 56vw"
                className={selectedEngagementImageIsWide ? styles.memoirModalImageForeground : undefined}
              />
            </div>
            <div className={styles.memoirModalCopy}>
              <span>
                {formatEngagementDate(selectedEngagement.date)} · {selectedEngagement.tags.join(' · ')}
              </span>
              <h3 id="memoir-modal-title">{selectedEngagement.event}</h3>
              {selectedEngagement.modalCopy && (
                <p className={styles.memoirModalSubtitle}>{selectedEngagement.modalCopy.subtitle}</p>
              )}
              <p>{selectedEngagement.modalCopy?.description ?? describeEngagement(selectedEngagement.tags)}</p>
              <small>{selectedEngagement.venue}</small>
              {selectedEngagementResources.length > 0 && (
                <div className={styles.memoirModalActions}>
                  {selectedEngagementResources.map((resource) => (
                    <a
                      key={resource.href}
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${resource.label} for ${selectedEngagement.event} (opens in a new tab)`}
                    >
                      {resource.label} <ArrowUpRight size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeQr && (
        <div
          className={styles.qrModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <button
            type="button"
            className={styles.mediaBackdrop}
            onClick={() => setActiveQrId(null)}
            aria-label="Close QR code"
          />
          <div className={styles.qrModalPanel}>
            <div className={styles.qrModalHead}>
              <div>
                <span>CONNECT / {activeQr.id.toUpperCase()}</span>
                <strong id="qr-modal-title">{activeQr.name}</strong>
              </div>
              <button ref={qrCloseRef} type="button" onClick={() => setActiveQrId(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className={styles.qrModalImage}>
              <Image
                src={activeQr.qrCode}
                alt={`Enlarged ${activeQr.name} QR code`}
                width={420}
                height={420}
              />
            </div>
            <p>Scan with your phone camera</p>
          </div>
        </div>
      )}

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
