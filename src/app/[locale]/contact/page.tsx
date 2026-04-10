import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import ContactSection from '@/components/sections/ContactSection'
import { getServerLocale } from '@/lib/utils';
import { getServerQueryClient } from '@/providers/server';
import { getBreadcrumbsQuery } from '@/services/hero/queries';
import { getContactQuery } from '@/services/contact/queries';

export default async function ContactPage() {
  const locale = await getServerLocale();
  const queryClient = getServerQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(getBreadcrumbsQuery(locale)),
    queryClient.prefetchQuery(getContactQuery(locale))
  ]);

  const contactData = queryClient.getQueryData(getContactQuery(locale).queryKey);
  const heroData = queryClient.getQueryData(getBreadcrumbsQuery(locale).queryKey);
  const hero = heroData?.data?.find((x) => x.name?.toLowerCase?.() === 'contact');
  const title = hero?.title || 'Əlaqə';
  const description = hero?.desciption || 'Bizimlə əlaqə saxlayın və müraciət edin';
  const image = hero?.image || '/images/genericherobg.png';
  return (
    <div>
      <GenericPageHeroSection
        image={image}
        title={title}
        description={description}
      />
      <ContactSection contact={contactData?.data} />
    </div>
  )
}
