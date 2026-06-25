import { useTranslations } from 'next-intl';
import { Link } from '@/lib/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="border-t border-gold/20 bg-sand-100">
      <div className="container-wide py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold text-navy">{nav('brand')}</p>
            <p className="mt-3 text-sm text-gold-deep">{t('tagline')}</p>
            <p className="mt-6 text-xs leading-relaxed text-mist">
              {t('org')}
              <br />
              {t('rnf')}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-gold-deep">
              {t('contactTitle')}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-navy/80">
              <li>{t('wechat')}</li>
              <li>
                <a href="mailto:yuanyuan@aia.com.sg" className="transition-colors hover:text-gold-deep">
                  {t('email')}
                </a>
              </li>
              <li>{t('phone')}</li>
              <li>{t('xhs')}</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-gold-deep">
              {nav('brand')}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-navy/80">
              <li><Link href="/about" className="transition-colors hover:text-gold-deep">{nav('about')}</Link></li>
              <li><Link href="/services" className="transition-colors hover:text-gold-deep">{nav('services')}</Link></li>
              <li><Link href="/cases" className="transition-colors hover:text-gold-deep">{nav('cases')}</Link></li>
              <li><Link href="/consult" className="transition-colors hover:text-gold-deep">{nav('consult')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gold/20 pt-8">
          <p className="text-xs leading-relaxed text-mist">{t('disclaimer')}</p>
          <p className="mt-4 text-xs text-mist">{t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
