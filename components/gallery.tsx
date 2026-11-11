'use client';
import { useState } from 'react';
import { Grid } from '@astryxdesign/core/Grid';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Lightbox } from '@astryxdesign/core/Lightbox';
import type { FeatureMedia } from '@/lib/features';

export function Gallery({media,title}: {media:FeatureMedia[];title:string}) {
  const [selected,setSelected]=useState<number|null>(null);
  return <><Grid columns={{minWidth:300,max:2}} gap={6} className="gallery-grid">{media.map((item,index)=><VStack as="figure" gap={3} key={item.src} data-gallery-item="true">
    <ClickableCard label={item.alt+' 크게 보기'} onClick={()=>setSelected(index)} padding={0} className="image-trigger"><AspectRatio ratio={16/9}><img className="media-contain" src={item.thumbnail} alt={item.alt} width={item.width} height={item.height} loading="lazy"/></AspectRatio></ClickableCard>
    <VStack as="figcaption" gap={2}><HStack gap={2} vAlign="center"><Badge label={String(index+1).padStart(2,'0')}/><Text type="label">{item.alt}</Text></HStack><Text as="p" type="supporting" color="secondary">{item.caption}</Text></VStack>
  </VStack>)}</Grid><Lightbox isOpen={selected!==null} onOpenChange={open=>{if(!open)setSelected(null);}} media={media.map(item=>({src:item.src,alt:item.alt,caption:item.caption}))} index={selected??0} onIndexChange={setSelected} hasZoom aria-label={title+' 구현 화면'}/></>;
}
