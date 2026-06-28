import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import ConsultForm from '@/components/ConsultForm';
import WeChatQR from '@/components/WeChatQR';
import Faq from '@/components/Faq';

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
  const processSteps = t.raw('processSteps') as string[];

  return (
    <>
      <section className="bg-navy text-cream">
        <div className="container-wide py-20 md:py-24">
          <span className="eyebrow text-gold">{t('eyebrow')}</span>
          <h1 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">
            {t('title')}
          </h1>
          <div className="my-7 rule-gold" />
          <p className="max-w-3xl text-base leading-[1.9] text-cream/85">
            {t('intro')}
          </p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        {/* Form */}
        <div>
          {/* 提交后会发生什么 */}
          <div className="mb-10 rounded-sm border border-gold/30 bg-gold/5 p-6 md:p-8">
            <h2 className="font-serif text-lg font-semibold text-navy">
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
          <h2 className="font-serif text-lg font-semibold text-navy">
            {t('altContactTitle')}
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-navy/80">
            <li>💬 {f('wechat')}</li>
            <li>
              📲{' '}
              <a
                href="https://wa.me/6583750190"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-deep"
              >
                {f('whatsapp')}
              </a>
            </li>
            <li>
              📧{' '}
              <a
                href="mailto:yuanyuan@aia.com.sg"
                className="transition-colors hover:text-gold-deep"
              >
                yuanyuan@aia.com.sg
              </a>
            </li>
            <li>📱 {f('phone')}</li>
            <li>📕 {f('xhs')}</li>
          </ul>

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
    </>
  );
}
