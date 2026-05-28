# CLI development

The CLI scaffolds Next.js apps by copying a **base template** and applying **features**.

## Add a feature (3 steps)

1. Put template files in `template/features/<name>/`
2. Register paths in `src/core/templates.ts`
3. Create `src/features/<name>.ts` and add it to `FEATURES` in `src/features/index.ts`

Example feature:

```ts
import { TEMPLATE } from '../core/templates.js';
import type { Feature } from '../core/types.js';

export const myFeature: Feature = {
  id: 'my-feature',
  when: (stack) => stack.myFeature, // optional
  apply(project) {
    project.addDeps('some-package');
    project.copyRaw(TEMPLATE.myFeature.file, 'src/where/it/goes.ts');
  },
};
```

## Core abstractions

| Module         | Role                                                     |
| -------------- | -------------------------------------------------------- |
| `Project`      | `copy`, `copyRaw`, `addDeps`, `addScripts`, replacements |
| `TEMPLATE`     | Single map of all template paths                         |
| `DEP_VERSIONS` | Pinned dependency versions                               |
| `FEATURES`     | Ordered list of feature appliers                         |

## Layout

```
src/
  index.ts              entry
  prompts.ts            CLI flags + interactive prompts
  create-project.ts     orchestration
  core/                 project, scaffold, templates, versions
  features/             one file per stack feature
  utils/                git, paths, next steps
template/
  base/                 minimal Next.js app
  features/             feature-specific files
```

Legacy CLI was previously `@madda/create-app` (renamed to `@madda/app`).
