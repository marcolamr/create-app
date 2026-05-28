import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** CLI package root (parent of dist/). */
const distDir = path.dirname(fileURLToPath(import.meta.url));
export const PKG_ROOT = path.join(distDir, '../');
export const TEMPLATE_ROOT = path.join(PKG_ROOT, 'template');
