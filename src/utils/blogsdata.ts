export interface BlogHomePost {
  key: 'opportunities' | 'sectorNews' | 'networking'
  category: 'networking' | 'tender' | 'events' | 'news'
  slug: string
  imageSrc: string
  readTimeMinutes: number
  /** ISO date YYYY-MM-DD */
  dateISO: string
  content: BlogPostContent
}

export interface BlogPostContentSection {
  title: string
  body: string
}

export interface BlogPostContent {
  title: string
  excerpt: string
  sections: [BlogPostContentSection, BlogPostContentSection, BlogPostContentSection]
}

export function getBlogPostContent(post: BlogHomePost): BlogPostContent {
  return post.content
}

export function getBlogCategoryLabel(category: BlogHomePost['category']) {
  const labels: Record<BlogHomePost['category'], string> = {
    networking: 'Networking',
    tender: 'Tender',
    events: 'Tədbirlərin təşkili',
    news: 'Xəbərlər & Yeniliklər'
  }

  return labels[category]
}

export function getNewsUi() {
  return {
    tabs: {
      all: 'Hamısı',
      networking: 'Networking',
      tender: 'Tender',
      events: 'Tədbirlərin təşkili',
      news: 'Xəbərlər & Yeniliklər'
    },
    searchPlaceholder: 'Axtarın..',
    filterDate: 'Tarix',
    loadMore: 'Daha çox',
    breadcrumbBase: 'Xəbərlər',
    readTime: (minutes: number) => `${minutes} dəq. oxuma vaxtı`,
    publishedLabel: 'Dərc edildi:',
    shareLabel: 'Paylaş:',
    pickedTitlePart1: 'Sizin üçün ',
    pickedTitlePart2: 'Seçdiklərimiz'
  } as const
}

export function getBlogHomeUi() {
  return {
    titleBlack: 'Son ',
    titleGray: 'yeniliklər',
    cta: 'Hamısına bax',
    readTime: (minutes: number) => `${minutes} dəq`
  } as const
}

export function formatBlogPostDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00`)
  const loc = locale === 'az' ? 'az-AZ' : 'en-GB'
  return new Intl.DateTimeFormat(loc, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

export const blogHomePosts: BlogHomePost[] = [
  {
    key: 'opportunities',
    category: 'tender',
    slug: 'comelson-uzvleri-emekdasliq-imkanlari',
    imageSrc: '/images/abouthome1.jpg',
    readTimeMinutes: 4,
    dateISO: '2025-05-14',
    content: {
      title: 'Əməkdaşlıq imkanları',
      excerpt:
        'Comelson platformasında fəaliyyət göstərən şirkətlər üçün yeni əməkdaşlıq imkanları təqdim edildi.',
      sections: [
        {
          title: 'Əməkdaşlıq imkanları',
          body:
            'Comelson platformasında fəaliyyət göstərən şirkətlər üçün yeni əməkdaşlıq imkanları təqdim edildi. Bu təşəbbüs üzvlərin bir-biri ilə daha sıx əlaqə qurmasına şərait yaradır.'
        },
        {
          title: 'Tərəfdaşlıq imkanlarının faydaları',
          body:
            'Tərəfdaşlıq imkanları üzvlərə işlərini genişləndirmək imkanı verir. Hər bir şirkət digər üzvlərlə əlaqə quraraq yeni layihələrə başlaya bilər.'
        },
        {
          title: 'Platforma üzvlərinin aktivliyi',
          body:
            'Comelson üzvləri platformada aktiv iştirak etməyə təşviq olunur. Aktivlik yeni əməkdaşlıq imkanlarını artırır və nəticələri sürətləndirir.'
        }
      ]
    }
  },
  {
    key: 'sectorNews',
    category: 'news',
    slug: 'platformada-yeni-terefdasliq-teshebbusleri',
    imageSrc: '/images/abouthome2.jpg',
    readTimeMinutes: 4,
    dateISO: '2025-05-14',
    content: {
      title: 'Sektor üzrə yeniliklər və tədbirlər',
      excerpt:
        'Sektor üzrə seçilmiş yeniliklər, tədbirlər və əsas dəyişikliklər haqqında qısa icmal.',
      sections: [
        {
          title: 'Yeniliklərə baxış',
          body:
            'Sektor üzrə seçilmiş yeniliklər, tədbirlər və əsas dəyişikliklər haqqında qısa icmal. Bu bölmə biznes mühitində məlumatlı qərar verməyə kömək edir.'
        },
        {
          title: 'Tədbirlər və elanlar',
          body:
            'Comelson icması üçün tədbir elanları, vacib tarixlər və əməkdaşlıq imkanlarını izləyin. Yeniliklər mütəmadi yenilənir.'
        },
        {
          title: 'Nəticə',
          body:
            'Ən son xəbərləri izləyərək şəbəkənizi gücləndirin və yeni imkanları vaxtında dəyərləndirin.'
        }
      ]
    }
  },
  {
    key: 'networking',
    category: 'networking',
    slug: 'biznes-elaqelerinin-guclenmesi',
    imageSrc: '/images/abouthome3.jpg',
    readTimeMinutes: 4,
    dateISO: '2025-05-14',
    content: {
      title: 'Şəbəkələşmə və yeni əlaqələr',
      excerpt:
        'Platformada peşəkarlar və şirkətlər tanış olur, əməkdaşlıq imkanlarını müzakirə edir və yeni tərəfdaşlıqlar qurur.',
      sections: [
        {
          title: 'Şəbəkələşmə',
          body:
            'Platformada peşəkarlar və şirkətlər tanış olur, əməkdaşlıq imkanlarını müzakirə edir və yeni tərəfdaşlıqlar qurur.'
        },
        {
          title: 'Yeni əlaqələr',
          body:
            'Doğru insanlarla doğru zamanda əlaqə qurmaq biznesinizi sürətləndirir. Comelson bu prosesi daha əlçatan edir.'
        },
        {
          title: 'Davamlı inkişaf',
          body:
            'Şəbəkə üzərində qurulan əlaqələr uzunmüddətli əməkdaşlıqlara çevrilir və real nəticələr yaradır.'
        }
      ]
    }
  }
]
