export function parseDate(raw: string, options: Intl.DateTimeFormatOptions) {
  const truncated = raw.replace(/(\.\d{3})\d+$/, '$1');

  return new Date(truncated).toLocaleDateString('en-US', options);
}

export function getErrorMessage(err: unknown, fallback: string): string {
  console.log(err);
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
