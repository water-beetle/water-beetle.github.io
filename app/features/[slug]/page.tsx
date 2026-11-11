import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeatureDetail } from '@/components/feature-detail';
import { features, featureHref } from '@/lib/features';
export const dynamic='force-static';
export const dynamicParams=false;
export function generateStaticParams(){return features.map(feature=>({slug:feature.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const feature=features.find(item=>item.slug===slug);if(!feature)return {};return {title:feature.title,description:feature.summary,alternates:{canonical:featureHref(slug)},openGraph:{title:feature.title+' | ORBITAL FALL',description:feature.summary,images:[{url:feature.media[feature.cover].src}]}};}
export default async function FeaturePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;const index=features.findIndex(feature=>feature.slug===slug);if(index<0)notFound();
  return <FeatureDetail feature={features[index]} next={features[(index+1)%features.length]}/>;
}
