
import { SuccessStoriesResponse } from '@/types/types'
import StroiesCardSections from './StroiesCardSections'
import SuccessStroiesSlider from './SuccessStroiesSlider'


export default function SuccessStories({ successStories }: { successStories: SuccessStoriesResponse[] | undefined }) {

  return (
    <section className="bg-white py-8 md:py-[70px] flex flex-col gap-10">
      <SuccessStroiesSlider successStories={successStories} />
      <StroiesCardSections successStories={successStories} />
    </section>
  )
}
