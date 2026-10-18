'use client'

import { type Ref, useEffect, useImperativeHandle, useRef } from 'react'
import { X } from 'lucide-react'
import type { PressItem } from '@/data/portfolioMedia'
import { useDialogMotion } from './useDialogMotion'
import styles from './page.module.css'

export type PressVideoModalHandle = {
  open: (item: PressItem, trigger: HTMLElement | null) => void
}

// Like the archive dialog, this owns its own state so opening it doesn't
// re-render the page, and it leaves the same way it arrives.
export function PressVideoModal({ ref }: { ref: Ref<PressVideoModalHandle> }) {
  const { item, isClosing, open, close, dialogRef, closeButtonRef, onCloseStartRef } =
    useDialogMotion<PressItem>()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Sound shouldn't linger through the exit.
  useEffect(() => {
    onCloseStartRef.current = () => videoRef.current?.pause()
    return () => {
      onCloseStartRef.current = undefined
    }
  }, [onCloseStartRef])

  useImperativeHandle(ref, () => ({ open }), [open])

  if (!item) return null

  return (
    <div
      ref={dialogRef}
      className={`${styles.pressVideoModal} ${isClosing ? styles.pressVideoModalClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="press-video-title"
    >
      <button
        type="button"
        className={styles.pressVideoBackdrop}
        onClick={close}
        tabIndex={-1}
        aria-label="Close video"
      />
      <div className={styles.pressVideoPanel}>
        <div className={styles.pressVideoHead}>
          <span id="press-video-title">{item.name} · Coverage clip</span>
          <button ref={closeButtonRef} type="button" onClick={close} aria-label="Close video">
            <X size={20} />
          </button>
        </div>
        <video
          ref={videoRef}
          autoPlay
          controls
          playsInline
          poster={item.posterUrl || item.screenshotUrl}
        >
          <source src={item.videoUrl || undefined} />
        </video>
      </div>
    </div>
  )
}
