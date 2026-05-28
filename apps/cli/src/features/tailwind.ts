import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';

export const tailwindFeature: Feature = {
  id: 'tailwind',
  when: (stack) => stack.tailwind,
  apply(project) {
    project.addDevDeps('tailwindcss', 'postcss', '@tailwindcss/postcss');

    const { tailwind: T } = TEMPLATE;
    project.copyRaw(T.postcss, 'postcss.config.mjs');
    project.copyRaw(T.globals, 'src/styles/globals.css');
  },
};
