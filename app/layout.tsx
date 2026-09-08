import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { assetPath } from '@/lib/asset-path';
import { googleAnalyticsMeasurementId, isGoogleAnalyticsConfigured, siteOrigin } from '@/lib/site-integrations';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: assetPath('/favicon.svg') },
  title: 'Orbital Days — 우주 생활 시뮬레이터 개발일지',
  description: '행성 위의 발걸음부터 우주선 안의 일상까지. 스크린샷과 짧은 영상으로 기록하는 우주 생활 시뮬레이터 개발일지.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" className="dark"><body style={{ '--space-background': 'url(' + assetPath('/images/starfield.jpg') + ')' } as CSSProperties}>{children}{isGoogleAnalyticsConfigured() && <script defer src={assetPath('/site-analytics.js')} data-measurement-id={googleAnalyticsMeasurementId} data-site-origin={siteOrigin} />}</body></html>;
}
