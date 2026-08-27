import { Idea } from '../../types'
import { tagColor, DEFAULT_COLOR } from '../ui/tagColors'
import { format } from 'date-fns'

interface Props {
  idea: Idea
  selected: boolean
  onClick: () => void
}

export default function StickyCard({ idea, selected, onClick }: Props) {
  const firstTag = idea.tags[0]
  const cardColor = firstTag
    ? tagColor(firstTag.name, firstTag.color)
    : DEFAULT_COLOR

  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: cardColor.bg, borderColor: selected ? '#1f2937' : cardColor.border }}
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

      <div className="mt-auto pt-2 flex flex-col gap-2">
        {/* Colored tag pills */}
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.tags.slice(0, 3).map((tag) => {
              const c = tagColor(tag.name, tag.color)
              return (
                <span
                  key={tag.id}
                  style={{ backgroundColor: c.labelBg, color: c.label }}
                  className="text-xs font-medium px-1.5 py-0.5 rounded-md"
                >
                  {tag.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Date */}
        <span className="text-xs text-gray-400">
          {format(new Date(idea.created_at), 'MMM d')}
        </span>
      </div>
    </button>
  )
}
