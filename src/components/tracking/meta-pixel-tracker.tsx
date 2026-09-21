'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { trackPixel } from '@/lib/meta-pixel';
import { PublicTrackingConfig } from '@/lib/tracking-config';

export default function MetaPixelTracker() {
  const [config, setConfig] = useState<PublicTrackingConfig | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadTrackingConfig() {
      try {
        const res = await fetch('/api/settings/tracking');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setConfig(json.data);
          }
        }
      } catch (err) {
        console.warn('Không thể tải cấu hình tracking:', err);
      }
    }

    loadTrackingConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lắng nghe click tự động vào các nút gọi điện & Zalo trên toàn trang
  useEffect(() => {
    if (!config?.isEnabled || !config?.pixelId) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        trackPixel('Contact', {
          method: 'phone_call',
          href,
        });
      } else if (href.includes('zalo.me')) {
        trackPixel('Contact', {
          method: 'zalo_chat',
          href,
        });
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [config]);

  if (!config?.isEnabled || !config?.pixelId) {
    return null;
  }

  const pixelId = config.pixelId;

  return (
    <>
      <Script
        id="meta-pixel-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
