'use client'

import { type Ref, type RefObject, useImperativeHandle, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, X } from 'lucide-react'
import type { ArchiveEngagement } from '@/data/portfolioEngagements'
import {
  describeEngagement,
  formatEngagementDate,
  MEMOIR_MODAL_SIZES,
  wideArchiveImages,
} from './archiveShared'
import { useDialogMotion } from './useDialogMotion'
import styles from './page.module.css'
import mobileModalStyles from './archiveModalMobile.module.css'

export type ArchiveMemoirModalHandle = {
  /** `thumbSrc` is the card's already-loaded thumbnail, shown until the full photo arrives. */
  open: (item: ArchiveEngagement, trigger: HTMLElement | null, thumbSrc?: string) => void
}

type OpenMemoir = { engagement: ArchiveEngagement; thumbSrc: string }

// The dialog owns its own state and lives apart from the page, so opening it
// re-renders only this subtree rather than the whole portfolio.
export function ArchiveMemoirModal({ ref }: { ref: Ref<ArchiveMemoirModalHandle> }) {
  const { item, isClosing, open, close, dialogRef, closeButtonRef } =
    useDialogMotion<OpenMemoir>()

  useImperativeHandle(
    ref,
    () => ({
      open: (engagement, trigger, thumbSrc = '') => open({ engagement, thumbSrc }, trigger),
    }),
    [open],
  )

  if (!item) return null

  return (
    <MemoirDialog
      key={item.engagement.id}
      item={item}
      isClosing={isClosing}
      close={close}
      dialogRef={dialogRef}
      closeButtonRef={closeButtonRef}
    />
  )
}

function MemoirDialog({
  item: { engagement, thumbSrc },
  isClosing,
  close,
  dialogRef,
  closeButtonRef,
}: {
  item: OpenMemoir
  isClosing: boolean
  close: () => void
  dialogRef: RefObject<HTMLDivElement | null>
  closeButtonRef: RefObject<HTMLButtonElement | null>
}) {
  // The photo is a larger file than the card's thumbnail. Until it has decoded,
  // the thumbnail stands in beneath it and the sharp photo fades up over it, so
  // the panel is never an empty dark slab.
  const [photoReady, setPhotoReady] = useState(false)

  const isWide = wideArchiveImages.has(engagement.images[0])
  const resources = [
    {
      label: engagement.linkLabel ?? 'Read the full event',
      href: engagement.link,
    },
    ...(engagement.externalResources ?? []),
    ...(engagement.videoLink
      ? [{ label: 'Watch performance video', href: engagement.videoLink }]
      : []),
  ]
  const hasScrollableCopy = resources.length > 3 || engagement.scrollableCopy === true

  return (
    <div
      ref={dialogRef}
      className={[
        styles.memoirModal,
        hasScrollableCopy ? mobileModalStyles.scrollableClose : '',
        isClosing ? styles.memoirModalClosing : '',
      ].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="memoir-modal-title"
    >
      <button
        type="button"
        className={styles.memoirModalBackdrop}
        onClick={close}
        tabIndex={-1}
        aria-label="Close memory"
      />
      <div className={styles.memoirModalPanel}>
        <button
          type="button"
          className={`${styles.memoirModalClose} ${hasScrollableCopy ? mobileModalStyles.closeButton : ''}`}
          ref={closeButtonRef}
          onClick={close}
          aria-label="Close memory"
        >
          <X size={19} />
        </button>
        <div
          className={`${styles.memoirModalImage} ${isWide ? styles.memoirModalImageWide : ''} ${hasScrollableCopy && isWide ? mobileModalStyles.clipWideImage : ''}`}
        >
          {isWide && thumbSrc && (
            // The backdrop is blurred to a wash, so the small thumbnail is all it needs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbSrc}
              alt=""
              aria-hidden="true"
              className={styles.memoirModalImageBackdrop}
            />
          )}
          {thumbSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbSrc}
              alt=""
              aria-hidden="true"
              className={styles.memoirModalImageThumb}
            />
          )}
          <Image
            ref={(image) => {
              if (image?.complete && image.naturalWidth > 0) setPhotoReady(true)
            }}
            src={engagement.images[0]}
            alt={engagement.imageAlt ?? engagement.event}
            fill
            sizes={MEMOIR_MODAL_SIZES}
            loading="eager"
            decoding="sync"
            data-ready={photoReady ? '' : undefined}
            className={styles.memoirModalPhoto}
            onLoad={() => setPhotoReady(true)}
          />
        </div>
        <div
          className={`${styles.memoirModalCopy} ${hasScrollableCopy ? mobileModalStyles.scrollableCopy : ''}`}
        >
          <span>
            {formatEngagementDate(engagement.date)} · {engagement.tags.join(' · ')}
          </span>
          <h3 id="memoir-modal-title">{engagement.event}</h3>
          {engagement.modalCopy && (
            <p className={styles.memoirModalSubtitle}>{engagement.modalCopy.subtitle}</p>
          )}
          <p>{engagement.modalCopy?.description ?? describeEngagement(engagement.tags)}</p>
          <small>{engagement.venue}</small>
          {resources.length > 0 && (
            <div className={styles.memoirModalActions}>
              {resources.map((resource) => (
                <a
                  key={resource.href}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${resource.label} for ${engagement.event} (opens in a new tab)`}
                >
                  {resource.label} <ArrowUpRight size={15} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
