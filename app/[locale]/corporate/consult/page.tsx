import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import CorporateConsultForm from '@/components/CorporateConsultForm';
import PageHero, { ContentLayer } from '@/components/PageHero';

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
const IconChat = (
  <svg {...ico}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.48 8.48 0 0 1 21 11.5z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" /></svg>
);
const IconWa = (
  <svg {...ico}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.48 8.48 0 0 1 21 11.5z" /><path d="M9 9.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4l.6 1.4c0 .2 0 .4-.1.5l-.4.5c-.1.1-.2.3 0 .5.3.6 1.2 1.5 2 1.8.2.1.4.1.5 0l.5-.5c.2-.2.3-.1.5-.1l1.3.7c.2.1.3.2.3.3 0 .4-.2 1-.5 1.2-.3.2-1 .5-1.8.2-1.9-.6-3.5-2.3-4.2-4.1-.2-.7 0-1.4.1-1.7z" /></svg>
);
const IconMail = (
  <svg {...ico}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 5.5L20 7" /></svg>
);
const IconDoc = (
  <svg {...ico}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 13h6M9 16.5h4" /></svg>
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'corporateConsult' });
  return { title: t('metaTitle') };
}

export default async function CorporateConsultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'corporateConsult' });
  const steps = t.raw('sideSteps') as string[];

  return (
    <>
      <PageHero eyebrow={t('heroEyebrow')} title={t('heroTitle')} subtitle={t('heroSub')} />
      <ContentLayer>
        <div className="container-wide py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* 表单 */}
            <div className="card p-6 md:p-9">
              <CorporateConsultForm />
            </div>

            {/* 侧栏 */}
            <aside className="space-y-6">
              {/* 提交后流程 */}
              <div className="card p-6">
                <h2 className="text-base font-black text-navy">{t('sideTitle')}</h2>
                <ul className="mt-4 space-y-4">
                  {steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-navy/80">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 直接联系 */}
              <div className="card p-6">
                <h2 className="text-base font-black text-navy">{t('directTitle')}</h2>
                <ul className="mt-4 space-y-3 text-sm text-navy/80">
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold-deep">{IconChat}</span>
                    <span>WeChat: singaporeyuan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold-deep">{IconWa}</span>
                    <a href="https://wa.me/6583750190" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-deep">
                      WhatsApp: +65 8375 0190
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold-deep">{IconMail}</span>
                    <a href="mailto:yuanyuan@aia.com.sg" className="transition-colors hover:text-gold-deep">
                      yuanyuan@aia.com.sg
                    </a>
                  </li>
                </ul>
              </div>

              {/* 准备材料 */}
              <div className="card border-gold/40 bg-gold/10 p-6">
                <h2 className="flex items-center gap-2 text-base font-black text-navy">
                  <span className="text-gold-deep">{IconDoc}</span>
                  {t('prepTitle')}
                </h2>
                <p className="mt-3 text-sm leading-[1.9] text-navy/75">{t('prepText')}</p>
              </div>
            </aside>
          </div>
        </div>
      </ContentLayer>
    </>
  );
}
