import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ImageIcon } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { StatusBadge } from '@/components/status-badge';
import { Gallery } from '@/components/gallery';
import { ArticleComments } from '@/components/article-comments';
import { features, featureHref } from '@/lib/features';
export const dynamic='force-static';
export const dynamicParams=false;
export function generateStaticParams(){return features.map(feature=>({slug:feature.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const feature=features.find(item=>item.slug===slug);if(!feature)return {};return {title:feature.title,description:feature.summary,alternates:{canonical:featureHref(slug)},openGraph:{title:feature.title+' | ORBITAL FALL',description:feature.summary,images:[{url:feature.media[feature.cover].src}]}};}
export default async function FeaturePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const index=features.findIndex(feature=>feature.slug===slug);if(index<0)notFound();const feature=features[index];const next=features[(index+1)%features.length];
 return <div id="top" className="site-shell"><a className="skip-link" href="#article-content">본문으로 건너뛰기</a><SiteHeader/><main className="wrap feature-page" id="article-content"><a href="/#features" className="back-link"><ArrowLeft size={16}/> 전체 구현 목록</a><header className="feature-heading"><p className="eyebrow">{feature.number} / {feature.english}</p><div className="title-with-status"><h1 data-analytics-article={'feature/'+slug} data-article-title={feature.title} data-article-type="feature">{feature.title}</h1><StatusBadge label={feature.status}/></div><p className="feature-lead">{feature.summary}</p><div className="detail-meta"><span><ImageIcon size={15}/> 실제 화면 {feature.media.length}장</span><span>최근 관련 기록 {feature.date}</span></div></header><section className="implementation-summary" aria-labelledby="made-title"><h2 id="made-title">구현한 내용</h2><ul>{feature.points.map(point=><li key={point}><Check size={17} aria-hidden="true"/><span>{point}</span></li>)}</ul></section><section className="screens-section" aria-labelledby="screens-title"><div className="gallery-heading"><h2 id="screens-title">구현 화면</h2><p>이미지를 누르면 크게 볼 수 있습니다.</p></div><Gallery media={feature.media} title={feature.title}/></section><section className="validation-section" aria-labelledby="validation-title"><h2 id="validation-title">확인한 범위</h2><p>{feature.result}</p><div className="scope-note"><strong>현재 범위와 남은 작업</strong><p>{feature.limit}</p></div></section><nav className="feature-pagination" aria-label="다른 구현 보기"><a href="/#features"><ArrowLeft size={17}/> 전체 구현 목록</a><a href={featureHref(next.slug)}><span>다음 구현<strong>{next.title}</strong></span><ArrowRight size={22}/></a></nav><ArticleComments articleId={'feature-'+slug} articlePath={featureHref(slug)}/></main><SiteFooter/></div>;
}
