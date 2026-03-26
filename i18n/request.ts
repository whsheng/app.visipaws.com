import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // 如果 locale 不在支持的列表中，使用默认语言
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    locale = defaultLocale;
  }
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
