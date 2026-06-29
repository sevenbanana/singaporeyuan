'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function VideoPopup() {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const en = useLocale() === 'en';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <li className="leading-6">
      <button
        onClick={() => setOpen(true)}
        className="text-navy/80 transition-colors hover:text-gold-deep"
      >
        <span className="inline-flex items-center gap-2.5 leading-6">
          <span className="text-gold-deep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="3" />
              <path d="M10 9.5l5 2.5-5 2.5z" />
            </svg>
          </span>
          <span>{en ? 'WeChat Channels' : '视频号'}</span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[300px] animate-scale-in rounded-3xl border border-gold/30 bg-cream p-8 text-center shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              aria-label="关闭"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-mist transition-colors hover:bg-navy/5 hover:text-navy"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <span className="eyebrow">视频号 · WeChat Channels</span>
            <h3 className="mt-3 text-lg font-bold text-navy">扫码关注我的视频号</h3>

            <div className="mx-auto mt-5 flex aspect-square w-44 items-center justify-center overflow-hidden rounded-2xl border border-gold/30 bg-white p-3 shadow-card">
              {failed ? (
                <span className="px-3 text-center text-xs leading-relaxed text-mist">
                  视频号二维码
                  <br />
                  video-qr.png
                </span>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/video-qr.png"
                  alt="视频号二维码 新加坡小圆姐"
                  className="h-full w-full object-contain"
                  onError={() => setFailed(true)}
                />
              )}
            </div>

            <p className="mt-4 text-sm font-medium text-navy">新加坡小圆姐</p>
            <p className="mt-1 text-xs leading-relaxed text-gold-deep">
              扫一扫二维码,关注我的视频号
            </p>
          </div>
        </div>
      )}
    </li>
  );
}
