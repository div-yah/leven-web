// Deterministic pastel color from tag name
const PALETTES = [
  { bg: '#FEF9C3', border: '#FDE047' }, // yellow
  { bg: '#DBEAFE', border: '#93C5FD' }, // blue
  { bg: '#DCFCE7', border: '#86EFAC' }, // green
  { bg: '#FCE7F3', border: '#F9A8D4' }, // pink
  { bg: '#EDE9FE', border: '#C4B5FD' }, // purple
  { bg: '#FFEDD5', border: '#FDBA74' }, // orange
  { bg: '#CFFAFE', border: '#67E8F9' }, // cyan
  { bg: '#F0FDF4', border: '#BBF7D0' }, // mint
]

export function tagColor(tagName: string) {
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTES[Math.abs(hash) % PALETTES.length]
}

export const DEFAULT_COLOR = { bg: '#F9FAFB', border: '#E5E7EB' }
