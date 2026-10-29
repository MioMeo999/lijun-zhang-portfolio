import type { Performance } from '@/types'

export type ArchiveEngagementModalCopy = {
  subtitle: string
  description: string
}

export type ArchiveEngagementResource = {
  label: string
  href: string
}

export type ArchiveEngagement = Omit<Performance, 'description' | 'link'> & {
  link: string
  linkLabel?: string
  imageAlt?: string
  videoLink?: string
  externalResources?: ArchiveEngagementResource[]
  modalCopy?: ArchiveEngagementModalCopy
  scrollableCopy?: boolean
}

export const engagementArchive: ArchiveEngagement[] = [
  {
    id: 'discover-the-guzheng-leeds-2026',
    date: '2026-10-15',
    venue: 'Leeds City Library, Music Library (1st Floor)',
    event: 'Discover the Guzheng: Sounds and Stories from China',
    tags: ['performance', 'community'],
    images: [
      '/images/timeline/discover-guzheng-performance-2026.jpg',
      '/images/timeline/discover-guzheng-poster-portrait-2026.png',
      '/images/timeline/discover-guzheng-poster-landscape-2026.png',
    ],
    imageAlt: 'Lijun Zhang performing on the guzheng at Leeds City Library.',
    link: 'https://www.ticketsource.com/leedslibraryevents/t-plopqrq',
    linkLabel: 'View TicketSource event page',
    externalResources: [
      {
        label: 'Read University of Leeds event preview',
        href: 'https://confucius.leeds.ac.uk/events/discover-the-guzheng-sounds-and-stories-from-china/',
      },
      {
        label: 'View Leeds Inspired event listing',
        href: 'https://leedsinspired.co.uk/events/discover-guzheng-sounds-and-stories-china?utm_source=chatgpt.com',
      },
      {
        label: 'View portrait event poster',
        href: '/images/timeline/discover-guzheng-poster-portrait-2026.png',
      },
      {
        label: 'View landscape event poster',
        href: '/images/timeline/discover-guzheng-poster-landscape-2026.png',
      },
    ],
    modalCopy: {
      subtitle: 'A lunchtime introduction to China’s iconic traditional string instrument',
      description:
        'I introduced the guzheng’s distinctive sounds and playing techniques, sharing stories from its cultural heritage through live performance. The 1:05–2:00pm programme moved between traditional Chinese pieces, contemporary popular songs and familiar Western melodies; audiences could also see the instrument up close and ask questions. Doors opened at 12:45pm.',
    },
  },
  {
    id: 'york-new-student-welcome-2026',
    date: '2026-09-25',
    venue: 'York',
    event: 'York New Student Welcome · 2026',
    tags: ['performance', 'community'],
    images: ['/images/timeline/york-cssa-performance-2026.jpg'],
    imageAlt: 'A trio performs erhu, guzheng and violin beneath a York Chinese Students and Scholars Association banner.',
    link: 'http://www.chisa.edu.cn/exclusive/202610/t20261008_2111527816.html',
    linkLabel: 'Read CHISA report',
    scrollableCopy: true,
    modalCopy: {
      subtitle: 'A moonlit welcome for new students',
      description:
        'I joined Zhang Hanzhi and Yu Jiacheng in an erhu, guzheng and violin trio to open the York Chinese Students and Scholars Association’s welcome for new students. York mayor Margaret Wells and University of York vice-chancellor Tracy Lightfoot welcomed the incoming students, while guests shared advice on study and life in York. Mooncakes brought a taste of home to the gathering.',
    },
  },
  {
    id: 'manchester-mid-autumn-2026',
    date: '2026-09-19',
    venue: 'Manchester Chinatown',
    event: 'Manchester Mid-Autumn Festival · 2026',
    tags: ['performance', 'community'],
    images: ['/images/timeline/manchester-mid-autumn-2026.jpg'],
    imageAlt: 'A performer in red traditional clothing playing guzheng under stage lights.',
    link: 'https://mp.weixin.qq.com/s/41DfVhEGrquzXycF-KkAEQ',
    linkLabel: 'View WeChat coverage',
    externalResources: [
      {
        label: 'Read Xinhua report',
        href: 'https://www.news.cn/20260921/ea47ac3f95a4486594e93a1cf4ae8449/c.html',
      },
      {
        label: 'View Manchester Consulate coverage',
        href: 'https://manchester.china-consulate.gov.cn/chn/xwdt/202609/t20260920_12026496.htm',
      },
      {
        label: 'Watch CCTV News coverage',
        href: 'https://tv.cctv.com/2026/09/25/VIDEX5ALfncoardo4YFy58Kw260925.shtml',
      },
      {
        label: 'Visit official event page',
        href: 'https://www.moonchester.uk/visit',
      },
    ],
    modalCopy: {
      subtitle: 'Mid-Autumn in Manchester Chinatown',
      description:
        'I performed guzheng and contributed to the organisation and delivery of the 2026 Manchester Mid-Autumn Festival in Chinatown, a two-day community celebration bringing Chinese traditional arts, participatory activities and cross-cultural exchange into the city centre.',
    },
  },
  {
    id: 'vision-china-london-2026',
    date: '2026-09-17',
    venue: '1 Great George Street, Westminster, London',
    event: 'Vision China · London',
    tags: ['performance', 'community'],
    images: ['/images/timeline/vision-china-london-2026.jpg'],
    link: 'https://x.com/ChinaDaily/status/2100918603499618368',
    linkLabel: 'View China Daily coverage',
    externalResources: [
      {
        label: 'Read China Daily article',
        href: 'https://cn.chinadaily.com.cn/a/202609/18/WS6aaccfffe4b09a165c78ae63.html',
      },
    ],
    videoLink: 'https://weixin.qq.com/sph/AZ66Cx11GX',
    modalCopy: {
      subtitle: 'Listen to Each Other, Open New Horizons',
      description:
        "I joined the opening musical performance at China Daily's Vision China event in London, bringing together guzheng, erhu and violin in a programme celebrating cultural dialogue and connection.",
    },
  },
  {
    id: 'dragon-boat-festival-2026',
    date: '2026-06-13',
    venue: 'Salford, Greater Manchester',
    event: 'UK Chinese Dragon Boat Festival',
    tags: ['performance', 'community'],
    images: ['/images/timeline/dragon-boat-festival-2026.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/bci-partner-school-performs-at-uk-chinese-dragon-boat-festival/',
    linkLabel: 'Read Business Confucius Institute report',
    externalResources: [
      {
        label: 'View the official festival programme',
        href: 'https://www.dragonboatfestival.uk/',
      },
      {
        label: 'Read Chinese Consulate coverage',
        href: 'https://manchester.china-consulate.gov.cn/eng/xwdt/202607/t20260716_11983417.htm',
      },
    ],
    modalCopy: {
      subtitle: 'Music and community at Salford’s UK Chinese Dragon Boat Festival',
      description:
        'I performed guzheng in the festival’s Chinese cultural programme in Salford, alongside Leeds New Vision Education Chinese School and the Business Confucius Institute.',
    },
  },
  {
    id: 'summer-celebration-2026',
    date: '2026-06-26',
    venue: 'University of Leeds, Wellbeing Hub',
    event: 'Chinese Melody × Indian Dance',
    tags: ['workshop'],
    images: ['/images/timeline/summer-celebration-2026.jpg'],
    link: 'https://www.tickettailor.com/events/leedsuniversity72/2257192',
    linkLabel: 'View event listing',
    externalResources: [
      {
        label: 'Read the Sonic Belonging project report',
        href: 'https://www.healthybuildingsnetwork.org/blog/sonic-belonging.html',
      },
    ],
    modalCopy: {
      subtitle: 'A Chinese and Indian music and dance performance',
      description:
        'I joined Chinese musicians and dancers alongside Indian performers at the University of Leeds Summer Celebration. The programme combined live music, including guzheng and dizi, with Indian dance.',
    },
  },
  {
    id: 'sonic-belonging-2026',
    date: '2026-06-04',
    venue: 'Wellbeing Hub Lounge, University of Leeds',
    event: 'Sonic Belonging · Traditional Chinese Music Performance',
    tags: ['workshop'],
    images: ['/images/timeline/sonic-belonging-2026.jpg'],
    link: 'https://www.healthybuildingsnetwork.org/events/workshops/sonic/sonic.html',
    linkLabel: 'View performance page',
    externalResources: [
      {
        label: 'Read the Sonic Belonging project report',
        href: 'https://www.healthybuildingsnetwork.org/blog/sonic-belonging.html',
      },
    ],
    modalCopy: {
      subtitle: 'Traditional Chinese music in the Wellbeing Hub',
      description:
        'I performed guzheng with an ensemble playing erhu, pipa, dizi and zhongruan, alongside a Chinese classical dancer. The informal lunchtime session invited University of Leeds staff and students to listen and learn about the instruments and their traditions.',
    },
  },
  {
    id: '1',
    date: '2026-06-04',
    venue: 'The Manchester Grammar School',
    event: 'Swire Chinese Language Day · 10th Anniversary',
    tags: ['performance', 'community'],
    images: ['/images/timeline/swire-chinese-language-day-2026.jpg'],
    link: 'https://www.instagram.com/p/DZLekMkCAi8/',
    linkLabel: 'View event post',
    externalResources: [
      {
        label: 'Read a Swire Chinese Language Day reflection',
        href: 'https://www.linkedin.com/pulse/planting-seeds-reflections-from-swire-chinese-language-claudio-gebbia-nirle',
      },
    ],
    modalCopy: {
      subtitle: 'A decade of Chinese language education',
      description:
        'I performed at the 10th Swire Chinese Language Day at The Manchester Grammar School. The anniversary gathering brought together educators and advocates to discuss Mandarin learning and teaching in the UK.',
    },
  },
  {
    id: '19',
    date: '2026-06-15',
    venue: 'University of Leeds',
    event: 'The Silk Road, Brought to Life',
    tags: ['workshop', 'performance'],
    images: ['/images/timeline/silk-road-workshop-2026.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/incredible-musical-workshop-brings-the-silk-road-to-life/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'A musical journey along the Silk Road',
      description:
        'I performed at Ode in Blue and Gold – Exploring the History of the Silk Road, a University of Leeds event organised by Music Management MA students. The programme explored the Silk Road’s history and cultural exchange through live music.',
    },
  },
  {
    id: '2',
    date: '2026-03-15',
    venue: 'York',
    event: '2026 York Chinese New Year Gala',
    tags: ['performance'],
    images: ['/images/timeline/york-spring-gala-2026.jpg'],
    link: 'https://mp.weixin.qq.com/s/3LNQJyK7oWLUuMboLG5xbw',
    linkLabel: 'View York CSSA coverage',
    externalResources: [
      {
        label: 'Read Chinese Consulate report',
        href: 'https://www.cscse.edu.cn/manchester/zytz/2026031723251678498/index.html',
      },
    ],
    modalCopy: {
      subtitle: 'A Spring Festival gala in York',
      description:
        'I performed at the York Chinese Students and Scholars Association’s 2026 Spring Festival Gala on 15 March. More than 600 people, including York’s former mayor and the University of York vice-chancellor, attended the evening of student music and dance.',
    },
  },
  {
    id: '3',
    date: '2026-03-11',
    venue: 'Leeds University Business School',
    event: 'LUBS Global Impact Day · Opening Performance',
    tags: ['performance'],
    images: ['/images/timeline/lubs-global-impact-day-2026.jpeg'],
    link: 'https://students.business.leeds.ac.uk/student-community/gid26/',
    linkLabel: 'View Global Impact Day programme',
    modalCopy: {
      subtitle: 'Music and dance at the first Global Impact Day',
      description:
        'I opened Leeds University Business School’s first Global Impact Day with a guzheng performance alongside Indian dance. The day brought students, staff, alumni and partners together around global learning and community impact.',
    },
  },
  {
    id: '4',
    date: '2026-02-23',
    venue: 'Forest Preparatory School',
    event: 'Forest School Culture Week',
    tags: ['workshop', 'performance'],
    images: ['/images/timeline/forest-school-culture-week-2026.jpg'],
    link: 'https://www.instagram.com/p/DVHAlapDZe-/',
    linkLabel: 'View Culture Week post',
    modalCopy: {
      subtitle: 'Chinese music at Culture Week',
      description:
        'I performed guzheng for pupils at Forest Preparatory School during Culture Week. The visit introduced Chinese music and culture through a live performance and workshop activities.',
    },
  },
  {
    id: '5',
    date: '2026-02-16',
    venue: 'Beeston Village Community Centre, Leeds',
    event: 'Lychee Red · Year of the Horse Celebration',
    tags: ['community', 'workshop', 'performance'],
    images: ['/images/timeline/lychee-red-horse-2026.jpg'],
    link: 'https://southleedslife.com/lychee-red-welcome-the-year-of-the-horse/',
    linkLabel: 'Read South Leeds Life coverage',
    modalCopy: {
      subtitle: 'A Lunar New Year gathering for the Lychee Red community',
      description:
        'Lychee Red welcomed the Year of the Horse at Beeston Village Community Centre with dumpling making, calligraphy, singing, dancing and lantern crafting. I joined the celebration with a guzheng performance for the local Chinese seniors group.',
    },
  },
  {
    id: '6',
    date: '2026-02-14',
    venue: 'Merrion Centre, Leeds',
    event: 'Leeds Chinese New Year Celebration',
    tags: ['performance', 'workshop', 'community'],
    images: ['/images/timeline/leeds-chinese-new-year-2026.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/leeds-biggest-chinese-new-year-celebration-once-again-a-big-success/',
    linkLabel: 'Read Business Confucius Institute report',
    externalResources: [
      {
        label: 'View Merrion Centre event page',
        href: 'https://www.merrioncentre.co.uk/promotions-events/year-of-the-horse',
      },
    ],
    modalCopy: {
      subtitle: 'Year of the Horse celebrations at Merrion Centre',
      description:
        'I performed guzheng during the opening weekend of Leeds’s Chinese New Year programme at Merrion Centre on 14 February. Leeds Chinese Community School led a day of live music, dance and hands-on cultural workshops.',
    },
  },
  {
    id: '7',
    date: '2026-02-01',
    venue: 'Merchant Taylors’ Hall, York',
    event: 'York Residents’ Festival · Chinese New Year Concert',
    tags: ['performance'],
    images: ['/images/timeline/york-resident-festival-2026.jpg'],
    link: 'https://mp.weixin.qq.com/s/3aS-baCHQU16xxy5WQtPKw',
    linkLabel: 'View York CSSA coverage',
    externalResources: [
      {
        label: 'View concert listing',
        href: 'https://www.eventbrite.co.uk/e/free-concert-of-chinese-music-tickets-1980863147999',
      },
      {
        label: 'See Merchant Taylors’ Hall event listing',
        href: 'https://www.merchant-taylors-york.org/whats-on-at-the-hall',
      },
    ],
    modalCopy: {
      subtitle: 'Chinese music at York Residents’ Festival',
      description:
        'I performed with the East Asian Youth Ensemble in a free Chinese music concert at Merchant Taylors’ Hall on 1 February. The 3:30pm concert was part of York Residents’ Festival weekend.',
    },
  },
  {
    id: '8',
    date: '2026-01-19',
    venue: 'Leeds',
    event: 'Chinese Classical Music & Dance Community Workshops',
    tags: ['workshop', 'community'],
    images: ['/images/timeline/bci-community-workshops-2026.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/bci-supports-classical-music-and-dance-workshops-for-the-local-community/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'Chinese classical music and dance with local seniors',
      description:
        'I performed guzheng in a four-week workshop series for the Lychee Red Chinese Seniors Project, organised with the Business Confucius Institute and Health for All. Around 120 people from local Chinese and overseas Chinese communities took part in sessions combining demonstrations with guided participation.',
    },
  },
  {
    id: '9',
    date: '2025-11-13',
    venue: 'Leeds University Union',
    event: 'World Unite Acoustic Session',
    tags: ['performance'],
    images: ['/images/timeline/world-unite-acoustic-2025.jpg'],
    link: 'https://engage.luu.org.uk/events/HBF6W/world-unite-acoustic-session',
    linkLabel: 'View LUU event listing',
    modalCopy: {
      subtitle: 'Chinese folk music with a contemporary arrangement',
      description:
        'At Leeds University Union, I performed Chinese folk music on guzheng, pipa and dizi with piano accompaniment. The WU Fest acoustic session paired traditional instruments with a contemporary arrangement.',
    },
  },
  {
    id: '10',
    date: '2025-09-24',
    venue: 'Leeds University Union',
    event: 'Wu Fest Teaser · Guzheng Performance',
    tags: ['performance'],
    images: ['/images/timeline/wu-fest-teaser-2025.jpg'],
    link: 'https://engage.luu.org.uk/events/HPHYT/wu-fest-teaser-guzheng-performance',
    linkLabel: 'View LUU event listing',
    modalCopy: {
      subtitle: 'A Welcome Week performance ahead of Wu Fest',
      description:
        'I gave a free guzheng performance at the Pyramid Canteen at Leeds University Union during Welcome Week. The session introduced students to the instrument and previewed the November Wu Fest.',
    },
  },
  {
    id: '11',
    date: '2025-07-06',
    venue: 'Anglers Club, Leeds',
    event: 'Leeds Chinese Community School Summer Fair',
    tags: ['community', 'performance', 'workshop'],
    images: ['/images/timeline/lccs-summer-fair-2025.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/lccs-summer-fair-brings-culture-community-and-celebration-to-leeds/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'Music and community at the LCCS Summer Fair',
      description:
        'I opened the Leeds Chinese Community School Summer Fair at the Anglers Club with a guzheng performance. Students and teachers followed with music and dance, and families could try on Hanfu during the community celebration.',
    },
  },
  {
    id: '12',
    date: '2025-06-13',
    venue: 'University of Leeds',
    event: 'Hear China · Sounds of the Yangtze and Yellow Rivers',
    tags: ['performance'],
    images: ['/images/timeline/hear-china-yangtze-yellow-2025.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/hear-china-the-sounds-of-the-yangtze-and-yellow-rivers/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'Music shaped by the Yangtze and Yellow Rivers',
      description:
        'I performed Horse Race, Yi Ethnic Dance, Liuyang River, Jasmine Flower and Colourful Clouds Chasing the Moon during a public lecture on the regions and musical traditions of China’s two great rivers. The University of Leeds event paired research with live music from musicians based in Leeds, York, Manchester and Durham.',
    },
  },
  {
    id: '13',
    date: '2025-03-11',
    venue: 'Leeds University Union',
    event: 'Wu Fest Acoustic Session',
    tags: ['performance'],
    images: ['/images/timeline/wu-fest-acoustic-2025.jpg'],
    link: 'https://engage.luu.org.uk/events/H3738/wu-fest-acoustic-session',
    linkLabel: 'View LUU event listing',
    modalCopy: {
      subtitle: 'An acoustic performance for Wu Fest',
      description:
        'I performed at a Wu Fest acoustic session at Leeds University Union, bringing the guzheng to a live music programme celebrating Chinese culture.',
    },
  },
  {
    id: '14',
    date: '2025-01-29',
    venue: 'Leeds University Business School',
    event: 'Year of the Snake Celebration',
    tags: ['performance'],
    images: ['/images/timeline/leeds-business-chinese-new-year-2024.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/leeds-university-celebrates-the-year-of-the-snake-in-style/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'Welcoming the Year of the Snake at Leeds University Business School',
      description:
        'I performed Spring Festival Suite, Blooming Flowers and the Full Moon, and an arrangement of Auld Lang Syne across two sold-out sessions. The programme also introduced Chinese New Year customs and invited guests to try calligraphy and paper cutting.',
    },
  },
  {
    id: '15',
    date: '2025-01-29',
    venue: 'Harrogate Grammar School',
    event: 'Chinese New Year Workshop & Performance',
    tags: ['workshop', 'performance'],
    images: ['/images/timeline/harrogate-grammar-school-2025.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/chinese-new-year-festivities-light-up-harrogate-grammar-school/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'A guzheng performance for Harrogate Grammar School',
      description:
        'I played traditional Chinese pieces and invited Year 7 pupils to guess familiar Western tunes during a Chinese New Year event for around 300 students. The day also included kite making, painting, paper cutting, Hanfu and Mandarin activities, followed by an evening programme for parents and families.',
    },
  },
  {
    id: '16',
    date: '2024-07-06',
    venue: 'Temple Newsam, Leeds',
    event: 'Lihua Education Chinese School Award Ceremony',
    tags: ['performance', 'community'],
    images: ['/images/timeline/lihua-school-awards-2024.jpg'],
    link: 'https://www.oushinet.com/static/content/qj/qjnews/2024-07-12/1261358645863555807.html',
    linkLabel: 'Read Oushinet report',
    modalCopy: {
      subtitle: 'Student achievements and Chinese cultural performances',
      description:
        'I performed at the Lihua Education Chinese School ceremony at Temple Newsam. Students received awards for their Chinese studies, while pupils and teachers presented Chinese songs, instrumental music and dance for families.',
    },
  },
  {
    id: '17',
    date: '2024-06-09',
    venue: 'Salford Quays, Manchester',
    event: 'Manchester Dragon Boat Festival',
    tags: ['performance'],
    images: ['/images/timeline/manchester-dragon-boat-2024.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/local-chinese-school-perform-at-manchester-dragon-boat-festival-celebrations/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'Chinese music at the UK Dragon Boat Festival',
      description:
        'I performed guzheng at Salford Quays as part of New Vision Education Chinese School’s cultural programme. Students and teachers also presented Chinese dance, choir songs, an instrumental ensemble, folk music and live painting at the festival hosted by the Xinhua Chinese Association.',
    },
  },
  {
    id: '18',
    date: '2024-02-08',
    venue: 'Business Confucius Institute, University of Leeds',
    event: 'Lunar New Year Gala · Year of the Dragon',
    tags: ['performance'],
    images: ['/images/timeline/dragon-new-year-2024-leeds.jpg'],
    link: 'https://confucius.leeds.ac.uk/news/an-intercultural-celebration-to-welcome-the-year-of-the-dragon/',
    linkLabel: 'Read Business Confucius Institute report',
    modalCopy: {
      subtitle: 'Welcoming the Year of the Dragon at Leeds',
      description:
        'I performed guzheng for the Business Confucius Institute’s Lunar New Year gathering at the University of Leeds. Guests heard about Chinese New Year traditions, shared Chinese snacks and tea, and took part in paper cutting and calligraphy.',
    },
  },
]
