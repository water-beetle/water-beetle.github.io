'use client';
import { SiteShell } from '@/components/site-chrome';
import { VStack } from '@astryxdesign/core/Layout';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
export default function NotFound(){return <SiteShell><VStack gap={6} paddingBlock={10} hAlign="start"><Badge label="404"/><Heading level={1}>새로운 개발 기록으로 옮겨왔습니다.</Heading><Text as="p" type="large" color="secondary">이전 개발일지와 최적화 글을 정리하고, 기능별 구현 소개와 이미지로 새로 구성했습니다.</Text><Button label="구현 소개 보러 가기" href="/" variant="primary"/></VStack></SiteShell>;}
