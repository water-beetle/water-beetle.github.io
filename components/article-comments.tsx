'use client';
import Giscus from '@giscus/react';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Card } from '@astryxdesign/core/Card';
import { giscusConfig } from '@/lib/site-integrations';
export function ArticleComments({articleId,articlePath}:{articleId:string;articlePath:string}) {
  const headingId='comments-'+articleId;
  const discussionSearch='https://github.com/'+giscusConfig.repo+'/discussions?discussions_q='+encodeURIComponent('"'+articlePath+'"');
  return <Card><VStack as="section" gap={4} aria-labelledby={headingId}><HStack hAlign="between" vAlign="center" gap={3} wrap="wrap"><Heading level={2} id={headingId}>댓글</Heading><Link href={discussionSearch} isExternalLink>GitHub에서 보기</Link></HStack><Text type="body" color="secondary">GitHub 계정으로 댓글을 남길 수 있습니다.</Text><Giscus id={'giscus-'+articleId} {...giscusConfig} mapping="specific" term={articlePath} strict="1" reactionsEnabled="0" emitMetadata="0" inputPosition="top" theme="dark_dimmed" lang="ko" loading="lazy"/><Text type="supporting" color="secondary">댓글 창이 표시되지 않으면 위의 ‘GitHub에서 보기’를 이용해 주세요.</Text></VStack></Card>;
}
