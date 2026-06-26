'use client';

import { useState } from 'react';

// 显示微信二维码;若 /wechat-qr.png 尚未放置,则优雅降级为占位框
export default function WeChatQR({ caption }: { caption: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex aspect-square w-44 items-center justify-center overflow-hidden rounded-sm border border-navy/15 bg-white">
        {failed ? (
          <span className="px-3 text-center text-xs leading-relaxed text-mist">
            微信二维码
            <br />
            wechat-qr.png
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/wechat-qr.png"
            alt={caption}
            className="h-full w-full object-contain"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <p className="mt-3 w-44 text-center text-xs leading-relaxed text-mist">
        {caption}
      </p>
    </div>
  );
}
