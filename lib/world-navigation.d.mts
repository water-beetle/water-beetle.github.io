export type SceneId =
  | 'clearing'
  | 'home'
  | 'meteor'
  | 'bench'
  | 'computer'
  | 'drone';
export type SceneSelection = { scene: SceneId; shot: string };
export const sceneIds: SceneId[];
export const shotIds: Record<SceneId, string[]>;
export function validScene(value: unknown): value is SceneSelection;
export function sceneHref(value: SceneSelection): string;
export function sceneFromHash(hash: string): SceneSelection | null;
export function coverPoint(
  point: { x: number; y: number },
  image: { width: number; height: number },
  viewport: { width: number; height: number },
): { x: number; y: number };
