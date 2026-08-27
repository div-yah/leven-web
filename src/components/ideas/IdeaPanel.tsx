import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Idea } from '../../types'
import { getComments } from '../../api/comments'
import { deleteIdea, updateIdea } from '../../api/ideas'
import { format } from 'date-fns'
import { tagColor, DEFAULT_COLOR } from '../ui/tagColors'
import CommentThread from '../comments/CommentThread'
import EditIdeaModal from './EditIdeaModal'

interface Props {
  idea: Idea
  onClose: () => void
  onUpdated: (idea: Idea) => void
  onDeleted: () => void
}

const STATUS_DOT: Record<string, string> = {
  draft: 'bg-gray-300',
  active: 'bg-green-400',
  archived: 'bg-gray-400',
}

export default function IdeaPanel({ idea, onClose, onUpdated, onDeleted }: Props) {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const firstTag = idea.tags[0]
  const color = firstTag ? tagColor(firstTag.name, firstTag.color) : DEFAULT_COLOR

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['comments', idea.id],
    queryFn: () => getComments(idea.id),
  })

  const del = useMutation({
    mutationFn: () => deleteIdea(idea.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ideas'] })
      onDeleted()
    },
  })

  return (
    <>
      <div
        className="w-96 border-l border-gray-100 bg-white flex flex-col h-full shrink-0 shadow-xl"
        style={{ borderTopColor: color.border }}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100" style={{ borderTopWidth: 3, borderTopColor: color.border, borderTopStyle: 'solid', borderRadius: '0' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${STATUS_DOT[idea.status]}`} />
              <span className="text-xs text-gray-400 capitalize">{idea.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => { if (confirm('Delete this idea?')) del.mutate() }}
                className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                Delete
              </button>
              <button onClick={onClose} className="text-gray-300 hover:text-gray-600 ml-1">✕</button>
            </div>
          </div>

          <h2 className="text-base font-semibold text-gray-900 leading-snug mb-2">{idea.title}</h2>

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {idea.tags.map((tag) => {
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

          <p className="text-xs text-gray-400">
            {format(new Date(idea.created_at), 'MMM d, yyyy')}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {/* Content */}
          {idea.content_type === 'text' && idea.content && (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-5">{idea.content}</p>
          )}
          {idea.content_type === 'link' && idea.link && (
            <a
              href={idea.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-500 hover:underline break-all mb-5 block"
            >
              {idea.link}
            </a>
          )}
          {idea.content_type === 'image' && idea.image_url && (
            <img src={idea.image_url} alt="" className="w-full rounded-xl mb-5 object-cover" />
          )}

          {/* Comments */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
              Comments ({comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)})
            </h3>
            <CommentThread ideaId={idea.id} comments={comments} onRefetch={refetchComments} />
          </div>
        </div>
      </div>

      {editing && (
        <EditIdeaModal
          idea={idea}
          onClose={() => setEditing(false)}
          onUpdated={(updated) => {
            setEditing(false)
            onUpdated(updated)
          }}
        />
      )}
    </>
  )
}
