import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Comment } from '../../types'
import { createComment, deleteComment } from '../../api/comments'
import { uploadImage } from '../../api/upload'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { useStore } from '../../store'
import { format } from 'date-fns'

interface Props {
  ideaId: string
  comments: Comment[]
  onRefetch: () => void
  parentId?: string
  depth?: number
}

export default function CommentThread({ ideaId, comments, onRefetch, parentId, depth = 0 }: Props) {
  const user = useStore((s) => s.user)
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const post = useMutation({
    mutationFn: () =>
      createComment(ideaId, { content: text, image_url: imageUrl || undefined, parent_id: parentId }),
    onSuccess: () => {
      setText('')
      setImageUrl('')
      onRefetch()
    },
  })

  const del = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: onRefetch,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={depth > 0 ? 'ml-6 border-l border-gray-100 pl-4 mt-2' : ''}>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4">
          <div className="flex items-start gap-2">
            {/* Avatar */}
            <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-xs font-medium text-gray-600">
              {comment.owner.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-700">{comment.owner.username}</span>
                <span className="text-xs text-gray-400">
                  {format(new Date(comment.created_at), 'MMM d')}
                </span>
                {comment.owner_id === user?.id && (
                  <button
                    onClick={() => del.mutate(comment.id)}
                    className="text-xs text-gray-300 hover:text-red-400 ml-auto"
                  >
                    delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              {comment.image_url && (
                <img
                  src={resolveAssetUrl(comment.image_url)}
                  alt=""
                  className="mt-2 rounded-lg max-h-48 object-cover w-full"
                />
              )}
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-gray-400 hover:text-gray-600 mt-1"
              >
                Reply
              </button>
            </div>
          </div>

          {/* Nested replies */}
          {comment.replies.length > 0 && (
            <CommentThread
              ideaId={ideaId}
              comments={comment.replies}
              onRefetch={onRefetch}
              depth={depth + 1}
            />
          )}

          {/* Reply box */}
          {replyingTo === comment.id && (
            <ReplyBox
              ideaId={ideaId}
              parentId={comment.id}
              onDone={() => { setReplyingTo(null); onRefetch() }}
            />
          )}
        </div>
      ))}

      {/* Top-level comment box */}
      {depth === 0 && (
        <div className="mt-2">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-xs font-medium text-gray-600">
              {user?.username?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
              {imageUrl && (
                <div className="relative mt-1">
                  <img src={imageUrl} alt="" className="rounded-lg max-h-32 object-cover" />
                  <button
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between mt-1.5">
                <div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    {uploading ? 'Uploading...' : '📎 Image'}
                  </button>
                </div>
                <button
                  onClick={() => post.mutate()}
                  disabled={!text.trim() || post.isPending}
                  className="px-3 py-1 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ReplyBox({ ideaId, parentId, onDone }: { ideaId: string; parentId: string; onDone: () => void }) {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const post = useMutation({
    mutationFn: () => createComment(ideaId, { content: text, image_url: imageUrl || undefined, parent_id: parentId }),
    onSuccess: onDone,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="ml-8 mt-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        rows={2}
        autoFocus
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
      />
      {imageUrl && (
        <div className="relative mt-1">
          <img src={imageUrl} alt="" className="rounded-lg max-h-28 object-cover" />
          <button onClick={() => setImageUrl('')} className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">✕</button>
        </div>
      )}
      <div className="flex items-center justify-between mt-1.5">
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="text-xs text-gray-400 hover:text-gray-600">
            {uploading ? 'Uploading...' : '📎 Image'}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={onDone} className="text-xs text-gray-400 hover:text-gray-700">Cancel</button>
          <button
            onClick={() => post.mutate()}
            disabled={!text.trim() || post.isPending}
            className="px-3 py-1 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}
