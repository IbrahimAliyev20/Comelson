/**
 * API-dən gələn nisbi media yolu (məs. `/assets/storage/...`) tam URL-ə çevirir.
 */
export function resolveAuthMediaUrl(
  path: string | null | undefined
): string | null {
  if (!path?.trim()) return null
  const p = path.trim()
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? ''
  if (!base) return p.startsWith('/') ? p : `/${p}`
  return `${base}${p.startsWith('/') ? '' : '/'}${p}`
}
