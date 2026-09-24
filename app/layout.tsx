import type { Metadata } from 'next';
import { assetPath } from '@/lib/asset-path';
import { googleAnalyticsMeasurementId, isGoogleAnalyticsConfigured, siteOrigin } from '@/lib/site-integrations';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: assetPath('/favicon.svg') },
  title: 'Orbital Days — 우주 생활 시뮬레이터 개발일지',
  description: 'Unreal로 만드는 작은 행성 생활 게임. 집, 우주선, 운석과 지형을 구현하며 남긴 개발 기록.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}{isGoogleAnalyticsConfigured() && <script defer src={assetPath('/site-analytics.js')} data-measurement-id={googleAnalyticsMeasurementId} data-site-origin={siteOrigin} />}</body></html>;
}
