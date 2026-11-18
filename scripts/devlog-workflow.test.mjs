import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import {
  makeDraft,
  publishDraft,
  indexPublished,
  clean,
} from './devlog-tools.mjs';
async function cleanup(project) {
  assert.ok(
    resolve(project).startsWith(resolve(tmpdir()) + sep) &&
      project.includes('orbital-draft-'),
  );
  await rm(project, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
}
test('초안은 검토 전 공개되지 않고, 검토한 글만 공개 색인에 추가된다', async () => {
  const project = await mkdtemp(join(tmpdir(), 'orbital-draft-'));
  try {
    const source = join(project, 'report');
    await mkdir(source);
    await writeFile(
      join(source, 'README.md'),
      '# 실제 변경\n\n곡괭이를 벽과 바닥에 맞추고 실제 E 줍기와 단일 소유를 확인했습니다. 로컬 경로 G:/UnrealProjects/Comet/Saved 는 공개하지 않습니다.',
    );
    await mkdir(join(project, 'lib'));
    await writeFile(
      join(project, 'lib/journal-media.json'),
      JSON.stringify({ test: { src: '/test.webp' } }),
    );
    const path = await makeDraft({ source, slug: 'new-note', project });
    const file = join(path, 'article.json');
    let draft = JSON.parse(await readFile(file));
    assert.equal(draft.status, 'draft');
    assert.equal(draft.reviewed, false);
    assert.ok(!draft.summary.includes('G:/'));
    await assert.rejects(
      publishDraft({ slug: 'new-note', project }),
      /reviewed/,
    );
    await assert.rejects(
      publishDraft({ slug: 'new-note', reviewed: true, project }),
      /reviewed/,
    );
    draft.reviewed = true;
    draft.cover = 'test';
    draft.chapterId = 'unknown-chapter';
    await writeFile(file, JSON.stringify(draft));
    await assert.rejects(
      publishDraft({ slug: 'new-note', reviewed: true, project }),
      /chapterId/,
    );
    draft.chapterId = 'bench';
    await writeFile(file, JSON.stringify(draft));
    await publishDraft({ slug: 'new-note', reviewed: true, project });
    const entries = await indexPublished(project);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].slug, 'new-note');
    assert.equal(entries[0].sourceFacts, undefined);
    assert.equal(entries[0].chapterId, 'bench');
    assert.equal(entries[0].candidates, undefined);
    assert.equal(entries[0].assets, undefined);
    await assert.rejects(
      publishDraft({ slug: 'new-note', reviewed: true, project }),
      /既|이미/,
    );
  } finally {
    await cleanup(project);
  }
});
test('경로 이탈 slug를 거부한다', async () => {
  await assert.rejects(makeDraft({ source: '.', slug: '../outside' }), /slug/);
});
test('공개 URL은 유지하고 로컬 경로만 제거한다', () => {
  assert.equal(
    clean('링크 https://example.com 과 G:/private/file.png'),
    '링크 https://example.com 과 [로컬 경로]',
  );
});
test('선택한 이미지만 변환하고 중첩 비공개 필드를 제외한다', async () => {
  const project = await mkdtemp(join(tmpdir(), 'orbital-draft-'));
  try {
    const { default: sharp } = await import('sharp');
    sharp.cache(false);
    const source = join(project, 'report');
    await mkdir(source);
    await writeFile(
      join(source, 'README.md'),
      '# 촬영 기록\n\n직접 검증한 촬영본에서 이미지를 골라 글을 작성하는 과정입니다. 원본 촬영본은 그대로 보존합니다.',
    );
    const image = join(source, 'selected.png');
    await sharp({
      create: { width: 32, height: 18, channels: 3, background: '#16352f' },
    })
      .png()
      .toFile(image);
    await mkdir(join(project, 'lib'));
    await writeFile(join(project, 'lib/journal-media.json'), '{}');
    const draftPath = await makeDraft({ source, slug: 'image-note', project });
    const file = join(draftPath, 'article.json');
    const draft = JSON.parse(await readFile(file));
    draft.reviewed = true;
    draft.cover = 'selected-image';
    draft.assets = [
      {
        source: image,
        id: 'selected-image',
        alt: '실제 이미지 설명',
        caption: '2026.11.18 촬영 검증 화면',
      },
    ];
    draft.sections[0].sourcePath = source;
    await writeFile(file, JSON.stringify(draft));
    await publishDraft({ slug: 'image-note', reviewed: true, project });
    const entries = await indexPublished(project);
    assert.equal(entries[0].sections[0].sourcePath, undefined);
    const library = JSON.parse(
      await readFile(join(project, 'lib/journal-media.json')),
    );
    const output = join(project, 'public', library['selected-image'].src);
    assert.equal((await sharp(output).metadata()).format, 'webp');
    assert.equal((await sharp(image).metadata()).format, 'png');
    assert.ok(
      await readFile(
        join(project, 'public', library['selected-image'].thumbnail),
      ),
    );
  } finally {
    await cleanup(project);
  }
});
