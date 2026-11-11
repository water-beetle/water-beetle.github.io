'use client';
import type { ReactNode } from 'react';
import { AppShell } from '@astryxdesign/core/AppShell';
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import { Layout, LayoutContent, HStack, VStack } from '@astryxdesign/core/Layout';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Link } from '@astryxdesign/core/Link';
import { Divider } from '@astryxdesign/core/Divider';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Orbit, ArrowUp, ArrowUpRight } from 'lucide-react';
import { googleAnalyticsDashboard, isGoogleAnalyticsConfigured } from '@/lib/site-integrations';

export function SiteHeader() {
  return <TopNav label="주 메뉴"
    heading={<TopNavHeading logo={<Orbit size={28} aria-hidden="true"/>} heading="ORBITAL FALL" subheading="개발 기록" headingHref="/"/>}
    startContent={<><TopNavItem label="구현한 기능" href="/#features"/><TopNavItem label="개발 현황" href="/#progress"/></>}
    endContent={<Button label="GitHub" href="https://github.com/water-beetle" target="_blank" rel="noopener noreferrer" icon={<ArrowUpRight size={20}/>} isIconOnly variant="ghost"/>}/>
}

export function SiteFooter() {
  return <VStack as="footer" gap={6} paddingBlock={6}>
    <Divider/>
    <HStack gap={6} hAlign="between" vAlign="center" wrap="wrap">
      <VStack gap={1}><Heading level={3}>ORBITAL FALL</Heading><Text type="supporting" color="secondary">© {new Date().getFullYear()} water-beetle · Unreal Engine 프로젝트</Text></VStack>
      <HStack gap={4} vAlign="center" wrap="wrap"><Link href="https://github.com/water-beetle" isExternalLink>GitHub</Link>{isGoogleAnalyticsConfigured() && <Link href={googleAnalyticsDashboard} isExternalLink>방문 통계 · 관리자</Link>}<Button label="맨 위로" href="#top" icon={<ArrowUp size={18}/>} variant="secondary"/></HStack>
    </HStack>
    <Collapsible trigger="통계와 댓글 안내"><VStack gap={3}><Text type="body" color="secondary">방문 통계는 Google Analytics를 사용합니다. DNT 또는 GPC 설정이 켜져 있으면 통계 태그를 실행하지 않으며, 이름·이메일·GitHub 계정 정보를 추가 전송하지 않습니다. 댓글은 giscus와 GitHub Discussions를 사용합니다.</Text><Link href="https://policies.google.com/technologies/partner-sites?hl=ko" isExternalLink>Google 데이터 처리 안내</Link></VStack></Collapsible>
  </VStack>;
}

export function SiteShell({children}: {children: ReactNode}) {
  return <AppShell id="top" height="auto" variant="section" contentPadding={0} topNav={<SiteHeader/>} className="space-shell">
    <Layout height="auto" contentWidth={1200} content={<LayoutContent padding={6} isScrollable={false}><VStack id="main" gap={10}>{children}<SiteFooter/></VStack></LayoutContent>}/>
  </AppShell>;
}
