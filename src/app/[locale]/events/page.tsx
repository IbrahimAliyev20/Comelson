import EventsSection from '@/components/sections/EventsSection'
import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import { getServerLocale } from '@/lib/utils';
import { getServerQueryClient } from '@/providers/server';
import { getEventCategoriesQuery, getEventsQuery } from '@/services/events/queries';
import { getBreadcrumbsQuery } from '@/services/hero/queries';

export default async function EventsPage() {
  const locale = await getServerLocale();
  const queryClient = getServerQueryClient();
  await Promise.all([

    queryClient.prefetchQuery(getEventCategoriesQuery(locale)),
    queryClient.prefetchQuery(getEventsQuery(locale, 1)),
    queryClient.prefetchQuery(getBreadcrumbsQuery(locale))
  
  ]);

  const eventCategoriesData = queryClient.getQueryData(getEventCategoriesQuery(locale).queryKey);
  const eventsData = queryClient.getQueryData(getEventsQuery(locale, 1).queryKey);
  const heroData = queryClient.getQueryData(getBreadcrumbsQuery(locale).queryKey);
  const hero = heroData?.data?.find((x) => x.name?.toLowerCase?.() === 'events');
  const title = hero?.title || 'Tədbirlər və Forumlar';
  const description = hero?.desciption || 'Comelson şirkətləri bir araya gətirərək əməkdaşlıq, tərəfdaşlıq və yeni imkanlar üçün güclü bir biznes şəbəkəsi yaradır.';
  const image = hero?.image || '/images/genericherobg.png';

  return (
    <div>
        <GenericPageHeroSection
        image={image}
        title={title}
        description={description}
      />
      <EventsSection eventCategories={eventCategoriesData?.data} events={eventsData?.data} />
    </div>
  )
}
