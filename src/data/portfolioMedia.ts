export type PerformanceVideo = {
  id: string
  title: string
  youtubeId: string
  thumbnailUrl?: string
  category: 'Solo' | 'Ensemble' | 'Cross-Cultural' | 'Shorts'
  featured: boolean
}

export const performanceVideos: PerformanceVideo[] = [
  {
    id: '1',
    title: 'Guzheng | Dance of Yi People',
    youtubeId: 'y6bHlgyxbIA',
    category: 'Solo',
    featured: true,
  },
  {
    id: '9',
    title: 'Chinese and Western Musical Instruments Ensemble · Super Mario',
    youtubeId: '6UwP1YRYhyk',
    category: 'Ensemble',
    featured: true,
  },
  {
    id: '4',
    title: 'Ensemble of Folk Chinese Instruments',
    youtubeId: 'r_z4RZtPSLE',
    category: 'Ensemble',
    featured: true,
  },
  {
    id: '3',
    title: 'Guzheng | Bai Suzhen at the Foot of Mount Qingcheng',
    youtubeId: 'RfXDqO6S0Lo',
    category: 'Solo',
    featured: true,
  },
  {
    id: '5',
    title: 'Guzheng + Piano | Liuyang River',
    youtubeId: 'FyOBZPbyq5s',
    thumbnailUrl: '/images/videos/liuyang-river.jpg',
    category: 'Solo',
    featured: false,
  },
  {
    id: '2',
    title: 'Guzheng & Indian Dance Improvisation at LUBS Summer Celebration',
    youtubeId: '1du3kbAu-MU',
    category: 'Cross-Cultural',
    featured: false,
  },
  {
    id: '6',
    title: 'Guzheng by Candlelight in a Leeds Church',
    youtubeId: '4UZzD0JfEwE',
    category: 'Solo',
    featured: false,
  },
  {
    id: '7',
    title: '古筝和乐队《月亮代表我的心》',
    youtubeId: 'L9H6VtqMlek',
    category: 'Shorts',
    featured: false,
  },
  {
    id: '8',
    title: '二胡·古筝《赛马》',
    youtubeId: 'qnjTbQZmFGM',
    category: 'Shorts',
    featured: false,
  },
]

export type PressItem = {
  id: string
  name: string
  logoUrl: string
  logoWidth?: number
  featureImageUrl?: string
  featureImageAlt?: string
  needsDarkBackgroundContrast?: boolean
  mediaLabel?: string
  screenshotUrl?: string
  videoUrl?: string
  posterUrl?: string
  linkLabel?: string
  link: string | null
}

export const pressItems: PressItem[] = [
  {
    id: 'china-daily',
    name: 'China Daily',
    logoUrl: '/images/press/china-daily-logo.png',
    logoWidth: 190,
    featureImageUrl: '/images/timeline/vision-china-london-2026.jpg',
    featureImageAlt:
      'Guzheng, erhu and violin performers on stage at Vision China in London, beneath the event screen and China Daily signage.',
    mediaLabel: 'Live coverage',
    linkLabel: 'Watch the live coverage',
    link: 'https://x.com/ChinaDaily/status/2100918603499618368',
  },
  {
    id: '1',
    name: 'CCTV',
    logoUrl: '/images/press/cctv-mark.png',
    logoWidth: 132,
    needsDarkBackgroundContrast: true,
    videoUrl: '/videos/cctv-coverage.mp4',
    posterUrl: '/images/press/cctv-screenshot.png',
    link: null,
  },
  {
    id: '2',
    name: "People's Daily",
    logoUrl: '/images/press/people-daily-mark.png',
    logoWidth: 146,
    screenshotUrl: '/images/press/people-daily-screenshot.png',
    link: 'https://paper.people.com.cn/rmrbhwb/pc/content/202508/21/content_30098228.html',
  },
  {
    id: '3',
    name: 'CGTN',
    logoUrl: '/images/press/cgtn-mark.png',
    logoWidth: 142,
    videoUrl: '/videos/cgtn-mid-autumn-clip.mp4',
    posterUrl: '/images/press/cgtn-screenshot.png',
    link: 'https://newseu.cgtn.com/news/2025-10-06/Manchester-s-Mid-Autumn-festival-celebrates-China-UK-friendship-1HedEuOxHbi/p.html',
  },
]
