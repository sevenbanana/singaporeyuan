'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/routing';

// 移动端底部轻量固定 CTA;桌面端隐藏,保持高级感
export default function MobileCta() {
  const t = useTranslations('nav');

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-cream/90 backdrop-blur-md md:hidden">
      <div className="container-wide flex gap-3 py-3">
        <Link
          href="/consult"
          className="flex flex-1 items-center justify-center rounded-xl border border-navy/20 py-2.5 text-sm font-semibold text-navy transition-colors active:bg-navy/5"
        >
          {t('ctaWechat')}
        </Link>
        <Link
          href="/consult"
          className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-gold-deep to-gold py-2.5 text-sm font-semibold text-white"
        >
          {t('ctaBook')}
        </Link>
      </div>
    </div>
  );
}
