import type { Metadata, Viewport } from 'next'
import { Archivo, Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const siteUrl = 'https://lijun-zhang-portfolio.vercel.app'
const siteTitle = 'Lijun Zhang — Guzheng Artist, Researcher & Cultural Connector'
const siteDescription =
  'The portfolio of Lijun Zhang — Guzheng artist, researcher, and cultural connector based in Leeds, UK.'

const structureSans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const displaySerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-display',
  display: 'swap',
})

const bodySans = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4efe7',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteTitle,
    description:
      'Guzheng performance, research, cultural engagement, and community practice.',
    type: 'website',
    url: '/',
    siteName: 'Ink & Resonance',
    locale: 'en_GB',
    images: [
      {
        url: '/images/bg-home.jpg',
        width: 2400,
        height: 1600,
        alt: 'Lijun Zhang — Ink & Resonance portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/images/bg-home.jpg'],
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lijun Zhang',
  url: siteUrl,
  image: `${siteUrl}/images/about-portrait.jpg`,
  jobTitle: 'Guzheng Artist, Researcher & Cultural Connector',
  description: siteDescription,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Leeds',
    addressCountry: 'GB',
  },
  sameAs: [
    'https://www.instagram.com/miolijun999/',
    'https://www.youtube.com/@lijun6',
  ],
  knowsAbout: [
    'Guzheng performance',
    'community music',
    'cultural participation',
    'music and belonging research',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${structureSans.variable} ${displaySerif.variable} ${bodySans.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  )
}
