export interface ApiResponse<T> {
      status: boolean;
      message: string;
      lang?: string;
      timestamp?: string;
      data: T;
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

/** GET /company-categories — siyahı elementi */
export interface CompanyCategoryResponse {
  id: number;
  name: string;
}

export interface ActivityResponse {
  name: string;
}

export interface MemberResponse {
    image: string;
    thumb_image: string;
    company: string;
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
  notify_by_email: boolean
  is_active: boolean
  created_at: string
  updated_at: string
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
}

/** Hesab → Şirkətlərim — siyahı / detal / redaktə kartı */
export interface CompanyCard {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
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