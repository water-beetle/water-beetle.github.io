import { terrainPosts } from './terrain';
import { simulationPosts } from './simulation';
import { followupPosts } from './followup';
import type { OptimizationPost } from './types';

export const optimizationPosts: OptimizationPost[] = [...terrainPosts, ...simulationPosts, ...followupPosts];
export const optimizationHref = (slug: string) => `/optimization/${slug}/`;
