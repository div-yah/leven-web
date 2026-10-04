import { Idea } from '../../types'
import { tagColor, DEFAULT_COLOR } from '../ui/tagColors'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { useStore } from '../../store'
import { format } from 'date-fns'

interface Props {
  idea: Idea
  selected: boolean
  onClick: () => void
}

export default function StickyCard({ idea, selected, onClick }: Props) {
  const currentUser = useStore((s) => s.user)
  const isOwnIdea = !idea.owner || idea.owner.id === currentUser?.id
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
      {(idea.content_type === 'image' || idea.content_type === 'link') && idea.image_url && (
        <img
          src={resolveAssetUrl(idea.image_url)}
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

        {/* Date + author (shown when someone else created it in a shared folder) */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {format(new Date(idea.created_at), 'MMM d')}
          </span>
          {!isOwnIdea && idea.owner && (
            <span
              className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-medium text-gray-600"
              title={`By @${idea.owner.username}`}
            >
              {idea.owner.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
