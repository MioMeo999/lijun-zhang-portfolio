// Locks page scroll behind a dialog without the page moving.
//
// Hiding the scrollbar widens the viewport, which slides the whole page sideways
// and re-wraps its text (so the scroll position drifts too). Padding the body by
// the scrollbar's width holds the layout still. Releasing the lock re-flows the
// page in two passes, and when the page is scrolled near the bottom the browser
// clamps to the shorter pass and never restores it, so the position is put back
// explicitly. `instant` because the page itself scrolls smoothly.
//
// Locks are counted, so two overlays (e.g. the mobile menu and a dialog) never
// release each other's lock early.

let activeLocks = 0
let releaseLayout: (() => void) | null = null

function applyLock() {
  const { body, documentElement } = document
  const previousOverflow = body.style.overflow
  const previousPaddingRight = body.style.paddingRight

  const scrollbarWidth = window.innerWidth - documentElement.clientWidth
  if (scrollbarWidth > 0) {
    const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }
  body.style.overflow = 'hidden'

  return () => {
    const scrollY = window.scrollY
    body.style.overflow = previousOverflow
    body.style.paddingRight = previousPaddingRight

    void body.offsetHeight
    if (window.scrollY !== scrollY) window.scrollTo({ top: scrollY, behavior: 'instant' })
  }
}

export function lockPageScroll() {
  activeLocks += 1
  if (activeLocks === 1) releaseLayout = applyLock()

  let released = false
  return () => {
    if (released) return
    released = true
    activeLocks -= 1
    if (activeLocks === 0) {
      releaseLayout?.()
      releaseLayout = null
    }
  }
}
