import removeMarkdown from 'remove-markdown';

import logger from '@/server/logger';
import { trimEnd, trimStart, truncate } from '@/lib/helpers/string';

type LibRemoveMarkdownOptions = NonNullable<Parameters<typeof removeMarkdown>[1]>;

export type CustomRemoveMarkdownOptions = Partial<LibRemoveMarkdownOptions> & {
  /** Junta quebras em um único espaço (padrão: true). */
  oneLine?: boolean;
  /** Aplica `trimStart` / `trimEnd` do projeto (padrão: true). */
  trim?: boolean;
  maxLength?: number;
  /** Se true (padrão), registra erros no logger quando o strip falhar. */
  logError?: boolean;
};

export default function customRemoveMarkdown(
  md: string | null | undefined,
  options: CustomRemoveMarkdownOptions = {},
): string {
  const input = md ?? '';
  const {
    oneLine = true,
    trim: trimEnabled = true,
    maxLength,
    logError = true,
    ...libOptions
  } = options;

  try {
    let output = removeMarkdown(input, {
      ...libOptions,
      throwError: true,
    });

    if (oneLine) {
      output = output.replace(/\s+/g, ' ');
    }

    if (trimEnabled) {
      output = trimStart(output);
      output = trimEnd(output);
    }

    return maxLength !== undefined ? truncate(output, maxLength) : output;
  } catch (error) {
    if (logError) {
      logger.error(error);
    }
    return input;
  }
}
