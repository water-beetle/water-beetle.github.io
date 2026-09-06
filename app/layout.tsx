import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: 'Orbital Days — 우주 생활 시뮬레이터 개발일지',
  description: '우주선 안의 일상부터 새로운 정거장까지. 스크린샷과 짧은 영상으로 기록하는 우주 생활 시뮬레이터 개발일지.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" className="dark"><body>{children}</body></html>;
}
