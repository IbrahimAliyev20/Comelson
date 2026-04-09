export type SuccessStoryKey = 'cubekit' | 'ventureOne' | 'biznet'

export interface SuccessStorySlide {
  key: SuccessStoryKey
  slug: string
  /** YouTube video id (`v` on watch URLs) */
  youtubeVideoId: string
}

export interface SuccessStoryMessageKeys {
  logo: string
  company: 'successStoriesItems.cubekit.company' | 'successStoriesItems.ventureOne.company' | 'successStoriesItems.biznet.company'
  quote: 'successStoriesItems.cubekit.quote' | 'successStoriesItems.ventureOne.quote' | 'successStoriesItems.biznet.quote'
  author: 'successStoriesItems.cubekit.author' | 'successStoriesItems.ventureOne.author' | 'successStoriesItems.biznet.author'
  role: 'successStoriesItems.cubekit.role' | 'successStoriesItems.ventureOne.role' | 'successStoriesItems.biznet.role'
}

export const successStoriesSlides: SuccessStorySlide[] = [
  {
    key: 'cubekit',
    slug: 'cubekit',
    youtubeVideoId: 'dQw4w9WgXcQ'
  },
  {
    key: 'ventureOne',
    slug: 'venture-one',
    youtubeVideoId: 'dQw4w9WgXcQ'
  },
  {
    key: 'biznet',
    slug: 'biznet',
    youtubeVideoId: 'dQw4w9WgXcQ'
  }
]

export function youtubeEmbedSrc(videoId: string) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1'
  })
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`
}

export function getSuccessStoryBySlug(slug: string) {
  return successStoriesSlides.find((x) => x.slug === slug)
}

export function getSuccessStoryMessageKeys(key: SuccessStoryKey): SuccessStoryMessageKeys {
  switch (key) {
    case 'cubekit':
      return {
        logo: '/images/Logo.svg',
        company: 'successStoriesItems.cubekit.company',
        quote: 'successStoriesItems.cubekit.quote',
        author: 'successStoriesItems.cubekit.author',
        role: 'successStoriesItems.cubekit.role'
      }
    case 'ventureOne':
      return {
        logo: '/images/Logo.svg',
        company: 'successStoriesItems.ventureOne.company',
        quote: 'successStoriesItems.ventureOne.quote',
        author: 'successStoriesItems.ventureOne.author',
        role: 'successStoriesItems.ventureOne.role'
      }
    case 'biznet':
      return {
        logo: '/images/Logo.svg',
        company: 'successStoriesItems.biznet.company',
        quote: 'successStoriesItems.biznet.quote',
        author: 'successStoriesItems.biznet.author',
        role: 'successStoriesItems.biznet.role'
      }
  }
}
