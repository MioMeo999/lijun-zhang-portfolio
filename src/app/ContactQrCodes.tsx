'use client'

import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image, { getImageProps } from 'next/image'
import { X } from 'lucide-react'
import styles from './page.module.css'

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

const QR_MODAL_SIZE = 420

// Used only if the `--qr-exit` token can't be read.
const QR_EXIT_FALLBACK_MS = 260

function readDurationMs(value: string, fallback: number) {
  const match = value.trim().match(/^([\d.]+)(ms|s)$/)
  if (!match) return fallback
  return parseFloat(match[1]) * (match[2] === 's' ? 1000 : 1)
}

// The enlarged code is a different optimised URL from the 92px thumbnail, so
// without a head start it is still downloading while the dialog fades in and
// shows as an empty white square. Requesting it early, with the same srcset
// the dialog's <img> will use, lets the browser serve it from cache.
const preloadedQrImages = new Map<string, HTMLImageElement>()

function preloadModalImage(src: string) {
  if (preloadedQrImages.has(src)) return

  const { props } = getImageProps({ src, alt: '', width: QR_MODAL_SIZE, height: QR_MODAL_SIZE })
  const image = new window.Image()
  if (props.srcSet) image.srcset = props.srcSet
  image.src = props.src
  preloadedQrImages.set(src, image)
}

export function ContactQrCodes() {
  // The dialog lives in its own component so opening it re-renders only this
  // subtree instead of the whole page, which is what delayed the first frame.
  const [open, setOpen] = useState<{ id: string; root: Element } | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [isTileReleased, setIsTileReleased] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const closeTimerRef = useRef<number | undefined>(undefined)

  const active = socialLinks.find((social) => social.id === open?.id)

  const openQr = useCallback((id: string, trigger: HTMLElement) => {
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = undefined
    triggerRef.current = trigger
    setIsClosing(false)
    setIsTileReleased(false)
    // The dialog is portalled back into the site root, not <body>: the page's
    // colour and motion tokens are declared on it, and anything nested inside a
    // revealed section would be positioned against that section's transform.
    setOpen({ id, root: trigger.closest(`.${styles.site}`) ?? document.body })
    // Reopened while still leaving (focus is on the tile by then): bring it back in.
    closeButtonRef.current?.focus({ preventScroll: true })
  }, [])

  const closeQr = useCallback((event?: ReactMouseEvent) => {
    if (closeTimerRef.current !== undefined) return

    // Hand focus back to the tile as the exit begins, not when the dialog is gone:
    // whether the tile then shows a focus look is settled straight away, which the
    // release below depends on. preventScroll: the page has smooth scrolling on,
    // and refocusing a tile that is partly off-screen would visibly drift it.
    const trigger = triggerRef.current
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(null)
      setIsTileReleased(false)
      return
    }

    // The tile holds its hover look while the dialog is up. If the pointer closes
    // it from somewhere else, let the tile ease back down now, under the leaving
    // scrim, rather than visibly dropping once the page is revealed. Nothing to
    // release when the tile will keep a look of its own afterwards: it is under
    // the pointer (:hover) or focused by keyboard (:focus-visible).
    if (event && event.detail > 0 && trigger
      && !trigger.matches(':focus-visible')
      && !document.elementsFromPoint(event.clientX, event.clientY).includes(trigger)) {
      setIsTileReleased(true)
    }

    setIsClosing(true)

    // The exit length lives in CSS (`--qr-exit`); unmount just after it ends.
    const exitMs = dialogRef.current
      ? readDurationMs(window.getComputedStyle(dialogRef.current).getPropertyValue('--qr-exit'), QR_EXIT_FALLBACK_MS)
      : QR_EXIT_FALLBACK_MS
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = undefined
      setOpen(null)
      setIsClosing(false)
      setIsTileReleased(false)
    }, exitMs + 30)
  }, [])

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), [])

  // Fetch the enlarged codes once the section is close to scrolling into view.
  useEffect(() => {
    const list = listRef.current
    if (!list || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      socialLinks.forEach((social) => preloadModalImage(social.qrCode))
      observer.disconnect()
    }, { rootMargin: '600px 0px' })

    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  const isOpen = open !== null

  useEffect(() => {
    if (!isOpen) return

    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight

    // Hiding the scrollbar widens the viewport, which would slide the whole page
    // sideways behind the dialog. Pad the body by the same amount to hold it still.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
    }
    body.style.overflow = 'hidden'
    closeButtonRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeQr()
      } else if (event.key === 'Tab' && closeTimerRef.current === undefined) {
        // The close button is the only control, so keep focus from leaving the dialog
        // (once it is closing, focus has already gone back to the tile).
        event.preventDefault()
        closeButtonRef.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      const scrollY = window.scrollY
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      window.removeEventListener('keydown', handleKeyDown)

      // Releasing the lock re-flows the page in two passes (scrollbar back, then
      // padding gone), and each is a hair shorter or taller than the last. Scrolled
      // to the very bottom — where the contact section sits — the browser clamps to
      // the shorter pass and never restores it, so the page hops. Settle the layout
      // and put the position back; no frame is painted in between. `instant`
      // because the page itself scrolls smoothly.
      void body.offsetHeight
      if (window.scrollY !== scrollY) window.scrollTo({ top: scrollY, behavior: 'instant' })
    }
  }, [isOpen, closeQr])

  return (
    <>
      <div className={styles.qrList} ref={listRef}>
        {socialLinks.map((social) => (
          <a
            href={`#qr-${social.id}`}
            key={social.id}
            aria-label={`Enlarge ${social.name} QR code`}
            aria-haspopup="dialog"
            aria-expanded={open?.id === social.id}
            data-held={open?.id === social.id && !isTileReleased ? '' : undefined}
            onPointerEnter={() => preloadModalImage(social.qrCode)}
            onFocus={() => preloadModalImage(social.qrCode)}
            onClick={(event) => {
              event.preventDefault()
              openQr(social.id, event.currentTarget)
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

      {open && active && createPortal(
        <div
          ref={dialogRef}
          className={`${styles.qrModal} ${isClosing ? styles.qrModalClosing : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <button
            type="button"
            className={styles.mediaBackdrop}
            onClick={closeQr}
            aria-label="Close QR code"
          />
          <div className={styles.qrModalPanel}>
            <div className={styles.qrModalHead}>
              <div>
                <span>CONNECT / {active.id.toUpperCase()}</span>
                <strong id="qr-modal-title">{active.name}</strong>
              </div>
              <button ref={closeButtonRef} type="button" onClick={closeQr} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className={styles.qrModalImage}>
              <Image
                src={active.qrCode}
                alt={`Enlarged ${active.name} QR code`}
                width={QR_MODAL_SIZE}
                height={QR_MODAL_SIZE}
                loading="eager"
                decoding="sync"
              />
            </div>
            <p>Scan with your phone camera</p>
          </div>
        </div>,
        open.root,
      )}
    </>
  )
}
