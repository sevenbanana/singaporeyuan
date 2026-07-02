import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileCta from '@/components/MobileCta';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === 'en';
  return {
    title: {
      default: en
        ? 'Yuan Yuan · Asset Allocation Adviser in Singapore'
        : '袁媛 Yuan Yuan · 新加坡资产配置顾问',
      template: en ? '%s | Yuan Yuan SG' : '%s | 新加坡小圆姐',
    },
    description: en
      ? 'Asset allocation adviser in Singapore and global MDRT member, insurance and financial planning for families settling in Singapore. With expertise and patience, growing richer day by day.'
      : '新加坡资产配置顾问,全球 MDRT 百万圆桌会员。陪在新加坡生活的家庭,做保险与理财规划，用专业和耐心,陪你一起日富一日。',
    alternates: { languages: { zh: '/zh', en: '/en' } },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileCta />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
