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