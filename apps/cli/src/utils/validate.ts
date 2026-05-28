export function validateAppName(value: string | undefined): string | undefined {
  if (!value?.trim()) return 'Name is required';
  if (value === '.') return undefined;
  if (!/^[a-zA-Z0-9@/_-]+$/.test(value.replace(/\s/g, '-'))) {
    return 'Use letters, numbers, @, /, _, - only';
  }
  return undefined;
}
