'use client';

import { useState } from 'react';
import { Expand, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { LogMedia as Media } from '@/lib/devlog';

export function LogMedia({ media, featured = false }: { media: Media; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="media-error" role="status"><p>미디어를 불러오지 못했습니다.</p><button type="button" onClick={() => setFailed(false)}>다시 불러오기</button></div>;
  if (media.kind === 'video') return (
    <figure className="video-media">
      <video controls playsInline preload="metadata" poster={media.poster} aria-label={media.alt} onError={() => setFailed(true)}>
        <source src={media.src} />
        {media.captions && <track default kind="captions" src={media.captions} srcLang="ko" label="한국어" />}
        이 브라우저에서는 영상을 재생할 수 없습니다.
      </video>
      <figcaption>{media.caption}</figcaption>
    </figure>
  );
  return (
    <Dialog>
      <DialogTrigger className="media-trigger" aria-label={media.alt + ' — 크게 보기'}>
        <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading={featured ? 'eager' : 'lazy'} fetchPriority={featured ? 'high' : 'auto'} onError={() => setFailed(true)} />
        <span className="expand-hint"><Expand size={16} /><span>크게 보기</span></span>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="lightbox">
        <div className="lightbox-heading"><DialogTitle>이미지 크게 보기</DialogTitle><DialogClose className="close-button" aria-label="이미지 닫기"><X size={23} /></DialogClose></div>
        <img src={media.src} alt={media.alt} width={media.width} height={media.height} />
        <DialogDescription>{media.caption}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
