export interface BlogHomePost {
  key: 'opportunities' | 'sectorNews' | 'networking'
  slug: string
  imageSrc: string
  readTimeMinutes: number
  /** ISO date YYYY-MM-DD */
  dateISO: string
}

export const blogHomePosts: BlogHomePost[] = [
  {
    key: 'opportunities',
    slug: 'comelson-uzvleri-emekdasliq-imkanlari',
    imageSrc: '/images/abouthome1.jpg',
    readTimeMinutes: 4,
    dateISO: '2025-05-14'
  },
  {
    key: 'sectorNews',
    slug: 'platformada-yeni-terefdasliq-teshebbusleri',
    imageSrc: '/images/abouthome2.jpg',
    readTimeMinutes: 4,
    dateISO: '2025-05-14'
  },
  {
    key: 'networking',
    slug: 'biznes-elaqelerinin-guclenmesi',
    imageSrc: '/images/abouthome3.jpg',
    readTimeMinutes: 4,
    dateISO: '2025-05-14'
  }
]
