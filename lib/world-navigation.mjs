export const sceneIds = [
  'clearing',
  'home',
  'meteor',
  'bench',
  'computer',
  'drone',
];
export const shotIds = {
  clearing: ['arrival'],
  home: ['entry', 'pickaxe'],
  meteor: ['wide', 'close', 'mining', 'inventory'],
  bench: ['built', 'menu', 'preview', 'building', 'complete'],
  computer: ['desk', 'ready', 'running', 'complete'],
  drone: ['ready', 'assembling', 'complete', 'inventory'],
};
export function validScene(value) {
  return (
    !!value &&
    sceneIds.includes(value.scene) &&
    shotIds[value.scene].includes(value.shot)
  );
}
export function sceneHref(value) {
  return '/#scene=' + value.scene + '&shot=' + value.shot;
}
const legacy = {
  home: 'home',
  meteor: 'meteor',
  mining: 'meteor',
  bench: 'bench',
  research: 'computer',
  drone: 'drone',
};
export function sceneFromHash(hash) {
  const raw = hash.replace(/^#/, '');
  if (raw === 'journey' || raw === 'top')
    return { scene: 'clearing', shot: 'arrival' };
  if (raw === 'features' || raw === 'updates')
    return { scene: 'computer', shot: 'desk' };
  if (raw === 'progress') return { scene: 'drone', shot: 'inventory' };
  if (raw.startsWith('step-') && legacy[raw.slice(5)]) {
    const scene = legacy[raw.slice(5)];
    return {
      scene,
      shot: raw === 'step-mining' ? 'mining' : shotIds[scene][0],
    };
  }
  const params = new URLSearchParams(raw);
  const scene = params.get('scene'),
    shot = params.get('shot') || shotIds[scene]?.[0];
  return validScene({ scene, shot }) ? { scene, shot } : null;
}
// The exact object-fit:cover transform is shared by image and target placement.
export function coverPoint(point, image, viewport) {
  const scale = Math.max(
    viewport.width / image.width,
    viewport.height / image.height,
  );
  return {
    x:
      (point.x / 100) * image.width * scale +
      (viewport.width - image.width * scale) / 2,
    y:
      (point.y / 100) * image.height * scale +
      (viewport.height - image.height * scale) / 2,
  };
}
