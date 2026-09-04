import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Literata } from 'next/font/google'

/*
 * Type for the ink exploration.
 *
 * Three voices, the way a painting carries three hands: the brush (display),
 * the writing (reading), and the seal-side annotation (micro).
 *
 * Cormorant Garamond stays from the current site — its 300 weight is the
 * closest thing Latin type has to a fine brush line, and keeping it means the
 * exploration still sounds like the same person. Literata replaces Archivo for
 * reading: it is a text face built for long-form screen reading and it carries
 * the warmth of something printed rather than rendered. Inter, only ever small
 * and only ever tracked out, does the annotation work.
 */

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--ink-display',
  display: 'swap',
})

const reading = Literata({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--ink-reading',
  display: 'swap',
})

const micro = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--ink-micro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ink & Resonance — visual exploration',
  description:
    'A design exploration for the portfolio of Lijun Zhang, translating the compositional logic of Chinese ink painting into a contemporary web language.',
  robots: { index: false, follow: false },
}

export default function InkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${reading.variable} ${micro.variable}`}>
      {children}
    </div>
  )
}
