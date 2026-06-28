'use client';

import { useState, useEffect } from 'react';

export default function WechatPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <li>
      <button
        onClick={() => setOpen(true)}
        className="text-navy/80 transition-colors hover:text-gold-deep"
      >
        <span className="inline-flex items-center gap-2.5">
          <span className="text-gold-deep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <span>Wechat: singaporeyuan</span>
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

            <span className="eyebrow">微信 · WeChat</span>
            <h3 className="mt-3 text-lg font-bold text-navy">扫码添加我的微信</h3>

            <div className="mx-auto mt-5 w-44 rounded-2xl border border-gold/30 bg-white p-3 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/wechat-qr.png" alt="微信二维码 singaporeyuan" className="h-full w-full object-contain" />
            </div>

            <p className="mt-4 text-sm font-medium text-navy">微信号:singaporeyuan</p>
            <p className="mt-1 text-xs leading-relaxed text-gold-deep">
              扫码添加微信,请备注:网站咨询
            </p>
          </div>
        </div>
      )}
    </li>
  );
}
