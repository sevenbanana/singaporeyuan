'use client';

import { useState } from 'react';

export default function PasswordField() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" />
          <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
          <path d="M12 15v2.2" />
        </svg>
      </span>

      <input
        id="site-password"
        type={show ? 'text' : 'password'}
        name="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="输入密码"
        className="w-full rounded-2xl border border-sand-300 bg-sand-50/60 py-4 pl-12 pr-12 text-[15px] text-navy outline-none transition-colors duration-300 placeholder:text-mist/70 focus:border-gold focus:bg-white"
      />

      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? '隐藏密码' : '显示密码'}
        aria-pressed={show}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-mist transition-colors duration-300 hover:bg-sand-100 hover:text-navy"
      >
        {show ? (
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2 2 0 0 0 2.8 2.8" />
            <path d="M9.4 5.4A9.5 9.5 0 0 1 12 5c5 0 9 4.5 9 7 0 .9-.6 2.1-1.6 3.3M6.3 6.9C4 8.4 3 10.4 3 12c0 2.5 4 7 9 7 1.3 0 2.5-.3 3.5-.8" />
          </svg>
        ) : (
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7c0 2.5-4 7-9 7s-9-4.5-9-7z" />
            <circle cx="12" cy="12" r="2.6" />
          </svg>
        )}
      </button>
    </div>
  );
}
