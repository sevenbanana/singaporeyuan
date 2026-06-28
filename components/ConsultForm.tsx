'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ConsultForm() {
  const t = useTranslations('consult');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'succeeded' | 'failed'>('idle');

  const identityOptions = t.raw('identityOptions') as string[];
  const interestOptions = t.raw('interestOptions') as string[];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xnjkpqrz', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      form.reset();
      setStatus('succeeded');
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'succeeded') {
    return (
      <div className="rounded-sm border border-gold/40 bg-gold-pale/40 p-10 text-center">
        <p className="text-xl text-navy">{t('success')}</p>
      </div>
    );
  }

  const labelCls = 'block text-sm font-medium text-navy';
  const reqCls = 'ml-1 text-xs text-gold-deep';
  const inputCls =
    'mt-2 w-full rounded-sm border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-mist/60 focus:border-gold';

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Name */}
      <div>
        <label htmlFor="name" className={labelCls}>
          {t('fName')}
          <span className={reqCls}>* {t('required')}</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t('fNamePh')}
          className={inputCls}
        />
      </div>

      {/* Contact group */}
      <div>
        <label className={labelCls}>
          {t('fContact')}
          <span className={reqCls}>* {t('required')}</span>
        </label>
        <p className="mt-1 text-xs text-mist">{t('fContactNote')}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <input
            name="wechat"
            type="text"
            placeholder={t('fWechat')}
            className={inputCls.replace('mt-2 ', '')}
          />
          <input
            name="email"
            type="email"
            placeholder={t('fEmail')}
            className={inputCls.replace('mt-2 ', '')}
          />
          <input
            name="phone"
            type="tel"
            placeholder={t('fPhone')}
            className={inputCls.replace('mt-2 ', '')}
          />
        </div>
      </div>

      {/* Identity */}
      <div>
        <label htmlFor="identity" className={labelCls}>
          {t('fIdentity')}
        </label>
        <select id="identity" name="identity" className={inputCls} defaultValue="">
          <option value="" disabled>
            —
          </option>
          {identityOptions.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Interests (multi) */}
      <div>
        <label className={labelCls}>{t('fInterests')}</label>
        <p className="mt-1 text-xs text-mist">{t('interestsNote')}</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {interestOptions.map((o, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-navy/80"
            >
              <input
                type="checkbox"
                name="interests[]"
                value={o}
                className="h-4 w-4 rounded-sm border-navy/30 text-gold focus:ring-gold"
              />
              {o}
            </label>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelCls}>
          {t('fMessage')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={t('fMessagePh')}
          className={inputCls}
        />
      </div>

      {/* PDPA consent */}
      <div className="rounded-sm border border-navy/10 bg-cream/60 p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-navy/30 text-gold focus:ring-gold"
          />
          <span className="text-sm font-medium text-navy">
            {t('consentText')}
            <span className={reqCls}>* {t('required')}</span>
          </span>
        </label>
        <p className="mt-3 pl-7 text-xs leading-relaxed text-mist">
          {t('consentDetail')}
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>

      {status === 'failed' && (
        <p className="text-sm text-red-600">
          {t('submitError', { default: '提交失败,请稍后再试。' })}
        </p>
      )}
    </form>
  );
}
