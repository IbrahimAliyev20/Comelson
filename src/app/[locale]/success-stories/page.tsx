import SuccessStories from '@/components/sections/SuccessStories'
import { getServerLocale } from '@/lib/utils';
import { getServerQueryClient } from '@/providers/server';
import { getSuccessStoriesQuery } from '@/services/success-stories/queries';

export default async function SuccessStoriesPage() {
  const locale = await getServerLocale();
  const queryClient = getServerQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(getSuccessStoriesQuery(locale)),
  ]);
  const successStories = queryClient.getQueryData(getSuccessStoriesQuery(locale).queryKey)?.data;
  return (
    <div>
        <SuccessStories successStories={successStories} />
    </div>
  )
}
