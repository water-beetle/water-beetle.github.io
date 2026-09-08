'use client';

import Giscus from '@giscus/react';
import { MessageSquare, ArrowUpRight } from 'lucide-react';
import { giscusConfig } from '@/lib/site-integrations';

export function ArticleComments({ articleId, articlePath }: { articleId: string; articlePath: string }) {
  const headingId = 'comments-' + articleId;
  const discussionSearch = 'https://github.com/' + giscusConfig.repo + '/discussions?discussions_q=' + encodeURIComponent('"' + articlePath + '"');
  return <section className="article-comments" aria-labelledby={headingId}>
    <div className="comments-heading"><h2 id={headingId}><MessageSquare size={20} aria-hidden="true" /> 댓글</h2><a href={discussionSearch} target="_blank" rel="noopener noreferrer">GitHub에서 보기 <ArrowUpRight size={15} aria-hidden="true" /></a></div>
    <p className="comments-note">GitHub 계정으로 로그인해 의견이나 질문을 남겨 주세요. 댓글은 GitHub에 공개 저장됩니다.</p>
    <div className="comments-widget">
      <Giscus id={'giscus-' + articleId} {...giscusConfig} mapping="specific" term={articlePath} strict="1" reactionsEnabled="0" emitMetadata="0" inputPosition="top" theme="dark_dimmed" lang="ko" loading="lazy" />
    </div>
    <p className="comments-fallback">댓글 창이 표시되지 않으면 위의 ‘GitHub에서 보기’를 이용해 주세요.</p>
  </section>;
}
