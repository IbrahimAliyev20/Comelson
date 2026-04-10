import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['az', 'en', 'tr', 'ru'],

  defaultLocale: 'az',
  
  localeDetection: false,
  
  localePrefix: 'as-needed'
});
