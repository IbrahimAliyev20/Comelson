export interface ApiResponse<T> {
      status: boolean;
      message: string;
      lang?: string;
      timestamp?: string;
      data: T;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface SettingsResponse {
      siteLogo: string;
      siteFooterLogo: string;
      favicon: string;
      siteDarkLogo: string;
}

export interface BreadcrumbResponse {
      name: string;
      title: string;
      desciption: string;
      image: string;
      thumb_image: string;
}

export interface StatisticsResponse {
  title: string;
  number: string;
  image: string;
}

export interface SliderResponse {
   title: string;
   description: string;
   btn: string;
   btn_link: string;
   image: string;
   thumb_image: string;
}

export interface AboutResponse {
      title: string, 
      description: string,
      short_desciption: string,
      image_1: string,
      thumb_image_1: string,
      image_2: string,
      thumb_image_2: string,
      image_3: string,
      thumb_image_3: string
}

export interface FormLogoResponse {
  link: string;
  image: string;
  thumb_image: string;
}

export interface PartnershipsResponse {
      plan: string;
      price: string;
      title: string;
      description: string;
      most_popular: number;

}

export interface SuccessStoriesResponse {
      image: string;
      thumb_image: string;
      name: string;
      profession: string;
      comment: string;
      link: string;
      video_image?: string | null;
      slug: string;
      meta_title: string;
      meta_keywords: string;
      meta_description: string;
}

export interface ContactResponse {
  phone: string;
  email: string;
  address: string;
  map: string;
}

export interface SocialMediaResponse {
      link: string;
      image: string;
      thumb_image: string;
}


export interface EventCategoriesResponse {
  id?: number;
  name: string;
  slug: string;
}

export interface EventResponse {
  name: string;
  read_time?: string;
  slug: string;
  image: string;
  thumb_image: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  created_at: string;
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
}


export interface BlogCategoryResponse {
  name: string;
  slug: string;
}

export interface BlogResponse {    
      image: string;
      thumb_image: string;
      title: string;
      slug: string;
      read_time: string;
      description: string;
      created_at?: string;
      
      category: {
        id: number;
        name: string;
      };
      meta_title: string;
      meta_keywords: string;
      meta_description: string;
}

export interface CountryResponse {
  id: number;
  name: string;
  flag: string; 
}

export interface CompanyCategoryResponse {
  id: number;
  name: string;
}

export interface ActivityResponse {
  name: string;
}

export interface MemberResponse {
    id?: number;
    image?: string;
    thumb_image?: string;
    company?: string;
    logo_url?: string;
    profil?: string;
    name?: string;
    catalog: string;
    description: string;
    slug: string;
    email: string;
    phone: string;
    activity: {
        id: number;
        name: string;
    };
    country: {
        id: number;
        name: string;
    };
    meta_title: string;
    meta_keywords: string;
    meta_description: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  voen: string;
  category: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
    flag: string;
  };
  description: string;
  logo_url: string;
  profil?: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  created_at: string;
  updated_at: string;
  status: number;
}

export interface TenderCategoryResponse {
  id: number
  name: Record<string, string>
  created_at: string
  updated_at: string
}

export type LocalizedName = Record<string, string>

export interface TenderCompanyResponse {
  id: number
  user_id: number
  category_id: number
  name: string
  voen: string
  country_id: number
  description: string
  logo: string
  phone: string
  email: string
  address: string
  status: number
  website: string
  instagram: string
  facebook: string
  linkedin: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface TenderCountryResponse {
  id: number
  name: LocalizedName
  flag: string
  lang_code: string
  created_at: string
  updated_at: string
}

export interface TenderResponse {
  id: number
  user_id: number
  title: string
  slug: string
  start_date: string
  end_date: string
  city?: string
  company_id?: number
  description: string
  required_documents: string
  contact_name?: string
  contact_address?: string
  contact_position: string
  contact_email: string
  contact_phone: string
  contact_instagram: string
  contact_facebook: string
  contact_linkedin: string
  contact_twitter: string
  category: TenderCategoryResponse
  company?: TenderCompanyResponse
  country?: TenderCountryResponse
  notify_by_email: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Public `all-tenders` endpoint response item.
 * Differences from `TenderResponse`:
 * - `user_id` can be null
 * - `category` can be null
 * - some contact fields can be null
 */
export interface PublicTenderResponse {
  id: number
  user_id: number | null
  title: string
  slug: string
  start_date: string
  end_date: string
  description: string
  required_documents: string
  contact_name: string | null
  contact_position: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_instagram: string | null
  contact_facebook: string | null
  contact_linkedin: string | null
  contact_twitter: string | null
  category: { id: number; name: Record<string, string> | string } | null
  company: { name: string | null; logo_url: string | null } | null
  notify_by_email: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PublicTenderDetailData {
  tender: PublicTenderResponse
  other_tenders: PublicTenderResponse[]
}

/** POST /tenders — JSON body */
export interface CreateTenderPayload {
  title: string
  category_id: number
  country_id: number
  start_date: string
  end_date: string
  company_id: number
  description: string
  required_documents: string
  contact_name: string
  contact_position: string
  contact_email: string
  contact_phone: string
  contact_instagram: string
  contact_facebook: string
  contact_linkedin: string
  contact_twitter: string
  notify_by_email: boolean
}

export interface ApiPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface ApiPaginationMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ApiPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: ApiPaginationMetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  links: ApiPaginationLinks;
  meta: ApiPaginationMeta;
}

/** POST /companies — multipart/form-data (logo faylı ilə) */
export interface CreateCompanyPayload {
  name: string;
  voen: string;
  category_id: number;
  country_id: number;
  description: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  /** Şirkət loqosu — server `logo` açarı ilə gözləyir */
  logo?: File | Blob | null;
  profil?: File | Blob | null;
}

/** Hesab → Şirkətlərim — siyahı / detal / redaktə kartı */
export interface CompanyCard {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  profil?: string;
  /** API: CompanyResponse.status */
  status?: number;
  voen?: string;
  country?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}
