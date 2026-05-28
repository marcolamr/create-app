import type { Feature } from '../core/types.js';

/** Core devDependencies every generated project must have. */
export const baseFeature: Feature = {
  id: 'base',
  apply(project) {
    project.addDevDeps('babel-plugin-react-compiler');
  },
};
