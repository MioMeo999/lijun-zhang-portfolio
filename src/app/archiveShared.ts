import { getImageProps } from 'next/image'

export const formatEngagementDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year.slice(2)}`
}

export const describeEngagement = (tags: string[]) => {
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

export const wideArchiveImages = new Set([
  '/images/timeline/manchester-mid-autumn-2026.jpg',
  '/images/timeline/vision-china-london-2026.jpg',
  '/images/timeline/lihua-school-awards-2024.jpg',
  '/images/timeline/wu-fest-teaser-2025.jpg',
  '/images/timeline/york-spring-gala-2026.jpg',
  '/images/timeline/lccs-summer-fair-2025.jpg',
  '/images/timeline/leeds-chinese-new-year-2026.jpg',
  '/images/timeline/lubs-global-impact-day-2026.jpeg',
  '/images/timeline/dragon-new-year-2024-leeds.jpg',
])

// The sizes the dialog's photo is rendered with. Kept here so the preload below
// asks for exactly the file the dialog will use.
export const MEMOIR_MODAL_SIZES = '(max-width: 800px) 92vw, 56vw'

// The dialog's photo is a larger, differently-sized variant than the card's
// thumbnail, so without a head start it is still downloading while the dialog
// fades in. Requesting it as the pointer arrives lets the browser serve it from
// cache; the same srcset the dialog's <img> will use makes the request match.
const preloadedMemoirImages = new Map<string, HTMLImageElement>()

export function preloadMemoirImage(src: string) {
  if (preloadedMemoirImages.has(src)) return

  const { props } = getImageProps({ src, alt: '', fill: true, sizes: MEMOIR_MODAL_SIZES })
  const image = new window.Image()
  if (props.srcSet) image.srcset = props.srcSet
  image.sizes = MEMOIR_MODAL_SIZES
  image.src = props.src
  preloadedMemoirImages.set(src, image)
}
