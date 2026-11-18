import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function slug(value) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '') || value.length > 90)
    throw Error('영문 소문자·숫자·하이픈으로 slug를 지정하세요.');
  return value;
}
export async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
export function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) throw Error('옵션은 --이름 형식으로 전달하세요.');
    const key = a.slice(2);
    out[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return out;
}
export function clean(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(^|[\s"'(])(?:[A-Za-z]:[\\/]|\\\\)[^\s)]+/g, '$1[로컬 경로]')
    .replace(/[*`>#]/g, '')
    .trim();
}
export async function makeDraft({ source, slug: raw, title, project = root }) {
  const id = slug(raw);
  const folder = resolve(source);
  const text = await readFile(join(folder, 'README.md'), 'utf8');
  const lines = text.split(/\r?\n/);
  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map(clean)
    .filter((s) => s.length > 35 && !s.startsWith('|'))
    .slice(0, 10);
  const imageNames = (await readdir(folder))
    .filter((n) => /\.(png|jpe?g|webp)$/i.test(n))
    .slice(0, 20);
  const destination = join(project, 'drafts', id);
  if (await exists(destination))
    throw Error('같은 slug의 초안이 이미 있습니다. 기존 초안을 확인하세요.');
  await mkdir(destination, { recursive: true });
  const draft = {
    slug: id,
    title: title || clean(lines.find((s) => s.startsWith('# ')) || id),
    eyebrow: 'FIELD NOTES',
    date: new Date().toISOString().slice(0, 10),
    category: '플레이 과정',
    summary: paragraphs[0] || '이번 변경을 플레이어에게 설명해 주세요.',
    readingMinutes: 3,
    cover: '',
    status: 'draft',
    reviewed: false,
    sections: [
      {
        title: '이번에 달라진 점',
        text: [paragraphs[0] || '이번 변경 내용을 정리해 주세요.'],
      },
      {
        title: '직접 확인한 과정',
        text: [
          paragraphs.find((s) => /확인|검증|통과/.test(s)) ||
            '확인된 플레이 과정과 결과를 작성해 주세요.',
        ],
      },
    ],
    next: '다음에 만들 내용을 작성해 주세요.',
    assets: [],
    candidates: imageNames.map((name) => ({
      source: join(folder, name),
      id: '',
      alt: '',
      caption: '',
    })),
    sourceFacts: { source: folder, notes: paragraphs },
  };
  await writeFile(
    join(destination, 'article.json'),
    JSON.stringify(draft, null, 2) + '\n',
  );
  await writeFile(
    join(destination, 'REVIEW.md'),
    '# 게시 전 검토\n\n- 플레이어가 읽기 쉬운 글로 다듬기\n- 현재 구현과 과거·후속 구분\n- 사진 후보에서 assets 선택, alt·촬영 캡션 작성\n- cover와 본문 media 키 확인\n- reviewed를 true로 변경 후 devlog:publish --reviewed 실행\n\n게시 명령은 로컬 공개 데이터만 갱신합니다. Git push와 배포는 실행하지 않습니다.\n',
  );
  return destination;
}
export async function publishDraft({
  slug: raw,
  reviewed,
  replace = false,
  project = root,
}) {
  const id = slug(raw);
  if (reviewed !== true)
    throw Error('--reviewed 확인 없이는 게시 데이터를 만들지 않습니다.');
  const draft = JSON.parse(
    await readFile(join(project, 'drafts', id, 'article.json'), 'utf8'),
  );
  if (draft.reviewed !== true)
    throw Error('초안의 reviewed를 true로 확인해 주세요.');
  if (draft.slug !== id) throw Error('초안 slug가 폴더와 다릅니다.');
  const destination = join(project, 'content/published', id + '.json');
  if (!replace && (await exists(destination)))
    throw Error('이미 공개 준비된 글입니다. 수정은 --replace를 명시하세요.');
  const entry = Object.fromEntries(
    [
      'slug',
      'title',
      'eyebrow',
      'date',
      'category',
      'summary',
      'readingMinutes',
      'chapterId',
      'cover',
      'sections',
      'comparison',
      'next',
    ]
      .filter((k) => draft[k] !== undefined)
      .map((k) => [k, draft[k]]),
  );
  entry.status = 'published';
  if (
    entry.chapterId !== undefined &&
    !['home', 'meteor', 'mining', 'bench', 'research', 'drone'].includes(
      entry.chapterId,
    )
  )
    throw Error('유효한 chapterId를 선택하세요.');
  for (const key of ['title', 'date', 'category', 'summary', 'cover', 'next'])
    if (typeof entry[key] !== 'string' || !entry[key].trim())
      throw Error(key + ' 항목을 채워 주세요.');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
    !Array.isArray(entry.sections) ||
    !entry.sections.length
  )
    throw Error('날짜와 본문을 확인하세요.');
  entry.sections = entry.sections.map((section) => {
    if (
      typeof section.title !== 'string' ||
      !section.title.trim() ||
      !Array.isArray(section.text) ||
      !section.text.length ||
      section.text.some((p) => typeof p !== 'string' || !p.trim())
    )
      throw Error('각 본문의 제목과 문단을 작성하세요.');
    return {
      title: section.title,
      text: section.text,
      ...(section.media ? { media: section.media } : {}),
    };
  });
  if (entry.comparison)
    entry.comparison = {
      before: entry.comparison.before,
      after: entry.comparison.after,
      note: entry.comparison.note,
    };
  if (
    typeof entry.eyebrow !== 'string' ||
    !Number.isInteger(entry.readingMinutes) ||
    entry.readingMinutes < 1 ||
    entry.readingMinutes > 60
  )
    throw Error('글의 부제와 읽는 시간을 확인하세요.');
  const publicText = JSON.stringify(entry);
  if (/(?:^|[\s"'(])[A-Za-z]:[\\/]|\\\\/.test(publicText))
    throw Error('공개 본문에 로컬 절대 경로가 있습니다.');
  const mediaFile = join(project, 'lib/journal-media.json');
  const library = JSON.parse(await readFile(mediaFile, 'utf8'));
  const assets = draft.assets || [];
  const requested = [
    entry.cover,
    ...entry.sections.map((s) => s.media).filter(Boolean),
    ...(entry.comparison
      ? [entry.comparison.before, entry.comparison.after]
      : []),
  ];
  const newKeys = new Set();
  for (const item of assets) {
    slug(item.id);
    if (newKeys.has(item.id) || library[item.id])
      throw Error('기존 이미지 키나 중복 이미지 키를 덮어쓸 수 없습니다.');
    newKeys.add(item.id);
    if (
      typeof item.alt !== 'string' ||
      !item.alt.trim() ||
      typeof item.caption !== 'string' ||
      !item.caption.trim()
    )
      throw Error('이미지 alt와 촬영 캡션을 작성하세요.');
    if (
      /(?:^|[\s"'(])[A-Za-z]:[\\/]|\\\\/.test(
        JSON.stringify({ alt: item.alt, caption: item.caption }),
      )
    )
      throw Error('이미지 설명에 로컬 절대 경로가 있습니다.');
  }
  const keys = new Set([...Object.keys(library), ...assets.map((a) => a.id)]);
  if (requested.some((k) => !keys.has(k)))
    throw Error('cover 또는 본문 이미지가 등록되지 않았습니다.');
  if (assets.length) {
    const { default: sharp } = await import('sharp');
    const folder = join(project, 'public/media/journal', id);
    await mkdir(folder, { recursive: true });
    for (const item of assets) {
      slug(item.id);
      if (!item.alt?.trim() || !item.caption?.trim())
        throw Error('이미지 alt와 촬영 캡션을 작성하세요.');
      if (library[item.id]) throw Error('기존 이미지 키를 덮어쓸 수 없습니다.');
      const source = resolve(item.source);
      const metadata = await sharp(source).metadata();
      const name = item.id;
      await sharp(source)
        .resize({
          width: 1920,
          height: 1920,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 88 })
        .toFile(join(folder, name + '.webp'));
      await sharp(source)
        .resize({
          width: 900,
          height: 900,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 84 })
        .toFile(join(folder, name + '-thumb.webp'));
      library[name] = {
        src: `/media/journal/${id}/${name}.webp`,
        thumbnail: `/media/journal/${id}/${name}-thumb.webp`,
        alt: item.alt,
        caption: item.caption,
        width: metadata.width,
        height: metadata.height,
      };
    }
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify(entry, null, 2) + '\n');
  await writeFile(mediaFile, JSON.stringify(library, null, 2) + '\n');
  await indexPublished(project);
  return destination;
}
export async function indexPublished(project = root) {
  const folder = join(project, 'content/published');
  const files = (await readdir(folder))
    .filter((f) => f.endsWith('.json') && f !== 'index.json')
    .sort();
  const entries = [];
  for (const file of files) {
    const entry = JSON.parse(await readFile(join(folder, file), 'utf8'));
    if (entry.status === 'published') entries.push(entry);
  }
  entries.sort((a, b) => b.date.localeCompare(a.date));
  await writeFile(
    join(folder, 'index.json'),
    JSON.stringify(entries, null, 2) + '\n',
  );
  return entries;
}
