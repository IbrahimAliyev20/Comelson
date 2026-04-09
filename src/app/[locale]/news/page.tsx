import NewsSection from '@/components/sections/NewsSection'
import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import { getServerLocale } from '@/lib/utils';
import { getServerQueryClient } from '@/providers/server';
import { getBreadcrumbsQuery } from '@/services/hero/queries';



export default async function NewsPage() {
  const locale = await getServerLocale();
  const queryClient = getServerQueryClient();
  await Promise.all([queryClient.prefetchQuery(getBreadcrumbsQuery(locale))]);
  const heroData = queryClient.getQueryData(getBreadcrumbsQuery(locale).queryKey);
  const hero = heroData?.data?.find((x) => x.name?.toLowerCase?.() === 'news');
  const title = hero?.title || 'Xəbərlər';
  const description = hero?.desciption || 'Comelson şirkətləri bir araya gətirərək əməkdaşlıq, tərəfdaşlıq və yeni imkanlar üçün güclü bir biznes şəbəkəsi yaradır.';
  const image = hero?.image || '/images/genericherobg.png';
  return (
    <div>
        <GenericPageHeroSection
        image={image}
        title={title}
        description={description}
      />
      <NewsSection />
    </div>
  )
}
