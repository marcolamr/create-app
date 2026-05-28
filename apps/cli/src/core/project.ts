import fs from 'fs-extra';
import path from 'node:path';
import sortPackageJson from 'sort-package-json';
import type { PackageJson } from 'type-fest';

import { TEMPLATE_ROOT } from './paths.js';
import type { FeatureId, StackOptions } from './types.js';
import { DEP_VERSIONS, type DepName } from './versions.js';

export class Project {
  readonly replacements: Record<string, string>;

  constructor(
    readonly dir: string,
    readonly name: string,
    readonly scopedName: string,
    readonly stack: StackOptions,
  ) {
    this.replacements = {
      'project1_${name}': `${scopedName}_\${name}`,
      'project1_*': `${scopedName}_*`,
      project1: scopedName,
    };
  }

  has(feature: FeatureId): boolean {
    return this.stack[feature];
  }

  usesDrizzle(): boolean {
    return this.stack.drizzle !== false;
  }

  get drizzleProvider(): 'postgres' | 'neon' {
    if (this.stack.drizzle === false) {
      throw new Error('Drizzle is not enabled for this project');
    }
    return this.stack.drizzle;
  }

  /** Resolve a path under template/ */
  tpl(...segments: string[]): string {
    return path.join(TEMPLATE_ROOT, ...segments);
  }

  /** Copy template file → project file (paths relative to project root). */
  copy(
    templatePath: string,
    destPath: string,
    extraReplace?: Record<string, string>,
  ): void {
    const src = this.tpl(templatePath);
    const dest = path.join(this.dir, destPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (!fs.existsSync(src)) {
      throw new Error(`Template missing: ${templatePath}`);
    }

    let content = fs.readFileSync(src, 'utf8');
    for (const [from, to] of Object.entries({ ...this.replacements, ...extraReplace })) {
      content = content.replaceAll(from, to);
    }

    fs.writeFileSync(dest, content);
  }

  copyRaw(templatePath: string, destPath: string): void {
    const src = this.tpl(templatePath);
    const dest = path.join(this.dir, destPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  addDeps(...names: DepName[]): void {
    this.mergeDeps(names, false);
  }

  addDevDeps(...names: DepName[]): void {
    this.mergeDeps(names, true);
  }

  addScripts(scripts: Record<string, string>): void {
    const pkgPath = path.join(this.dir, 'package.json');
    const pkg = fs.readJsonSync(pkgPath) as PackageJson;
    pkg.scripts = { ...pkg.scripts, ...scripts };
    fs.writeJsonSync(pkgPath, sortPackageJson(pkg), { spaces: 2 });
  }

  write(relativePath: string, content: string): void {
    const dest = path.join(this.dir, relativePath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  }

  private mergeDeps(names: DepName[], dev: boolean): void {
    const pkgPath = path.join(this.dir, 'package.json');
    const pkg = fs.readJsonSync(pkgPath) as PackageJson;
    const field = dev ? 'devDependencies' : 'dependencies';

    pkg[field] ??= {};
    for (const name of names) {
      pkg[field]![name] = DEP_VERSIONS[name];
    }

    fs.writeJsonSync(pkgPath, sortPackageJson(pkg), { spaces: 2 });
  }
}
