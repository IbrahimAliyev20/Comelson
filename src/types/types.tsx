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