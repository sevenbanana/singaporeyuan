import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/lib/routing';

export default async function RootPage() {
  // 读取浏览器 Accept-Language,自动判断语言
  const acceptLang = (await headers()).get('accept-language') || '';
  const prefersEnglish =
    acceptLang.toLowerCase().split(',')[0].trim().startsWith('en');
  const locale = prefersEnglish ? 'en' : routing.defaultLocale;
  redirect(`/${locale}`);
}
