export type SuccessStoryKey = 'cubekit' | 'ventureOne' | 'biznet'

export interface SuccessStorySlide {
  key: SuccessStoryKey
  /** YouTube video id (`v` on watch URLs) */
  youtubeVideoId: string
}

export const successStoriesSlides: SuccessStorySlide[] = [
  {
    key: 'cubekit',
    youtubeVideoId: 'dQw4w9WgXcQ'
  },
  {
    key: 'ventureOne',
    youtubeVideoId: 'dQw4w9WgXcQ'
  },
  {
    key: 'biznet',
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
