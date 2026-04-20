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