import { Idea } from '../../types'
import { tagColor, DEFAULT_COLOR } from '../ui/tagColors'
import { format } from 'date-fns'

interface Props {
  idea: Idea
  selected: boolean
  onClick: () => void
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-300',
  active: 'bg-green-400',
  archived: 'bg-gray-400',
}

export default function StickyCard({ idea, selected, onClick }: Props) {
  const color = idea.tags.length > 0 ? tagColor(idea.tags[0].name) : DEFAULT_COLOR

  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color.bg, borderColor: selected ? '#1f2937' : color.border }}
      className={`w-44 min-h-[11rem] rounded-2xl border-2 p-4 text-left flex flex-col gap-2 transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
        selected ? 'ring-2 ring-gray-900 ring-offset-1' : ''
      }`}
    >
      {/* Content type indicator */}
      {idea.content_type === 'link' && (
        <span className="text-xs text-gray-400">🔗</span>
      )}
      {idea.content_type === 'image' && idea.image_url && (
        <img
          src={idea.image_url}
          alt=""
          className="w-full h-16 object-cover rounded-lg mb-1"
        />
      )}

      {/* Title */}
      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{idea.title}</p>

      {/* Text preview */}
      {idea.content && (
        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed flex-1">{idea.content}</p>
      )}
      {idea.link && !idea.content && (
        <p className="text-xs text-gray-400 truncate">{idea.link}</p>
      )}

      <div className="mt-auto pt-2 flex flex-col gap-1.5">
        {/* Tags */}
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="text-xs text-gray-500">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Status + date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[idea.status]}`} />
            <span className="text-xs text-gray-400">{idea.status}</span>
          </div>
          <span className="text-xs text-gray-400">
            {format(new Date(idea.created_at), 'MMM d')}
          </span>
        </div>
      </div>
    </button>
  )
}
