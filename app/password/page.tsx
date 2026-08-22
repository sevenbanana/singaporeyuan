import PasswordField from './PasswordField';

// 全站密码输入页:表单直接 POST 到 /api/password,只有「显示密码」用到客户端 JS
export default function PasswordPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string };
}) {
  const from = searchParams.from ?? '/';
  const hasError = searchParams.error === '1';

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-10 md:px-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-40px_rgba(26,39,68,0.35)] md:rounded-[36px]">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
          {/* 左:表单 */}
          <div className="p-8 sm:p-11 md:p-14">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gold/[0.07] py-1.5 pl-1.5 pr-4 text-sm font-semibold text-gold-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatar-round.png"
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              />
              新加坡小圆姐 · 客户专属
            </span>

            <h1 className="mt-7 flex items-center gap-3 text-4xl font-black tracking-tight text-navy sm:text-[2.75rem]">
              欢迎回来
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="#F6C9BC"
                stroke="#E8927C"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-1 shrink-0"
              >
                <path d="M12 20.3C7.2 16.5 3.5 13.2 3.5 9.2 3.5 6.4 5.6 4.5 8 4.5c1.6 0 3 .8 4 2.1 1-1.3 2.4-2.1 4-2.1 2.4 0 4.5 1.9 4.5 4.7 0 4-3.7 7.3-8.5 11.1z" />
              </svg>
            </h1>

            <p className="mt-4 text-[15px] leading-[1.9] text-navy-600">
              这是小圆姐为客户准备的专属网站。
              <br />
              为保护客户资料与专属内容，请输入站点密码。
            </p>

            <form method="POST" action="/api/password" className="mt-8">
              <input type="hidden" name="from" value={from} />
              <label
                htmlFor="site-password"
                className="mb-2.5 block text-sm font-bold text-navy"
              >
                站点密码
              </label>
              <PasswordField />

              {hasError && (
                <p
                  role="alert"
                  className="mt-3 flex items-center gap-2 text-sm font-medium text-[#b5503c]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5.5M12 16.4h.01" />
                  </svg>
                  密码不正确，再试一次；或者找我要一次新的。
                </p>
              )}

              <button
                type="submit"
                className="group mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-navy py-4 text-base font-bold text-white transition-all duration-300 hover:bg-navy-700 hover:shadow-[0_14px_30px_-14px_rgba(26,39,68,0.7)]"
              >
                进入网站
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>

            <div className="mt-10 flex items-center gap-4">
              <span className="h-px flex-1 bg-sand-200" />
              <span className="text-sm text-mist">还没有密码？</span>
              <span className="h-px flex-1 bg-sand-200" />
            </div>

            <p className="mt-5 text-center text-[15px] font-bold text-navy">
              联系小圆姐索取
              <span className="border-b-2 border-gold/70 pb-0.5">站点密码</span>
            </p>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50/70 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 11.8A8.3 8.3 0 0 1 8.9 19L3.5 20.5 5 15.2A8.3 8.3 0 1 1 21 11.8z" />
                    <path d="M8.5 11.8h.01M12.2 11.8h.01M15.9 11.8h.01" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <b className="block text-sm font-bold text-navy">微信</b>
                  <span className="block text-sm text-mist">singaporeyuan</span>
                </span>
              </div>

              <a
                href="https://wa.me/6583750190?text=%E4%BD%A0%E5%A5%BD%E5%B0%8F%E5%9C%86%E5%A7%90%EF%BC%8C%E6%83%B3%E8%A6%81%E4%B8%80%E4%B8%8B%E7%BD%91%E7%AB%99%E7%9A%84%E8%AE%BF%E9%97%AE%E5%AF%86%E7%A0%81%E3%80%82"
                className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50/70 px-4 py-3.5 no-underline transition-colors duration-300 hover:border-gold/60 hover:bg-gold/[0.07]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5.5 4H9l1.6 4.3L8.5 10a12.5 12.5 0 0 0 5.5 5.5l1.7-2.1L20 15v3.6A1.6 1.6 0 0 1 18.2 20C10.8 19.2 4.8 13.2 4 5.8A1.6 1.6 0 0 1 5.5 4z" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <b className="block text-sm font-bold text-navy">WhatsApp</b>
                  <span className="block text-sm text-mist">+65 8375 0190</span>
                </span>
              </a>
            </div>
          </div>

          {/* 右:插画 */}
          <div className="relative hidden items-end justify-center bg-sand-50 px-6 pb-12 pt-8 md:flex lg:pb-16">
            <span
              aria-hidden="true"
              className="absolute inset-y-10 left-0 w-px bg-sand-200"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/password/welcome-door.webp"
              alt={'小圆姐在门口挥手'}
              width={720}
              height={1245}
              className="h-auto w-full max-w-[270px] lg:max-w-[320px] xl:max-w-[360px]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
