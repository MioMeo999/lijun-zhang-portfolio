'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { readDurationMs } from './motionUtils'
import { lockPageScroll } from './pageScrollLock'

// Used only if the `--dialog-exit` token can't be read.
const EXIT_FALLBACK_MS = 300

const FOCUSABLE =
  'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'

/**
 * Shared lifecycle for the page's dialogs: one gesture in, the same gesture out.
 *
 * The dialog stays mounted while it leaves, so closing is a CSS transition the
 * dialog can reverse if it is reopened mid-exit. The exit length is a CSS token
 * (`--dialog-exit`, read from the dialog element) so tuning it needs no edit here.
 *
 * Also owns the parts that are easy to get subtly wrong: the page behind does
 * not move (scrollbar padding, scroll position kept), focus is trapped inside
 * and handed back to whatever opened it, and Escape closes.
 */
export function useDialogMotion<T>() {
  const [item, setItem] = useState<T | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const closeTimerRef = useRef<number | undefined>(undefined)
  const onCloseStartRef = useRef<(() => void) | undefined>(undefined)

  const open = useCallback((value: T, trigger: HTMLElement | null) => {
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = undefined
    triggerRef.current = trigger
    setIsClosing(false)
    setItem(value)
    // Reopened while still leaving: focus is on the trigger by now, bring it back in.
    closeButtonRef.current?.focus({ preventScroll: true })
  }, [])

  const close = useCallback(() => {
    if (closeTimerRef.current !== undefined) return

    // Focus goes back as the exit begins, not when the dialog is gone. preventScroll:
    // the page scrolls smoothly, and refocusing a trigger that is partly off-screen
    // would visibly drift it behind the leaving scrim.
    const trigger = triggerRef.current
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    onCloseStartRef.current?.()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setItem(null)
      return
    }

    setIsClosing(true)

    const exitMs = dialogRef.current
      ? readDurationMs(
          window.getComputedStyle(dialogRef.current).getPropertyValue('--dialog-exit'),
          EXIT_FALLBACK_MS,
        )
      : EXIT_FALLBACK_MS
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = undefined
      setItem(null)
      setIsClosing(false)
    }, exitMs + 30)
  }, [])

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), [])

  const isOpen = item !== null

  useEffect(() => {
    if (!isOpen) return

    const unlock = lockPageScroll()
    closeButtonRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }

      // Once closing, focus has already gone back to the trigger.
      if (event.key !== 'Tab' || closeTimerRef.current !== undefined) return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) =>
          element.tabIndex >= 0 &&
          (element.offsetParent !== null || element === document.activeElement),
      )
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (!dialog.contains(active)) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      unlock()
    }
  }, [isOpen, close])

  return { item, isClosing, open, close, dialogRef, closeButtonRef, onCloseStartRef }
}
