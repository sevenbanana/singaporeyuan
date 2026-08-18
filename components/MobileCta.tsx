'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/routing';

// 移动端底部轻量固定 CTA;桌面端隐藏。
// 左键:中文=微信二维码弹窗,英文=WhatsApp 二维码弹窗;右键:联系沟通。
export default function MobileCta() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const en = locale === 'en';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const qrSrc = en ? '/whatsapp-qr.png' : '/wechat-qr.png';
  const qrLabel = en ? 'WhatsApp' : t('ctaWechat');
  const eyebrow = en ? 'WhatsApp' : '微信 · WeChat';
  const title = en ? 'Scan to chat on WhatsApp' : '扫码添加我的微信';
  const note = en
    ? 'Scan with your phone camera to start a WhatsApp chat.'
    : '扫码添加微信,请备注:网站咨询';
  const handle = en ? 'WhatsApp · Singapore Yuan' : '微信号:singaporeyuan';

  return (
    <>
      <div
        data-mobile-cta
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-cream/90 backdrop-blur-md md:hidden"
      >
        <div className="container-wide flex gap-3 py-3">
          <button
            onClick={() => setOpen(true)}
            className="flex flex-1 items-center justify-center rounded-xl border border-navy/20 py-2.5 text-sm font-semibold text-navy transition-colors active:bg-navy/5"
          >
            {qrLabel}
          </button>
          <Link
            href="/consult"
            className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-gold-deep to-gold py-2.5 text-sm font-semibold text-white"
          >
            {t('ctaBook')}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[300px] animate-scale-in rounded-3xl border border-gold/30 bg-cream p-8 text-center shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label={en ? 'Close' : '关闭'}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-mist transition-colors hover:bg-navy/5 hover:text-navy"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <span className="eyebrow">{eyebrow}</span>
            <h3 className="mt-3 text-lg font-bold text-navy">{title}</h3>

            <div className="mx-auto mt-5 w-44 rounded-2xl border border-gold/30 bg-white p-3 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt={qrLabel} className="h-full w-full object-contain" />
            </div>

            <p className="mt-4 text-sm font-medium text-navy">{handle}</p>
            <p className="mt-1 text-xs leading-relaxed text-gold-deep">{note}</p>
          </div>
        </div>
      )}
    </>
  );
}
