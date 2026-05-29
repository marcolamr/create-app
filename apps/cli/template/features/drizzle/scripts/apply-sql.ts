import 'dotenv/config';

import { Pool } from '@neondatabase/serverless';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const sqlDir = join(process.cwd(), 'drizzle', 'sql');

function getConnectionUrl(): string {
  const url = process.env.DATABASE_URL_MIGRATE ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL or DATABASE_URL_MIGRATE must be set');
  }
  return url;
}

function listSqlFiles(specificFile?: string): string[] {
  if (specificFile) {
    const name = specificFile.endsWith('.sql') ? specificFile : `${specificFile}.sql`;
    return [join(sqlDir, name)];
  }

  return readdirSync(sqlDir)
    .filter((name) => name.endsWith('.sql'))
    .sort()
    .map((name) => join(sqlDir, name));
}

async function main(): Promise<void> {
  const specificFile = process.argv[2];
  const files = listSqlFiles(specificFile);

  if (files.length === 0) {
    console.error('No SQL files found in drizzle/sql');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: getConnectionUrl() });

  try {
    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      const label = file.split(/[/\\]/).pop() ?? file;
      console.log(`Applying ${label}...`);
      await pool.query(content);
      console.log(`Done: ${label}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Failed to apply SQL:', error);
  process.exit(1);
});
