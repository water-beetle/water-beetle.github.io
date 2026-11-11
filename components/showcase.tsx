'use client';
// Adapted from Astryx 0.7.13 official centered-hero and product-gallery templates.
// Layout, typography, spacing, cards, navigation and actions use native components.
import { VStack, HStack, Layout, LayoutContent, LayoutHeader } from '@astryxdesign/core/Layout';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Section } from '@astryxdesign/core/Section';
import { ArrowDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/site-chrome';
import { StatusBadge } from '@/components/status-badge';
import { features, featureHref, imageCount } from '@/lib/features';

export function Showcase() {
  const home=features.find(feature=>feature.slug==='home')!;
  return <SiteShell>
    <VStack as="section" gap={8} paddingBlock={10} aria-labelledby="hero-title">
      <VStack gap={6} hAlign="center">
        <Badge label="Unreal Engine · 개발 중"/>
        <VStack gap={4} hAlign="center"><Heading id="hero-title" level={1} type="display-2" justify="center" textWrap="balance">운석을 캐고, 공장을 만듭니다.</Heading><Text as="p" type="large" color="secondary" justify="center" textWrap="balance">작은 행성에 첫 작업장을 만들고, 공장에서 키운 우주선으로 다음 행성을 개척하는 게임.</Text><Text as="p" type="body" color="secondary" justify="center">지금까지 구현한 기능을 실제 화면과 함께 정리했습니다.</Text></VStack>
        <HStack gap={3} hAlign="center" vAlign="center" wrap="wrap"><Button label="구현한 기능 보기" href="#features" variant="primary" size="lg" endContent={<ArrowDown size={18}/>}/><Button label="최신 집 둘러보기" href={featureHref('home')} variant="secondary" size="lg" endContent={<ArrowUpRight size={18}/>}/></HStack>
        <HStack gap={3} hAlign="center" wrap="wrap"><Badge label={`${features.length}개 구현 주제`}/><Badge label={`실제 화면 ${imageCount}장`}/></HStack>
      </VStack>
      <VStack as="figure" gap={3}><Card padding={0}><AspectRatio ratio={16/9}><img className="media-fill" src={home.media[0].src} alt="우주 하늘 아래 P01의 현재 목조 시작 주택" width={home.media[0].width} height={home.media[0].height} fetchPriority="high"/></AspectRatio></Card><Text as="p" type="supporting" color="secondary" justify="center">P01 시작 주택 · 2026.11.10 촬영</Text></VStack>
    </VStack>
    <VStack as="section" id="features" gap={6} aria-labelledby="features-title">
      <VStack gap={3}><Heading level={2} id="features-title">지금까지 만든 것들</Heading><Text as="p" type="body" color="secondary">8개 주제로 정리한 구현 소개입니다. 궁금한 기능을 열면 설명과 실제 화면을 볼 수 있습니다.</Text></VStack>
      <Grid columns={{minWidth:320,max:2}} gap={6} className="feature-index">
        {features.map(feature=>{const cover=feature.media[feature.cover];return <ClickableCard key={feature.slug} label={feature.title+' 자세히 보기'} href={featureHref(feature.slug)} padding={0} className="feature-card">
          <VStack gap={0}><AspectRatio ratio={16/9}><img src={cover.thumbnail} alt={cover.alt} className="media-fill" width={cover.width} height={cover.height} loading="lazy"/></AspectRatio><Section variant="transparent" padding={6}><VStack gap={4}><HStack gap={2} wrap="wrap"><StatusBadge label={feature.status}/><Badge label={`${feature.media.length}장의 구현 화면`}/></HStack><Heading level={3}>{feature.title}</Heading><Text as="p" type="body" color="secondary">{feature.summary}</Text><HStack gap={2} wrap="wrap">{feature.tags.map(tag=><Badge key={tag} label={tag}/>)}</HStack><HStack gap={2} vAlign="center"><Text type="label">구현 살펴보기</Text><ArrowRight size={17} aria-hidden="true"/></HStack></VStack></Section></VStack>
        </ClickableCard>;})}
      </Grid>
    </VStack>
    <VStack as="section" id="progress" gap={6} paddingBlock={6} aria-labelledby="progress-title">
      <VStack gap={3}><Heading level={2} id="progress-title">지금 연결된 플레이</Heading><Text type="supporting" color="secondary">내용 기준 2026.11.11</Text></VStack>
      <Card><Layout height="auto" header={<LayoutHeader><Heading level={3}>첫 부품까지 이어지는 생산</Heading></LayoutHeader>} content={<LayoutContent isScrollable={false}><VStack gap={6}><HStack gap={2} wrap="wrap" vAlign="center">{['집에서 시작','운석 채굴','소재 제련','전력과 회수','첫 부품 생산'].map((step,index)=><HStack key={step} gap={2} vAlign="center"><Badge label={step}/>{index<4 && <ArrowRight size={16} aria-hidden="true"/>}</HStack>)}</HStack><Text as="p" type="body" color="secondary">현재 P01의 새 게임에서 실제 비용을 지불하며 첫 부품까지 생산하는 코스를 검증했습니다. 연구·장비·재고는 저장하고 이어갈 수 있습니다.</Text><Grid columns={{minWidth:260,max:2}} gap={6}><VStack gap={3}><Heading level={4}>기반 구현</Heading><Text as="p" type="body" color="secondary">행성 중력, 지형 편집, 우주선 비행과 게임 UI를 갖추고 있습니다. 현재 새 게임에는 초기 우주선을 생성하지 않습니다.</Text></VStack><VStack gap={3}><Heading level={4}>다음 작업</Heading><Text as="p" type="body" color="secondary">구동 조립과 생산 연결을 이어갑니다. 첫 배 제작·개조와 다른 행성의 공장 운송은 후속 구현입니다.</Text></VStack></Grid></VStack></LayoutContent>}/></Card>
    </VStack>
  </SiteShell>;
}
