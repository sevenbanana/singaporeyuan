export default function UnlockPage({
  searchParams,
}: {
  searchParams: { error?: string; from?: string };
}) {
  const hasError = searchParams.error === '1';
  const from = searchParams.from ?? '/';

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-md p-8 md:p-10">
        <p className="eyebrow">Private Preview</p>
        <div className="rule-gold mt-3" />
        <h1 className="mt-5 text-2xl font-bold text-navy">
          本站暂未公开
          <span className="mt-1 block text-base font-medium text-ink/60">
            This site is password protected
          </span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          请输入访问密码后继续浏览。
          <br />
          Please enter the access password to continue.
        </p>

        <form method="POST" action="/api/unlock" className="mt-6 space-y-4">
          <input type="hidden" name="from" value={from} />
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="访问密码 / Password"
            className="w-full rounded-xl border border-gold/40 bg-white/80 px-4 py-3 text-navy
                       outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          {hasError && (
            <p className="text-sm font-medium text-red-600">
              密码不正确,请重试。 / Incorrect password, please try again.
            </p>
          )}
          <button type="submit" className="btn-primary w-full">
            进入网站 / Enter
          </button>
        </form>
      </div>
    </main>
  );
}
