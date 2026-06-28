// 深蓝底块上的圆形纹理装饰(全站统一的圆形语言)。
// 用法:父容器加 `relative overflow-hidden`,内容包一层 `relative`,本组件置于其前。
export default function NavyDecor() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-gold/25" />
      <div aria-hidden className="pointer-events-none absolute -right-8 top-6 h-44 w-44 rounded-full border border-gold/15" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-cream/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-10 left-10 h-28 w-28 rounded-full border border-gold/10" />
      <div aria-hidden className="pointer-events-none absolute right-1/3 top-10 h-2 w-2 rounded-full bg-gold/50" />
    </>
  );
}
