import type { Metadata } from 'next';
import { UpdatesIndex } from '@/components/updates-index';
export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: '개발 기록',
  description: 'ORBITAL FALL의 실제 플레이 과정과 달라지는 세계를 기록합니다.',
  alternates: { canonical: '/updates/' },
};
export default function Updates() {
  return <UpdatesIndex />;
}
