'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/lib/routing';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/cases', label: t('cases') },
    { href: '/services', label: t('services') },
    // 小工具与文章统一收进资源中心,/tools 由资源中心内的卡片进入
    { href: '/resources', label: t('resources') },
    { href: '/consult', label: t('consult') },
  ] as const;

  const otherLocale = locale === 'zh' ? 'en' : 'zh';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-gold/20 bg-cream/85 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-wide flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label={t('brand')} className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={locale === 'en' ? '/logo-en.svg' : '/logo.svg'} alt={t('brand')} className="h-8 w-auto md:h-9" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active =
              l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium tracking-wide transition-colors hover:text-gold-deep ${
                  active ? 'text-gold-deep' : 'text-navy/75'
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
          <Link
            href={pathname}
            locale={otherLocale}
            className="rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-semibold tracking-wide text-gold-deep transition-all hover:bg-gold/10"
          >
            {t('langSwitch')}
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 rounded-full bg-navy transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 rounded-full bg-navy transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 rounded-full bg-navy transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold/20 bg-cream/95 backdrop-blur-md md:hidden">
          <div className="container-wide flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium tracking-wide text-navy/80 transition-colors hover:text-gold-deep"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              onClick={() => setOpen(false)}
              className="mt-2 inline-block w-fit rounded-lg border border-gold/40 px-4 py-2 text-xs font-semibold tracking-wide text-gold-deep"
            >
              {t('langSwitch')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
