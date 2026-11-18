import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DevlogArticle } from '@/components/devlog-article';
import { devlogs, media, updateHref } from '@/lib/devlogs';
export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() {
  return devlogs.map((entry) => ({ slug: entry.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = devlogs.find((p) => p.slug === slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: updateHref(slug) },
    openGraph: {
      title: entry.title,
      description: entry.summary,
      type: 'article',
      publishedTime: entry.date,
      images: [{ url: media[entry.cover].src }],
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = devlogs.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  return (
    <DevlogArticle
      entry={devlogs[index]}
      next={devlogs[(index + 1) % devlogs.length]}
    />
  );
}
