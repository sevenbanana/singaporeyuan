import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import ConsultForm from '@/components/ConsultForm';

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

          {/* QR placeholder */}
          <div className="mt-8 flex aspect-square w-40 items-center justify-center rounded-sm border border-dashed border-navy/20 text-center text-xs text-mist">
            微信二维码占位
            <br />
            wechat-qr.png
          </div>
        </aside>
      </section>
    </>
  );
}
