import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import {
  googleAnalyticsMeasurementId,
  isGoogleAnalyticsConfigured,
  siteOrigin,
} from '@/lib/site-integrations';
import './globals.css';
const description =
  '작은 행성에서 운석 하나로 시작하는 이야기. 곡괭이, 첫 제작대와 채굴 드론까지 — ORBITAL FALL의 실제 플레이 과정과 개발 기록.';
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: 'ORBITAL FALL — 작은 행성에서 시작하는 이야기',
    template: '%s | ORBITAL FALL',
  },
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'ORBITAL FALL — 작은 행성에서 시작하는 이야기',
    description,
    locale: 'ko_KR',
    type: 'website',
    images: [
      { url: '/media/journal/pickaxe-wide.webp', width: 1280, height: 722 },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-theme="dark" data-astryx-theme="orbital">
      <body>
        <Providers>{children}</Providers>
        {isGoogleAnalyticsConfigured() && (
          <script
            defer
            src="/site-analytics.js"
            data-measurement-id={googleAnalyticsMeasurementId}
            data-site-origin={siteOrigin}
          />
        )}
      </body>
    </html>
  );
}
