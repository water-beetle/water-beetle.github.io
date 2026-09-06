export type LogMedia =
  | { kind: 'image'; src: string; alt: string; caption: string; width: number; height: number }
  | { kind: 'video'; src: string; poster: string; alt: string; caption: string; captions?: string };

export type Devlog = {
  id: string;
  number: string;
  title: string;
  summary: string;
  tags: string[];
  date?: string;
  example: boolean;
  media: LogMedia;
  sections: { title: string; text: string }[];
};

// Newest first. Add actual screenshots or MP4/WebM files to public/media/.
export const devlogs: Devlog[] = [
  {
    id: 'cabin-log', number: '002', title: '우주선에도, 내 방이 필요하니까.',
    summary: '작은 부엌, 창가의 식물, 하루를 마무리할 침대. 우주선을 머물고 싶은 공간으로 만드는 과정을 담는 기록입니다.',
    tags: ['선내 생활', '공간 구성'], example: true,
    media: { kind: 'image', src: '/images/cabin.jpg', alt: '식물과 작은 부엌, 침실을 갖춘 우주선 내부의 예시 컨셉 이미지', caption: '예시 컨셉 이미지 · 실제 게임 화면이 아닙니다', width: 1672, height: 941 },
    sections: [
      { title: '이번에 구현한 것', text: '생활 공간을 어떻게 나누고, 플레이어가 물건과 어떻게 상호작용하게 만들었는지 적어보세요. 완성된 기능 하나와 작업 중 발견한 문제 하나만 있어도 좋은 기록이 됩니다.' },
      { title: '만들면서 발견한 것', text: '잘된 부분뿐 아니라 예상과 달랐던 점도 남겨보세요. 화면과 함께 변경 전후를 설명하면 개발 과정이 더 잘 전달됩니다.' },
      { title: '다음 작업', text: '다음에 개선할 부분이나 시도해 볼 아이디어를 남기는 자리입니다.' },
    ],
  },
  {
    id: 'station-log', number: '001', title: '창밖에 새로운 이웃이 생겼다.',
    summary: '처음으로 정거장에 도착하는 순간. 이동과 도킹, 그리고 새로운 공간을 만나는 경험을 기록합니다.',
    tags: ['우주 탐험', '정거장'], example: true,
    media: { kind: 'image', src: '/images/station.jpg', alt: '행성을 배경으로 우주선이 작은 궤도 정거장에 접근하는 예시 컨셉 이미지', caption: '예시 컨셉 이미지 · 실제 게임 화면이 아닙니다', width: 1672, height: 941 },
    sections: [
      { title: '이번에 구현한 것', text: '정거장 이동과 도킹을 주제로 한 예시 기록입니다. 실제 구현한 기능과 플레이 흐름을 짧은 영상이나 화면과 함께 남길 수 있습니다.' },
      { title: '해결한 문제', text: '개발 중 겪은 문제, 원인을 찾는 과정, 적용한 해결 방법을 간단히 적어보세요.' },
      { title: '다음 작업', text: '다음 개발일지에서 보여주고 싶은 장면이나 개선 목표를 적는 자리입니다.' },
    ],
  },
];
