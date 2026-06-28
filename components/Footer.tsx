import { useTranslations } from 'next-intl';
import { Link } from '@/lib/routing';
import type { SVGProps } from 'react';
import WechatPopup from '@/components/WechatPopup';
import VideoPopup from '@/components/VideoPopup';

const ic = (p: SVGProps<SVGSVGElement>) => ({
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
});

const IconWhats = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ic(p)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const IconMail = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ic(p)}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
);
const IconLinkedIn = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ic(p)}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);
const IconBook = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ic(p)}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
);

function Row({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) {
  const content = (
    <span className="inline-flex items-center gap-2.5 leading-6">
      <span className="text-gold-deep">{icon}</span>
      <span>{label}</span>
    </span>
  );
  return (
    <li className="leading-6">
      {href ? (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-navy/80 transition-colors hover:text-gold-deep"
        >
          {content}
        </a>
      ) : (
        <span className="text-navy/80">{content}</span>
      )}
    </li>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="border-t border-gold/20 bg-sand-100">
      <div className="container-wide py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* 品牌 */}
          <div>
            <p className="text-xl font-bold text-navy">{nav('brand')}</p>
            <p className="mt-3 text-sm text-gold-deep">{t('tagline')}</p>
            <p className="mt-6 text-sm leading-relaxed text-navy/70">
              {t('credline')}
              <br />
              {t('rnf')}
            </p>
          </div>

          {/* 联系方式 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-gold-deep">
              {t('contactTitle')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <WechatPopup />
              <Row icon={<IconWhats />} label="+65 8375 0190" href="https://wa.me/6583750190" />
              <Row icon={<IconMail />} label="yuanyuan@aia.com.sg" href="mailto:yuanyuan@aia.com.sg" />
            </ul>
          </div>

          {/* 关注我 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-gold-deep">
              {t('followTitle')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <Row icon={<IconBook />} label="小红书 · 新加坡小圆姐" href="https://xhslink.com/m/9KS9V4ytFmj" />
              <Row icon={<IconBook />} label="小红书 · 图文笔记" href="https://xhslink.com/m/2eFS3jpJutg" />
              <Row icon={<IconLinkedIn />} label="LinkedIn" href="https://www.linkedin.com/in/singaporeyuan/" />
              <VideoPopup />
            </ul>
          </div>

          {/* 快速链接 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-gold-deep">
              {nav('brand')}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-navy/80">
              <li className="leading-6"><Link href="/about" className="transition-colors hover:text-gold-deep">{nav('about')}</Link></li>
              <li className="leading-6"><Link href="/cases" className="transition-colors hover:text-gold-deep">{nav('cases')}</Link></li>
              <li className="leading-6"><Link href="/services" className="transition-colors hover:text-gold-deep">{nav('services')}</Link></li>
              <li className="leading-6"><Link href="/tools" className="transition-colors hover:text-gold-deep">{nav('tools')}</Link></li>
              <li className="leading-6"><Link href="/consult" className="transition-colors hover:text-gold-deep">{nav('consult')}</Link></li>
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
