'use client';
import { VStack, HStack, Layout, LayoutHeader, LayoutContent } from '@astryxdesign/core/Layout';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Card } from '@astryxdesign/core/Card';
import { List, ListItem } from '@astryxdesign/core/List';
import { Breadcrumbs, BreadcrumbItem } from '@astryxdesign/core/Breadcrumbs';
import { Button } from '@astryxdesign/core/Button';
import { Badge } from '@astryxdesign/core/Badge';
import { Divider } from '@astryxdesign/core/Divider';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/site-chrome';
import { StatusBadge } from '@/components/status-badge';
import { Gallery } from '@/components/gallery';
import { ArticleComments } from '@/components/article-comments';
import { featureHref, type Feature } from '@/lib/features';

export function FeatureDetail({feature,next}:{feature:Feature;next:Feature}) {
  return <SiteShell><VStack id="article-content" gap={8} paddingBlock={6}>
    <Breadcrumbs label="현재 위치"><BreadcrumbItem href="/#features">전체 구현 목록</BreadcrumbItem><BreadcrumbItem isCurrent>{feature.title}</BreadcrumbItem></Breadcrumbs>
    <VStack as="header" gap={4}><HStack gap={3} wrap="wrap" vAlign="center"><Badge label={feature.number}/><Text type="supporting" color="secondary">{feature.english}</Text><StatusBadge label={feature.status}/></HStack><Heading level={1} data-analytics-article={'feature/'+feature.slug} data-article-title={feature.title} data-article-type="feature">{feature.title}</Heading><Text as="p" type="large" color="secondary">{feature.summary}</Text><HStack gap={3} wrap="wrap"><Badge label={`실제 화면 ${feature.media.length}장`}/><Text type="supporting" color="secondary">최근 관련 기록 {feature.date}</Text></HStack></VStack>
    <Card><Layout height="auto" header={<LayoutHeader><Heading level={2} id="made-title">구현한 내용</Heading></LayoutHeader>} content={<LayoutContent isScrollable={false}><List edge="flush">{feature.points.map(point=><ListItem key={point} startContent={<Check size={18} aria-hidden="true"/>} label={<Text type="body">{point}</Text>}/>)}</List></LayoutContent>}/></Card>
    <VStack as="section" gap={6} aria-labelledby="screens-title"><VStack gap={2}><Heading level={2} id="screens-title">구현 화면</Heading><Text type="body" color="secondary">이미지를 누르면 크게 볼 수 있습니다. 확대 보기에서 방향키로 이동하고 사진을 확대할 수 있습니다.</Text></VStack><Gallery media={feature.media} title={feature.title}/></VStack>
    <Card><Layout height="auto" header={<LayoutHeader><Heading level={2} id="validation-title">확인한 범위</Heading></LayoutHeader>} content={<LayoutContent isScrollable={false}><VStack gap={6}><Text as="p" type="body">{feature.result}</Text><Divider/><VStack gap={3}><Heading level={3}>현재 범위와 남은 작업</Heading><Text as="p" type="body" color="secondary">{feature.limit}</Text></VStack></VStack></LayoutContent>}/></Card>
    <HStack as="nav" aria-label="다른 구현 보기" gap={4} hAlign="between" wrap="wrap"><Button label="전체 구현 목록" href="/#features" icon={<ArrowLeft size={18}/>} variant="secondary"/><Button label={'다음 구현 '+next.title} href={featureHref(next.slug)} endContent={<ArrowRight size={18}/>} variant="secondary"/></HStack>
    <ArticleComments articleId={'feature-'+feature.slug} articlePath={featureHref(feature.slug)}/>
  </VStack></SiteShell>;
}
