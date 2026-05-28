import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';

export const uiFeature: Feature = {
  id: 'ui',
  apply(project) {
    const { ui: U } = TEMPLATE;

    const layout = project.has('tailwind') ? U.layouts.tailwind : U.layouts.base;
    project.copyRaw(layout, 'src/app/layout.tsx');

    let page: string = U.pages.base;
    if (project.has('auth') && project.has('tailwind')) page = U.pages.authTailwind;
    else if (project.has('auth')) page = U.pages.auth;
    else if (project.has('tailwind')) page = U.pages.tailwind;

    project.copyRaw(page, 'src/app/page.tsx');

    if (!project.has('tailwind')) {
      const cssModule = project.has('auth') ? U.authCssModule : U.pageCssModule;
      const cssDest = project.has('auth')
        ? 'src/app/index.module.css'
        : 'src/app/page.module.css';
      project.copyRaw(cssModule, cssDest);
    }
  },
};
