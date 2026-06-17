import { getTranslations } from 'next-intl/server';

import MembersSection from '@/components/sections/MembersSection'
import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import { getServerLocale } from '@/lib/utils';
import { getServerQueryClient } from '@/providers/server';
import { getCompanyCategoriesQuery } from '@/services/company-categories/queries';
import { getBreadcrumbsQuery } from '@/services/hero/queries';
import { getCountriesQuery, getMembersQuery } from '@/services/members/queries';
import type { GetMembersParams } from '@/services/members/api';

function parseId(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return undefined
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ category_id?: string; country_id?: string; search?: string }>
}) {
  const sp = await searchParams
  const locale = await getServerLocale();
  const t = await getTranslations('membersPage');
  const queryClient = getServerQueryClient();

  const searchValue =
    typeof sp.search === 'string' ? sp.search.trim() : ''
  const filters: GetMembersParams = {
    ...(parseId(sp.country_id) ? { country_id: parseId(sp.country_id) } : {}),
    ...(parseId(sp.category_id) ? { category_id: parseId(sp.category_id) } : {}),
    ...(searchValue ? { search: searchValue } : {}),
  }

  await Promise.all([
    queryClient.prefetchQuery(getBreadcrumbsQuery(locale)),
    queryClient.prefetchQuery(getMembersQuery(locale, filters)),
    queryClient.prefetchQuery(getCompanyCategoriesQuery(locale)),
    queryClient.prefetchQuery(getCountriesQuery(locale)),
  ]);

  const members = queryClient.getQueryData(getMembersQuery(locale, filters).queryKey)?.data;
  const categories = queryClient.getQueryData(getCompanyCategoriesQuery(locale).queryKey);
  const countries = queryClient.getQueryData(getCountriesQuery(locale).queryKey);
  const heroData = queryClient.getQueryData(getBreadcrumbsQuery(locale).queryKey);
  const hero = heroData?.data?.find((x) => x.name?.toLowerCase?.() === 'members');
  const title = hero?.title || t('defaultTitle');
  const description = hero?.desciption || t('defaultDescription');
  const image = hero?.image || '/images/genericherobg.png';
  return (
    <div>
        <GenericPageHeroSection
        image={image}
        title={title}
        description={description}
      />
      <MembersSection
        members={members}
        categories={categories}
        countries={countries}
        initialFilters={filters}
      />
    </div>
  )
}
