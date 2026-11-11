'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Dialog } from '@astryxdesign/core/Dialog';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import type { FeatureMedia } from '@/lib/features';

export function Gallery({media, title}: {media: FeatureMedia[]; title: string}) {
 const [selected, setSelected] = useState<number | null>(null);
 const triggers = useRef<(HTMLButtonElement | null)[]>([]);
 const lastSelected = useRef(0);
 const move = useCallback((amount: number) => setSelected(current => current === null ? null : (current + amount + media.length) % media.length), [media.length]);
 const close = useCallback(() => { setSelected(null); requestAnimationFrame(() => triggers.current[lastSelected.current]?.focus()); }, []);
 useEffect(() => {
   if (selected === null) return;
   function onKey(event: KeyboardEvent) {
     if (event.key === 'ArrowLeft') {event.preventDefault(); move(-1);}
     if (event.key === 'ArrowRight') {event.preventDefault(); move(1);}
   }
   document.addEventListener('keydown', onKey);
   return () => document.removeEventListener('keydown', onKey);
 }, [selected, move]);
 return <>
   <div className="gallery-grid">{media.map((item, index) => <figure key={item.src} className={index === 0 ? 'gallery-item gallery-featured' : 'gallery-item'}>
     <button type="button" className="image-trigger" ref={el => {triggers.current[index] = el;}} onClick={() => {lastSelected.current=index; setSelected(index);}} aria-label={item.alt + ' 크게 보기'}>
       <img src={item.thumbnail} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
       <span className="expand-mark"><Expand size={17} aria-hidden="true" /> 크게 보기</span>
     </button>
     <figcaption><span className="image-number">{String(index+1).padStart(2,'0')}</span><div><strong>{item.alt}</strong><p>{item.caption}</p></div></figcaption>
   </figure>)}</div>
   <Dialog isOpen={selected !== null} onOpenChange={open => {if (!open) close();}} purpose="info" width="min(1440px, 96vw)" maxHeight="94dvh" padding={0} className="gallery-dialog" aria-labelledby="gallery-dialog-title" aria-describedby="gallery-dialog-caption">
     {selected !== null && <div className="lightbox-content">
       <div className="lightbox-top"><h2 id="gallery-dialog-title">{title}<span>{selected+1} / {media.length}</span></h2><Button label="이미지 닫기" variant="ghost" icon={<X size={22}/>} isIconOnly onClick={close} className="gallery-control" /></div>
       <img className="lightbox-image" src={media[selected].src} alt={media[selected].alt} width={media[selected].width} height={media[selected].height}/>
       <div className="lightbox-bottom"><Button label="이전 이미지" variant="secondary" icon={<ArrowLeft size={19}/>} isIconOnly onClick={() => move(-1)} className="gallery-control"/><p id="gallery-dialog-caption" aria-live="polite"><strong>{media[selected].alt}</strong><span>{media[selected].caption}</span></p><Button label="다음 이미지" variant="secondary" icon={<ArrowRight size={19}/>} isIconOnly onClick={() => move(1)} className="gallery-control"/></div>
     </div>}
   </Dialog>
 </>;
}
