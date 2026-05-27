import { execSync } from 'node:child_process';

execSync('pnpm changeset version', { stdio: 'inherit' });
execSync('pnpm install', { stdio: 'inherit' });
