export type EventCategory = 'events' | 'forums' | 'exhibitions'

export interface EventItem {
  id: string
  slug: string
  category: EventCategory
  title: string
  /** dd/mm/yyyy */
  date: string
  /** dd.mm.yyyy */
  publishedDate: string
  imageSrc: string
  about: string[]
  registrationHref: string
}

export const eventsList: EventItem[] = [
  {
    id: 'event-1',
    slug: 'geleceyin-liderleri-ucun-networking-tedbiri-2026',
    category: 'events',
    title: 'Gələcəyin Liderləri üçün Networking Tədbiri 2026!',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome2.jpg',
    about: [
      'Bu tədbir müxtəlif sahələrdə fəaliyyət göstərən peşəkarları, sahibkarları və startap nümayəndələrini bir araya gətirən geniş miqyaslı networking və forum platformasıdır. Tədbirin əsas məqsədi iştirakçılar arasında real biznes əlaqələrinin qurulmasını təşviq etmək və yeni əməkdaşlıq imkanları yaratmaqdır. Gün ərzində keçiriləcək sessiyalar fərqli mövzuları əhatə edərək bazar trendləri, innovasiyalar və inkişaf strategiyaları haqqında dəyərli məlumatlar təqdim edəcək. Panel müzakirələri zamanı sahə üzrə təcrübəli spikerlər öz bilik və təcrübələrini bölüşəcək. İştirakçılar bu sessiyalarda aktiv şəkildə iştirak edərək suallar verə və fikir mübadiləsi apara biləcəklər.',
      'Tədbirin xüsusi hissələrindən biri olan açıq networking zonası iştirakçılara daha sərbəst şəkildə ünsiyyət qurmaq imkanı yaradır. Burada yeni tanışlıqlar qurmaq, potensial tərəfdaşlarla görüşmək və gələcək layihələr üçün əlaqələr yaratmaq mümkündür. Forum formatı sayəsində iştirakçılar yalnız dinləyici deyil, eyni zamanda müzakirələrin bir hissəsi olacaqlar. Tədbir həm fərdi mütəxəssislər, həm də şirkət nümayəndələri üçün uyğun mühit təqdim edir. İştirakçılar öz fəaliyyət sahələrini təqdim edə və yeni imkanlar əldə edə bilərlər.',
      'Bundan əlavə, tədbir çərçivəsində müxtəlif mövzular üzrə interaktiv sessiyalar və qısa təqdimatlar təşkil olunacaq. Bu hissələr iştirakçıların daha praktiki biliklər qazanmasına kömək edir. Tədbirin strukturu elə qurulub ki, hər bir iştirakçı maksimum fayda əldə edə bilsin. İstər yeni başlayanlar, istərsə də təcrübəli mütəxəssislər üçün burada dəyərli kontent mövcuddur. Günün sonunda iştirakçılar həm yeni biliklər, həm də real əlaqələrlə tədbirdən ayrılacaqlar.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'event-2',
    slug: 'networking-tedbiri-2026-2',
    category: 'events',
    title: 'Gələcəyin Liderləri üçün Networking Tədbiri 2026!',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome1.jpg',
    about: [
      'Bu tədbir müxtəlif sahələrdə fəaliyyət göstərən peşəkarları, sahibkarları və startap nümayəndələrini bir araya gətirən geniş miqyaslı networking və forum platformasıdır.',
      'Tədbirin açıq networking zonası iştirakçılara daha sərbəst şəkildə ünsiyyət qurmaq imkanı yaradır və yeni əlaqələr üçün fürsətlər açır.',
      'İnteraktiv sessiyalar və qısa təqdimatlar vasitəsilə iştirakçılar praktiki biliklər qazanır və real əlaqələrlə tədbirdən ayrılır.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'event-3',
    slug: 'networking-tedbiri-2026-3',
    category: 'events',
    title: 'Gələcəyin Liderləri üçün Networking Tədbiri 2026!',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome3.jpg',
    about: [
      'Bu tədbir müxtəlif sahələrdə fəaliyyət göstərən peşəkarları, sahibkarları və startap nümayəndələrini bir araya gətirən geniş miqyaslı networking və forum platformasıdır.',
      'Panel müzakirələri zamanı sahə üzrə təcrübəli spikerlər öz bilik və təcrübələrini bölüşəcək.',
      'İştirakçılar aktiv şəkildə iştirak edərək suallar verə və fikir mübadiləsi apara biləcəklər.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'forum-1',
    slug: 'biznes-forum-sebekelesme-terefdasliq',
    category: 'forums',
    title: 'Biznes Forum: Şəbəkələşmə və Tərəfdaşlıq',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome1.jpg',
    about: [
      'Forum formatında keçirilən bu tədbir iştirakçılara müxtəlif sahələr üzrə müzakirələrə qoşulmaq və yeni tərəfdaşlıqlar qurmaq üçün şərait yaradır.',
      'Sessiyalar bazar trendləri və inkişaf strategiyaları ilə bağlı praktik yanaşmaları təqdim edir.',
      'Açıq networking zonası iştirakçılara daha sərbəst əlaqə qurmaq imkanı verir.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'forum-2',
    slug: 'biznes-forum-sebekelesme-terefdasliq-2',
    category: 'forums',
    title: 'Biznes Forum: Şəbəkələşmə və Tərəfdaşlıq',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome2.jpg',
    about: [
      'Forum formatında keçirilən bu tədbir iştirakçılara müzakirələrə qoşulmaq və yeni tərəfdaşlıqlar qurmaq üçün şərait yaradır.',
      'Sessiyalar bazar trendləri və inkişaf strategiyaları ilə bağlı məlumatlar təqdim edir.',
      'İştirakçılar suallar verə və fikir mübadiləsi apara biləcəklər.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'forum-3',
    slug: 'biznes-forum-sebekelesme-terefdasliq-3',
    category: 'forums',
    title: 'Biznes Forum: Şəbəkələşmə və Tərəfdaşlıq',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome3.jpg',
    about: [
      'Forum formatında keçirilən bu tədbir iştirakçılara yeni tərəfdaşlıqlar qurmaq üçün şərait yaradır.',
      'Panel müzakirələri zamanı spikerlər öz təcrübələrini bölüşəcək.',
      'Networking zonası real əlaqələrin qurulmasına kömək edir.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'exhibition-1',
    slug: 'sergi-yeni-texnologiyalar-innovasiya',
    category: 'exhibitions',
    title: 'Sərgi: Yeni texnologiyalar və innovasiya',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome2.jpg',
    about: [
      'Sərgi formatında keçirilən bu tədbirdə yeni texnologiyalar və innovativ həllər təqdim olunur.',
      'İştirakçılar stendləri gəzərək məhsullarla yaxından tanış ola və nümayişləri izləyə bilərlər.',
      'Yeni əlaqələr və əməkdaşlıq imkanları üçün networking sahəsi mövcuddur.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'exhibition-2',
    slug: 'sergi-yeni-texnologiyalar-innovasiya-2',
    category: 'exhibitions',
    title: 'Sərgi: Yeni texnologiyalar və innovasiya',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome1.jpg',
    about: [
      'Sərgi formatında yeni texnologiyalar və innovativ həllər təqdim olunur.',
      'İştirakçılar stendləri gəzərək məhsullarla yaxından tanış ola bilərlər.',
      'Tərəfdaşlıq imkanları üçün əlaqə qurmaq mümkündür.'
    ],
    registrationHref: '/register'
  },
  {
    id: 'exhibition-3',
    slug: 'sergi-yeni-texnologiyalar-innovasiya-3',
    category: 'exhibitions',
    title: 'Sərgi: Yeni texnologiyalar və innovasiya',
    date: '14/04/2026',
    publishedDate: '06.10.2025',
    imageSrc: '/images/abouthome3.jpg',
    about: [
      'Sərgi formatında yeni texnologiyalar və innovativ həllər təqdim olunur.',
      'Sessiyalar və nümayişlər gün ərzində davam edir.',
      'İştirakçılar yeni biliklər və əlaqələrlə tədbirdən ayrılır.'
    ],
    registrationHref: '/register'
  }
]

