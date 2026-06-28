import type { ReactNode } from 'react';
import HeroDecor from '@/components/HeroDecor';

// 内容页首屏:适中高度 + 简约「大圆小圆」装饰背景(米白/金色,统一品牌圆形语言)
// 不再使用大图/视差;标题淡入动画保留。
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string; // 兼容旧调用,已不使用
  accent?: ReactNode; // 页面专属装饰元素(如计算器图标)
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-cream via-sand-50 to-sand-100">
      {/* 大圆小圆装饰 + 轻微滚动视差 */}
      <HeroDecor accent={accent} />

      <div className="container-wide relative py-20 md:py-24">
        <div className="max-w-[600px]">
          <p className="eyebrow animate-fade-up">{eyebrow}</p>
          <h1
            className="mt-5 animate-fade-up text-4xl font-black leading-[1.3] text-navy md:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-6 max-w-xl animate-fade-up text-base leading-[1.95] text-mist md:text-lg"
              style={{ animationDelay: '160ms' }}
            >
              {subtitle}
            </p>
          )}
          {children && (
            <div className="mt-8 animate-fade-up" style={{ animationDelay: '240ms' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// 内容层:米白底(去掉顶部金线)
export function ContentLayer({ children }: { children: ReactNode }) {
  return <div className="relative z-10 bg-cream">{children}</div>;
}
