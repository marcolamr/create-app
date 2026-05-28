import path from 'node:path';

export function parseNameAndPath(appName: string): [scopedName: string, dirName: string] {
  if (appName === '.') {
    const base = path.basename(process.cwd());
    return [base, '.'];
  }

  const dirName = appName.replace(/\s/g, '-').toLowerCase();
  const scopedName = appName.startsWith('@') ? appName : dirName;
  return [scopedName, dirName];
}
