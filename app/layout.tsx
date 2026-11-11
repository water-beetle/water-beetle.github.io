import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { googleAnalyticsMeasurementId, isGoogleAnalyticsConfigured, siteOrigin } from '@/lib/site-integrations';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL(siteOrigin),
 title: {default:'ORBITAL FALL 개발 기록', template:'%s | ORBITAL FALL'},
 description:'작은 행성에서 운석을 캐고 공장을 만드는 게임. 행성 지형, 중력, 우주선, 생산과 UI의 실제 구현을 이미지로 소개합니다.',
 icons:{icon:'/favicon.svg'},
 openGraph:{title:'ORBITAL FALL 개발 기록',description:'지금까지 만든 기능과 48장의 실제 구현 화면.',locale:'ko_KR',type:'website',images:[{url:'/media/features/home-01.webp',width:1600,height:900}]},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 return <html lang="ko" data-theme="dark" data-astryx-theme="neutral"><body><Providers>{children}</Providers>{isGoogleAnalyticsConfigured() && <script defer src="/site-analytics.js" data-measurement-id={googleAnalyticsMeasurementId} data-site-origin={siteOrigin}/>}</body></html>;
}
