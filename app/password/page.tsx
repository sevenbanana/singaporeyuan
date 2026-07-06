// 全站密码输入页:纯 HTML 表单提交到 /api/password,无需客户端 JS
export default function PasswordPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string };
}) {
  const from = searchParams.from ?? '/';
  const hasError = searchParams.error === '1';

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-navy">访问验证</h1>
        <p className="mt-2 text-sm text-navy-600">
          本站点已启用访问保护,请输入访问密码。
          <br />
          This site is password protected.
        </p>

        <form method="POST" action="/api/password" className="mt-6 space-y-4">
          <input type="hidden" name="from" value={from} />
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="访问密码 / Password"
            className="w-full rounded-lg border border-sand-300 px-4 py-2.5 text-navy outline-none focus:border-gold"
          />
          {hasError && (
            <p className="text-sm text-red-600">
              密码不正确,请重试。 / Incorrect password.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-navy px-4 py-2.5 font-medium text-white transition-colors hover:bg-navy-700"
          >
            进入网站 / Enter
          </button>
        </form>
      </div>
    </main>
  );
}
