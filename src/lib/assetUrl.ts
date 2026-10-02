import { API_BASE_URL } from '../api/client'

/**
 * Resolves a possibly-relative asset path (e.g. an uploaded or
 * link-preview image at '/uploads/xyz.png') returned by the API into an
 * absolute URL pointing at the API host.
 *
 * In local dev (no VITE_API_URL set), this is a no-op and the relative
 * path is used as-is, relying on Vite's dev server proxy for '/uploads'.
 *
 * Absolute URLs (e.g. a full 'https://...' image URL) are passed through
 * unchanged.
 */
export function resolveAssetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  if (/^https?:\/\//i.test(path)) return path
  if (!API_BASE_URL) return path
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
