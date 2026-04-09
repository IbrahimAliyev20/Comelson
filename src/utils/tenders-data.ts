export interface TenderRow {
  id: number
  slug: string
  buyerName: string
  subject: string
  category: string
  status: 'active' | 'closed'
  startAt: string
  endAt: string
  about: string[]
  requiredDocuments: string[]
  participationFeeAzN: number
  contactPhone: string
  contactEmail: string
}

export const tendersHomeRows: TenderRow[] = [
  {
    id: 1,
    slug: 'reqemsal-marketinq-xidmetleri-ucun-tender',
    buyerName: 'Rəqəmsal Marketinq Xidmətləri üçün Tender Elanı',
    subject:
      'Yüksək əlçatanlıqlı (high-availability) şəbəkə həllərinin layihələndirilməsi və implementasiyası',
    category: 'Marketinq & Reklam',
    status: 'active',
    startAt: '01.10.2026   18:00',
    endAt: '01.11.2026   18:00',
    about: [
      'Şirkətimiz brendin rəqəmsal kanallarda tanıtımını gücləndirmək məqsədilə peşəkar marketinq tərəfdaşı axtarır. Layihə çərçivəsində sosial media hesablarının idarə olunması, aylıq kontent planının hazırlanması, hədəfli reklam kampaniyalarının qurulması və optimizasiyası, həmçinin nəticələrin analizi və hesabatların təqdim olunması nəzərdə tutulur.',
      'İştirakçılardan oxşar layihələr üzrə təcrübə, portfel nümunələri və təklif olunan strategiyanı əhatə edən plan təqdim etmələri gözlənilir. Əlavə olaraq, KPI-ların müəyyən edilməsi və nəticəyə əsaslanan yanaşma üstünlük kimi qiymətləndiriləcək. Layihənin müddəti ilkin olaraq 3 ay nəzərdə tutulur və uğurlu əməkdaşlıq halında uzadılması mümkündür.'
    ],
    requiredDocuments: [
      'tenderdə iştirak haqqının ödənilməsi barədə bank sənədi;',
      'tender təklifi tender zərflərinin açıldığı tarixdən (13 fevral 2026-cı il) sonra ən azı 45 (qırx beş) bank günü qüvvədə olmalıdır;',
      'iddiaçının Azərbaycan Respublikasında vergilərə və digər icbari ödənişlərə dair yerinə yetirilməsi vaxtı keçmiş öhdəliklərinin olmaması haqqında müvafiq vergi orqanından arayış;',
      'iddiaçının son bir ildəki fəaliyyəti haqqında vergi orqanları tərəfindən təsdiq olunmuş maliyyə hesabatının surəti;',
      'iddiaçının son üç ildəki (əgər daha az müddət fəaliyyət göstərirsə, bütün fəaliyyəti dövründəki) maliyyə vəziyyəti haqqında bank arayışı;',
      'iddiaçının müflis olmaması, mülkiyyəti üzərinə məhkəmə qərarı ilə həbs qoyulmaması, kommersiya fəaliyyətləri dayandırılmaması və bu növ məhkəmə-hüquq prosedurlarına məruz qalmaması barədə arayış;',
      'iddiaçının tam adı, hüquqi statusu, nizamnaməsi, qeydiyyatdan keçdiyi ölkə və bank rekvizitləri;',
      'iddiaçının öz mülahizəsinə uyğun digər sənədlər.'
    ],
    participationFeeAzN: 200,
    contactPhone: '994 70 777 77 77',
    contactEmail: 'info@cubekitagency.com'
  },
  {
    id: 2,
    slug: 'data-merkezi-sebeke-arxitekturasi-tender-2',
    buyerName: 'Data mərkəzi şəbəkə arxitekturasının qurulması üzrə tender',
    subject:
      'Yüksək əlçatanlıqlı (high-availability) şəbəkə həllərinin layihələndirilməsi və implementasiyası',
    category: 'Marketinq & Reklam',
    status: 'active',
    startAt: '01.10.2026   18:00',
    endAt: '01.11.2026   18:00',
    about: [
      'Şirkətimiz brendin rəqəmsal kanallarda tanıtımını gücləndirmək məqsədilə peşəkar tərəfdaş axtarır.',
      'İştirakçılardan oxşar layihələr üzrə təcrübə və portfel nümunələri təqdim etmələri gözlənilir.'
    ],
    requiredDocuments: [
      'tenderdə iştirak haqqının ödənilməsi barədə bank sənədi;',
      'iddiaçının vergi öhdəliklərinin olmaması haqqında arayış;'
    ],
    participationFeeAzN: 200,
    contactPhone: '994 70 777 77 77',
    contactEmail: 'info@cubekitagency.com'
  },
  {
    id: 3,
    slug: 'data-merkezi-sebeke-arxitekturasi-tender-3',
    buyerName: 'Data mərkəzi şəbəkə arxitekturasının qurulması üzrə tender',
    subject:
      'Yüksək əlçatanlıqlı (high-availability) şəbəkə həllərinin layihələndirilməsi və implementasiyası',
    category: 'Marketinq & Reklam',
    status: 'active',
    startAt: '01.10.2026   18:00',
    endAt: '01.11.2026   18:00',
    about: [
      'Şirkətimiz brendin rəqəmsal kanallarda tanıtımını gücləndirmək məqsədilə peşəkar tərəfdaş axtarır.',
      'KPI-ların müəyyən edilməsi və nəticəyə əsaslanan yanaşma üstünlük kimi qiymətləndiriləcək.'
    ],
    requiredDocuments: [
      'tenderdə iştirak haqqının ödənilməsi barədə bank sənədi;',
      'iddiaçının vergi öhdəliklərinin olmaması haqqında arayış;'
    ],
    participationFeeAzN: 200,
    contactPhone: '994 70 777 77 77',
    contactEmail: 'info@cubekitagency.com'
  },
  {
    id: 4,
    slug: 'data-merkezi-sebeke-arxitekturasi-tender-4',
    buyerName: 'Data mərkəzi şəbəkə arxitekturasının qurulması üzrə tender',
    subject:
      'Yüksək əlçatanlıqlı (high-availability) şəbəkə həllərinin layihələndirilməsi və implementasiyası',
    category: 'Marketinq & Reklam',
    status: 'active',
    startAt: '01.10.2026   18:00',
    endAt: '01.11.2026   18:00',
    about: [
      'Şirkətimiz brendin rəqəmsal kanallarda tanıtımını gücləndirmək məqsədilə peşəkar tərəfdaş axtarır.',
      'Layihənin müddəti ilkin olaraq 3 ay nəzərdə tutulur və uğurlu əməkdaşlıq halında uzadılması mümkündür.'
    ],
    requiredDocuments: [
      'tenderdə iştirak haqqının ödənilməsi barədə bank sənədi;',
      'iddiaçının vergi öhdəliklərinin olmaması haqqında arayış;'
    ],
    participationFeeAzN: 200,
    contactPhone: '994 70 777 77 77',
    contactEmail: 'info@cubekitagency.com'
  },
  {
    id: 5,
    slug: 'data-merkezi-sebeke-arxitekturasi-tender-5',
    buyerName: 'Data mərkəzi şəbəkə arxitekturasının qurulması üzrə tender',
    subject:
      'Yüksək əlçatanlıqlı (high-availability) şəbəkə həllərinin layihələndirilməsi və implementasiyası',
    category: 'Marketinq & Reklam',
    status: 'active',
    startAt: '01.10.2026   18:00',
    endAt: '01.11.2026   18:00',
    about: [
      'Şirkətimiz brendin rəqəmsal kanallarda tanıtımını gücləndirmək məqsədilə peşəkar tərəfdaş axtarır.',
      'İştirakçılardan oxşar layihələr üzrə təcrübə və portfel nümunələri təqdim etmələri gözlənilir.'
    ],
    requiredDocuments: [
      'tenderdə iştirak haqqının ödənilməsi barədə bank sənədi;',
      'iddiaçının vergi öhdəliklərinin olmaması haqqında arayış;'
    ],
    participationFeeAzN: 200,
    contactPhone: '994 70 777 77 77',
    contactEmail: 'info@cubekitagency.com'
  }
]

