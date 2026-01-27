'use client';

import { useEffect } from 'react';

type AdFormat = 'horizontal' | 'square';

interface AdBannerProps {
  slot: string;  // 광고 슬롯 ID (AdSense에서 발급)
  format?: AdFormat;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const adStyles: Record<AdFormat, React.CSSProperties> = {
  horizontal: { display: 'inline-block', width: '100%', maxWidth: '728px', height: '90px' },
  square: { display: 'inline-block', width: '100%', maxWidth: '450px', height: '450px' },
};

const placeholderStyles: Record<AdFormat, string> = {
  horizontal: 'h-[90px] max-w-[728px]',
  square: 'h-[450px] max-w-[450px]',
};

export default function AdBanner({
  slot,
  format = 'horizontal',
}: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // 개발 중이거나 슬롯이 설정되지 않은 경우 플레이스홀더 표시
  if (!slot || slot.includes('XXXXXXXXXX')) {
    return (
      <div className={`${placeholderStyles[format]} w-full bg-gray-800/80 rounded-lg flex items-center justify-center text-gray-500 text-xs border border-gray-700/50`}>
        <span className="tracking-widest">AD BANNER</span>
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={adStyles[format]}
      data-ad-client="ca-pub-8269395390841538"
      data-ad-slot={slot}
    />
  );
}
