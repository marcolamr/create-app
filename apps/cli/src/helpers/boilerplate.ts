import fs from 'fs-extra';
import path from 'node:path';

import { PKG_ROOT } from '@/constants';
import type { InstallerOptions } from '@/installers/types';

type SelectBoilerplateProps = Required<Pick<InstallerOptions, 'packages' | 'projectDir'>>;

// This generates the _app.tsx file that is used to render the app
export const selectAppFile = ({ projectDir, packages }: SelectBoilerplateProps) => {
  const appFileDir = path.join(PKG_ROOT, 'template/extras/src/pages/_app');

  const usingTw = packages.tailwind.inUse;
  const usingBetterAuth = packages.betterAuth.inUse;

  let appFile = 'base.tsx';
  if (usingBetterAuth && usingTw) {
    appFile = 'with-better-auth-tw.tsx';
  } else if (usingBetterAuth && !usingTw) {
    appFile = 'with-better-auth.tsx';
  } else if (usingTw) {
    appFile = 'with-tw.tsx';
  }

  const appSrc = path.join(appFileDir, appFile);
  const appDest = path.join(projectDir, 'src/pages/_app.tsx');
  fs.copySync(appSrc, appDest);
};

// Similar to _app, but for app router
export const selectLayoutFile = ({ projectDir, packages }: SelectBoilerplateProps) => {
  const layoutFileDir = path.join(PKG_ROOT, 'template/extras/src/app/layout');

  const usingTw = packages.tailwind.inUse;
  const layoutFile = usingTw ? 'with-tw.tsx' : 'base.tsx';

  const appSrc = path.join(layoutFileDir, layoutFile);
  const appDest = path.join(projectDir, 'src/app/layout.tsx');
  fs.copySync(appSrc, appDest);
};

// This selects the proper index.tsx to be used that showcases the chosen tech
export const selectIndexFile = ({ projectDir, packages }: SelectBoilerplateProps) => {
  const indexFileDir = path.join(PKG_ROOT, 'template/extras/src/pages/index');

  const usingTw = packages.tailwind.inUse;
  const usingBetterAuth = packages.betterAuth.inUse;

  let indexFile = 'base.tsx';
  if (usingBetterAuth && usingTw) {
    indexFile = 'with-better-auth-tw.tsx';
  } else if (usingBetterAuth && !usingTw) {
    indexFile = 'with-better-auth.tsx';
  } else if (usingTw) {
    indexFile = 'with-tw.tsx';
  }

  const indexSrc = path.join(indexFileDir, indexFile);
  const indexDest = path.join(projectDir, 'src/pages/index.tsx');
  fs.copySync(indexSrc, indexDest);
};

// Similar to index, but for app router
export const selectPageFile = ({ projectDir, packages }: SelectBoilerplateProps) => {
  const indexFileDir = path.join(PKG_ROOT, 'template/extras/src/app/page');

  const usingTw = packages.tailwind.inUse;
  const usingBetterAuth = packages.betterAuth.inUse;

  let indexFile = 'base.tsx';
  if (usingBetterAuth && usingTw) {
    indexFile = 'with-better-auth-tw.tsx';
  } else if (usingBetterAuth && !usingTw) {
    indexFile = 'with-better-auth.tsx';
  } else if (usingTw) {
    indexFile = 'with-tw.tsx';
  }

  const indexSrc = path.join(indexFileDir, indexFile);
  const indexDest = path.join(projectDir, 'src/app/page.tsx');
  fs.copySync(indexSrc, indexDest);
};
