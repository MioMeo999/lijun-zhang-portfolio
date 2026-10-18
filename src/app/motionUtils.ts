/** Reads a CSS time token such as `300ms` or `.92s` into milliseconds. */
export function readDurationMs(value: string, fallback: number) {
  const match = value.trim().match(/^([\d.]+)(ms|s)$/)
  if (!match) return fallback
  return parseFloat(match[1]) * (match[2] === 's' ? 1000 : 1)
}
