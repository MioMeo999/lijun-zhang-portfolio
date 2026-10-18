'use client'

import { type RefObject, useEffect, useRef } from 'react'
import styles from './page.module.css'
import { readDurationMs } from './motionUtils'

// Kept in step with `--step` in page.module.css. One unit for every stagger on
// the page; the cap stops a long run of items trailing on after the eye has moved.
const CASCADE_STEP_MS = 70
const MAX_CASCADE_STEPS = 7

// Above this the page is moving too fast to read a transition, so what arrives
// is simply there. About 2.4 viewports a second on a 1000px-tall screen.
const FAST_SCROLL_PX_PER_MS = 2.4

// Targets arrive when their top edge is this far (as a share of the viewport)
// above the bottom edge. The entrance lasts most of a second, during which the
// page keeps moving; starting it nearer the middle of the screen means it plays
// where it can be seen rather than at the very edge. (The chapter-wide trigger
// this replaces started headings between half and three-quarters of the way down.)
const READING_LINE_INSET = 0.24

// How far through an anchor scroll the destination is released to arrive.
const LAND_AT_PROGRESS = 0.9

// A speed sample older than this no longer describes the page.
const SPEED_SAMPLE_MAX_AGE_MS = 150

const REVEAL_SELECTOR = "[data-reveal]:not([data-reveal='heading']), [data-reveal-line]"

const byDocumentOrder = (a: Node, b: Node) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1

type Flight = {
  /** While a programmatic scroll is under way nothing is revealed; it all lands together. */
  until: number
  /** Reveals whatever is on screen right now. Set by the reveal effect. */
  flush: () => void
}

type ScrollSpeed = {
  /** Pixels per millisecond, sampled once per frame by the scroll loop. */
  pxPerMs: number
  /** Timestamp of the sample. */
  at: number
}

/**
 * Reveal on arrival, anchor navigation and scroll drift, as one system.
 *
 * - Every reveal target is watched on its own and arrives when *it* reaches the
 *   reading line, not when its whole chapter does. A 2,500px archive used to start
 *   every card's entrance the moment its heading appeared, so most of them had
 *   finished long before anyone scrolled to them.
 * - Targets that arrive together (a heading and the copy under it, a row of cards)
 *   share one cascade, in document order; a target that arrives alone arrives alone.
 * - A target that arrives while the page is being flung past, or while an anchor
 *   scroll is in flight, is not animated at all. The destination plays its entrance
 *   once the page has landed.
 */
export function useSiteMotion(
  siteRef: RefObject<HTMLDivElement | null>,
  progressRef: RefObject<HTMLSpanElement | null>,
) {
  const flight = useRef<Flight>({ until: 0, flush: () => {} })
  const scrollSpeed = useRef<ScrollSpeed>({ pxPerMs: 0, at: 0 })

  useRevealOnArrival(siteRef, flight, scrollSpeed)
  useAnchorScroll(siteRef, flight)
  useScrollDrift(siteRef, progressRef, scrollSpeed)
}

function useRevealOnArrival(
  siteRef: RefObject<HTMLDivElement | null>,
  flight: RefObject<Flight>,
  scrollSpeed: RefObject<ScrollSpeed>,
) {
  useEffect(() => {
    const root = siteRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    const settleMs = readDurationMs(window.getComputedStyle(root).getPropertyValue('--enter-lg'), 920) + 160
    const timers = new Set<number>()
    const pending = new Set(items)
    let observer: IntersectionObserver | null = null

    // Commit the hidden state with transitions switched off, then release them
    // on the next frame so nothing animates on the way *into* hiding.
    root.classList.add(styles.motionBoot, styles.motionReady)
    void root.offsetWidth
    const bootFrame = window.requestAnimationFrame(() => {
      root.classList.remove(styles.motionBoot)
    })

    const show = (batch: HTMLElement[], instant: boolean) => {
      if (batch.length === 0) return

      batch.forEach((element, index) => {
        pending.delete(element)
        observer?.unobserve(element)
        element.style.setProperty(
          '--enter-delay',
          instant ? '0ms' : `${Math.min(index, MAX_CASCADE_STEPS) * CASCADE_STEP_MS}ms`,
        )
        if (instant) element.setAttribute('data-instant', '')
        element.setAttribute('data-in', '')
      })

      if (instant) {
        // Commit the shown state with every transition switched off (the elements'
        // own included), then hand them back their transitions.
        void window.getComputedStyle(batch[0]).opacity
        batch.forEach((element) => {
          element.removeAttribute('data-instant')
          element.setAttribute('data-done', '')
        })
        return
      }

      // Once an element has arrived the reveal's transition must go, or it would
      // keep overriding the element's own hover transitions (and delaying them).
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        batch.forEach((element) => element.setAttribute('data-done', ''))
      }, settleMs + Math.min(batch.length - 1, MAX_CASCADE_STEPS) * CASCADE_STEP_MS)
      timers.add(timer)
    }

    const isFlungPast = () => {
      const { pxPerMs, at } = scrollSpeed.current
      return window.performance.now() - at < SPEED_SAMPLE_MAX_AGE_MS && pxPerMs > FAST_SCROLL_PX_PER_MS
    }

    if (!('IntersectionObserver' in window)) {
      show(items, true)
      return () => {
        window.cancelAnimationFrame(bootFrame)
      }
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (window.performance.now() < flight.current.until) return

        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .filter((element) => pending.has(element))
          .sort(byDocumentOrder)

        show(arriving, isFlungPast())
      },
      { threshold: 0, rootMargin: `0px 0px -${READING_LINE_INSET * 100}% 0px` },
    )
    items.forEach((element) => observer?.observe(element))

    flight.current.flush = () => {
      const readingLine = window.innerHeight * (1 - READING_LINE_INSET)
      show(
        Array.from(pending).filter((element) => {
          const rect = element.getBoundingClientRect()
          return rect.bottom > 0 && rect.top < readingLine
        }),
        false,
      )
    }

    return () => {
      window.cancelAnimationFrame(bootFrame)
      timers.forEach((timer) => window.clearTimeout(timer))
      observer?.disconnect()
      flight.current.flush = () => {}
      root.classList.remove(styles.motionBoot, styles.motionReady)
      items.forEach((element) => {
        element.removeAttribute('data-in')
        element.removeAttribute('data-done')
        element.removeAttribute('data-instant')
        element.style.removeProperty('--enter-delay')
      })
    }
  }, [siteRef, flight, scrollSpeed])
}

function useAnchorScroll(
  siteRef: RefObject<HTMLDivElement | null>,
  flight: RefObject<Flight>,
) {
  useEffect(() => {
    const root = siteRef.current
    if (!root) return

    let scrollAnimationFrame: number | null = null
    let previousInlineScrollBehavior = ''

    const land = () => {
      flight.current.until = 0
      flight.current.flush()
    }

    const stopScrollAnimation = () => {
      if (scrollAnimationFrame === null) return
      window.cancelAnimationFrame(scrollAnimationFrame)
      scrollAnimationFrame = null
      document.documentElement.style.scrollBehavior = previousInlineScrollBehavior
      land()
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
      // The safety margin covers a frame that never comes (a hidden tab).
      flight.current.until = startTime + duration + 250

      const animateScroll = (timestamp: number) => {
        const progress = Math.min(1, (timestamp - startTime) / duration)
        const easedProgress = progress < .5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startY + distance * easedProgress)

        // By now the page has all but stopped (the ease leaves ~0.15% of the
        // distance), so the destination can begin to arrive rather than wait for
        // the last few frames.
        if (progress >= LAND_AT_PROGRESS && flight.current.until !== 0) land()

        if (progress < 1) {
          scrollAnimationFrame = window.requestAnimationFrame(animateScroll)
          return
        }

        scrollAnimationFrame = null
        document.documentElement.style.scrollBehavior = previousInlineScrollBehavior
        land()
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
  }, [siteRef, flight])
}

// The progress rule and the slow drift of the big photographs follow the scroll
// with a little inertia. Smoothing is time-based, so it feels the same on a
// 60Hz and a 120Hz display (a per-frame lerp converges twice as fast on the latter).
const PROGRESS_SMOOTHING_MS = 110
const DRIFT_SMOOTHING_MS = 177

/**
 * One frame loop owns every layout read the scroll needs. The scroll listener
 * only asks for a frame; reading scroll position and element rects inside the
 * scroll event itself would force a layout each time something (a reveal, say)
 * had dirtied the styles since the last frame.
 */
function useScrollDrift(
  siteRef: RefObject<HTMLDivElement | null>,
  progressRef: RefObject<HTMLSpanElement | null>,
  scrollSpeed: RefObject<ScrollSpeed>,
) {
  useEffect(() => {
    const root = siteRef.current
    const progressBar = progressRef.current
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
    let previousFrameTime = 0
    let lastSampleY = window.scrollY
    let lastSampleAt = window.performance.now()
    let progressCurrent = 0
    let progressTarget = 0

    const frame = (now: number) => {
      animationFrame = null

      // Read.
      const scrollY = window.scrollY
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight
      progressTarget = scrollRange > 0 ? Math.min(1, Math.max(0, scrollY / scrollRange)) : 0

      const sampleElapsed = now - lastSampleAt
      if (sampleElapsed >= 8) {
        scrollSpeed.current = { pxPerMs: Math.abs(scrollY - lastSampleY) / sampleElapsed, at: now }
        lastSampleY = scrollY
        lastSampleAt = now
      }

      if (!prefersReducedMotion) {
        driftItems.forEach((item) => {
          const rect = item.wrapper.getBoundingClientRect()
          const viewportDistance = window.innerHeight + rect.height
          const relativePosition = (rect.top + rect.height / 2 - window.innerHeight / 2) / viewportDistance
          item.target = Math.max(-1, Math.min(1, relativePosition)) * item.strength
        })
      }

      // Write. A restart after idle has no previous frame; assume one 60Hz frame.
      const elapsed = previousFrameTime ? Math.min(64, now - previousFrameTime) : 16.7
      previousFrameTime = now
      let shouldContinue = false

      progressCurrent += (progressTarget - progressCurrent) * (1 - Math.exp(-elapsed / PROGRESS_SMOOTHING_MS))
      if (Math.abs(progressTarget - progressCurrent) > .001) shouldContinue = true
      progressBar.style.transform = `scaleY(${progressCurrent.toFixed(4)})`

      if (!prefersReducedMotion) {
        const driftEase = 1 - Math.exp(-elapsed / DRIFT_SMOOTHING_MS)
        driftItems.forEach((item) => {
          item.current += (item.target - item.current) * driftEase
          if (Math.abs(item.target - item.current) > .08) shouldContinue = true
          item.image.style.transform = `translate3d(0, ${item.current.toFixed(2)}px, 0) scale(1.045)`
        })
      }

      if (shouldContinue) {
        animationFrame = window.requestAnimationFrame(frame)
      } else {
        previousFrameTime = 0
      }
    }

    const requestFrame = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(frame)
    }

    window.addEventListener('scroll', requestFrame, { passive: true })
    window.addEventListener('resize', requestFrame)
    requestFrame()

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestFrame)
      window.removeEventListener('resize', requestFrame)
      driftItems.forEach((item) => {
        item.image.style.transform = ''
      })
    }
  }, [siteRef, progressRef, scrollSpeed])
}
