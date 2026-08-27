export const PALETTES = [
  { bg: '#FEF9C3', border: '#FDE047', label: '#854D0E', labelBg: '#FEF08A' }, // yellow
  { bg: '#DBEAFE', border: '#93C5FD', label: '#1E40AF', labelBg: '#BFDBFE' }, // blue
  { bg: '#DCFCE7', border: '#86EFAC', label: '#166534', labelBg: '#BBF7D0' }, // green
  { bg: '#FCE7F3', border: '#F9A8D4', label: '#9D174D', labelBg: '#FBCFE8' }, // pink
  { bg: '#EDE9FE', border: '#C4B5FD', label: '#5B21B6', labelBg: '#DDD6FE' }, // purple
  { bg: '#FFEDD5', border: '#FDBA74', label: '#9A3412', labelBg: '#FED7AA' }, // orange
  { bg: '#CFFAFE', border: '#67E8F9', label: '#155E75', labelBg: '#A5F3FC' }, // cyan
  { bg: '#F0FDF4', border: '#BBF7D0', label: '#14532D', labelBg: '#BBF7D0' }, // mint
]

/** Pick a random palette index and return it as a string key to store in DB */
export function randomPaletteKey(): string {
  return String(Math.floor(Math.random() * PALETTES.length))
}

/** Resolve a palette from stored key (index string) or fall back to hash of name */
export function tagColor(tagName: string, storedKey?: string | null) {
  if (storedKey !== null && storedKey !== undefined) {
    const index = parseInt(storedKey, 10)
    if (!isNaN(index) && index >= 0 && index < PALETTES.length) {
      return PALETTES[index]
    }
  }
  // fallback: deterministic from name
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTES[Math.abs(hash) % PALETTES.length]
}

/** Card background color — driven by first tag */
export function cardColorFromTag(tagName: string, storedKey?: string | null) {
  return tagColor(tagName, storedKey)
}

export const DEFAULT_COLOR = { bg: '#F9FAFB', border: '#E5E7EB', label: '#6B7280', labelBg: '#F3F4F6' }
