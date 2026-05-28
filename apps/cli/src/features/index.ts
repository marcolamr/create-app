import type { Project } from '../core/project.js';
import type { Feature } from '../core/types.js';
import { authFeature } from './auth.js';
import { baseFeature } from './base.js';
import { drizzleFeature } from './drizzle.js';
import { envFeature } from './env.js';
import { eslintFeature } from './eslint.js';
import { serverFeature } from './server.js';
import { tailwindFeature } from './tailwind.js';
import { uiFeature } from './ui.js';

/** Order matters: later features may depend on earlier ones. */
export const FEATURES: Feature[] = [
  baseFeature,
  serverFeature,
  drizzleFeature,
  authFeature,
  tailwindFeature,
  envFeature,
  eslintFeature,
  uiFeature,
];

export function applyFeatures(ctx: Project): void {
  for (const feature of FEATURES) {
    if (feature.when && !feature.when(ctx.stack)) continue;
    feature.apply(ctx);
  }
}
