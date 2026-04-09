
import { SuccessStoriesResponse } from '@/types/types'
import StroiesCardSections from './StroiesCardSections'
import SuccessStroiesSlider from './SuccessStroiesSlider'


export default function SuccessStories({ successStories }: { successStories: SuccessStoriesResponse[] | undefined }) {

  return (
    <section className="bg-white pb-16 pt-8 sm:pb-[72px] sm:pt-10 flex flex-col gap-10">
      <SuccessStroiesSlider successStories={successStories} />
      <StroiesCardSections successStories={successStories} />
    </section>
  )
}
