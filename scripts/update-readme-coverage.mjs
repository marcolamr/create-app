#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const summaryPath = path.join(root, 'apps/cli/coverage/coverage-summary.json');
const readmePath = path.join(root, 'README.md');

if (!fs.existsSync(summaryPath)) {
  console.error(`Coverage summary not found: ${summaryPath}`);
  console.error('Run pnpm --filter @madda/app test:coverage first.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;

function pct(metric) {
  return Math.round(total[metric].pct);
}

function badge(label, value, color) {
  const encoded = encodeURIComponent(`${label}: ${value}%`);
  return `![${label}](https://img.shields.io/badge/${encoded}-${color}?style=flat-square)`;
}

const lines = pct('lines');
const statements = pct('statements');
const branches = pct('branches');
const functions = pct('functions');

const color = (value) => (value >= 90 ? 'brightgreen' : value >= 80 ? 'yellowgreen' : 'orange');

const badges = [
  badge('coverage', lines, color(lines)),
  badge('statements', statements, color(statements)),
  badge('branches', branches, color(branches)),
  badge('functions', functions, color(functions)),
].join(' ');

const table = `| Métrica | Cobertura |
|---------|-----------|
| Linhas | ${lines}% |
| Statements | ${statements}% |
| Branches | ${branches}% |
| Functions | ${functions}% |`;

const start = '<!-- coverage:start -->';
const end = '<!-- coverage:end -->';

const block = `${start}
${badges}

${table}

> Atualizado por \`pnpm test:coverage\`. Relatório HTML em \`apps/cli/coverage/index.html\`.
${end}`;

let readme = fs.readFileSync(readmePath, 'utf8');

if (readme.includes(start)) {
  readme = readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block);
} else {
  const anchor = '[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)';
  readme = readme.replace(anchor, `${anchor}\n${block}`);
}

fs.writeFileSync(readmePath, readme);
console.log(`README coverage updated: lines ${lines}%, statements ${statements}%`);
