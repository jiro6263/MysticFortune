'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;  // 광고 슬롯 ID (AdSense에서 발급)
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({
  slot,
  format = 'horizontal',
  responsive = true
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
      <div className="h-[50px] bg-gray-800/80 rounded-lg flex items-center justify-center text-gray-500 text-xs border border-gray-700/50">
        <span className="tracking-widest">AD BANNER</span>
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', minHeight: '50px' }}
      data-ad-client="ca-pub-8269395390841538"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}
