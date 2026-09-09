import { terrainPosts } from './terrain';
import { simulationPosts } from './simulation';
import { followupPosts } from './followup';
import { additionalPosts } from './additional';
import type { OptimizationPost } from './types';

export const optimizationPosts: OptimizationPost[] = [...terrainPosts, ...simulationPosts, ...followupPosts, ...additionalPosts];
export const optimizationHref = (slug: string) => `/optimization/${slug}/`;
