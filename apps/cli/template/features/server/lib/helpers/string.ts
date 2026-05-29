const invisibleCharRegex = '[\\s\\p{C}\u034f\u17b4\u17b5\u2800\u115f\u1160\u3164\uffa0]';
const trimStartRegex = new RegExp(`^${invisibleCharRegex}+`, 'u');
const trimEndRegex = new RegExp(`(?:${invisibleCharRegex})+$`, 'u');

const ELLIPSIS = '...';
const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

export function trimStart(str: string): string {
  return str.replace(trimStartRegex, '');
}

export function trimEnd(str: string): string {
  return str.replace(trimEndRegex, '');
}

/**
 * Encurta por **grapheme cluster** (Intl.Segmenter), com reticências contando no limite.
 */
export function truncate(str: string, maxLength: number): string {
  if (!Number.isFinite(maxLength)) {
    return str;
  }
  if (str.length <= maxLength) {
    return str;
  }
  if (maxLength <= 0) {
    return '';
  }

  const ellipsis = ELLIPSIS.slice(0, maxLength);
  const maxGraphemes = maxLength - ellipsis.length;
  if (maxGraphemes <= 0) {
    return ellipsis;
  }

  const parts: string[] = [];
  let n = 0;
  for (const { segment } of graphemeSegmenter.segment(str)) {
    if (n >= maxGraphemes) {
      return trimEnd(parts.join('')) + ellipsis;
    }
    parts.push(segment);
    n += 1;
  }

  return str;
}
