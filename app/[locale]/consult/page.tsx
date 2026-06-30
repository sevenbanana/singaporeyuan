import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { useTranslations, useLocale } from 'next-intl';
import ConsultForm from '@/components/ConsultForm';
import WeChatQR from '@/components/WeChatQR';
import Faq from '@/components/Faq';
import PageHero, { ContentLayer } from '@/components/PageHero';
import { IconQuote } from '@/components/icons';

const ico = {
  width: 19,
  height: 19,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
const IconChat = () => (
  <svg {...ico}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.48 8.48 0 0 1 21 11.5z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" /></svg>
);
const IconWa = () => (
  <svg {...ico}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.48 8.48 0 0 1 21 11.5z" /><path d="M9 9.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4l.6 1.4c0 .2 0 .4-.1.5l-.4.5c-.1.1-.2.3 0 .5.3.6 1.2 1.5 2 1.8.2.1.4.1.5 0l.5-.5c.2-.2.3-.1.5-.1l1.3.7c.2.1.3.2.3.3 0 .4-.2 1-.5 1.2-.3.2-1 .5-1.8.2-1.9-.6-3.5-2.3-4.2-4.1-.2-.7 0-1.4.1-1.7z" /></svg>
);
const IconMail = () => (
  <svg {...ico}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 5.5L20 7" /></svg>
);
const IconPhone = () => (
  <svg {...ico}><path d="M5 4h3l1.5 4.5L7.5 10a12 12 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
const IconBook = () => (
  <svg {...ico}><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5z" /><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5z" /></svg>
);

type Contact = { key: string; href?: string; external?: boolean; Icon: () => JSX.Element };
const CONTACTS: Contact[] = [
  { key: 'wechat', Icon: IconChat },
  { key: 'whatsapp', href: 'https://wa.me/6583750190', external: true, Icon: IconWa },
  { key: 'email', href: 'mailto:yuanyuan@aia.com.sg', Icon: IconMail },
  { key: 'phone', href: 'tel:+6583750190', Icon: IconPhone },
  { key: 'xhs', Icon: IconBook },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'consult' });
  return { title: t('metaTitle') };
}

export default async function ConsultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Consult />;
}

function Consult() {
  const t = useTranslations('consult');
  const f = useTranslations('footer');
  const en = useLocale() === 'en';
  const processSteps = t.raw('processSteps') as string[];

  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('intro')}
        accent={<IconQuote width="100%" height="100%" />}
      />

      <ContentLayer>
      <section className="container-wide grid gap-12 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        {/* Form */}
        <div>
          {/* 提交后会发生什么 */}
          <div className="mb-10 rounded-sm border border-gold/30 bg-gold/5 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-navy">
              {t('processTitle')}
            </h2>
            <ol className="mt-5 space-y-4">
              {processSteps.map((s, i) => (
                <li key={i} className="flex gap-3.5 text-sm leading-relaxed text-navy/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-cream">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <ConsultForm />
        </div>

        {/* Alt contact */}
        <aside className="md:border-l md:border-navy/10 md:pl-12">
          <h2 className="text-lg font-semibold text-navy">
            {t('altContactTitle')}
          </h2>

          <div className="mt-6 divide-y divide-navy/[0.07] rounded-sm border border-navy/10 bg-white/55">
            {CONTACTS.filter((ct) => !(en && ct.key === 'xhs')).map(({ key, href, external, Icon }) => {
              const raw = f(key);
              const ci = raw.search(/[:：]/);
              const label = ci >= 0 ? raw.slice(0, ci) : '';
              const value = ci >= 0 ? raw.slice(ci + 1).trim() : raw;
              const inner = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-navy/[0.05] text-navy transition-colors group-hover:bg-gold/15 group-hover:text-gold-deep">
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-mist">
                      {label}
                    </span>
                    <span className="block truncate text-sm font-semibold text-navy">
                      {value}
                    </span>
                  </span>
                  {href && (
                    <span className="text-mist/40 transition-all group-hover:translate-x-0.5 group-hover:text-gold-deep">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                    </span>
                  )}
                </>
              );
              const cls = 'group flex items-center gap-4 p-4 transition-colors hover:bg-gold/[0.035]';
              return href ? (
                <a
                  key={key}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={cls}
                >
                  {inner}
                </a>
              ) : (
                <div key={key} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>

          {/* QR code */}
          <WeChatQR caption={t('qrCaption')} />
        </aside>
      </section>

      {/* FAQ */}
      <section className="bg-cream">
        <div className="container-wide border-t border-navy/10 py-16 md:py-20">
          <h2 className="section-title">{t('faqTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">
            {t('faqIntro')}
          </p>
          <div className="mt-10 max-w-3xl">
            <Faq />
          </div>
        </div>
      </section>
      </ContentLayer>
    </>
  );
}
