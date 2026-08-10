export function parseDate(raw: string, options: Intl.DateTimeFormatOptions) {
  const truncated = raw.replace(/(\.\d{3})\d+$/, '$1');

  return new Date(truncated).toLocaleDateString('en-US', options);
}
