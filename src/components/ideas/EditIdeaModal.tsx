import { useState, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateIdea } from '../../api/ideas'
import { getTags, createTag } from '../../api/tags'
import { getCategories } from '../../api/categories'
import { uploadImage } from '../../api/upload'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { Idea, IdeaContentType, IdeaStatus, Tag } from '../../types'
import { randomPaletteKey } from '../ui/tagColors'

interface Props {
  idea: Idea
  onClose: () => void
  onUpdated: (idea: Idea) => void
}

export default function EditIdeaModal({ idea, onClose, onUpdated }: Props) {
  const qc = useQueryClient()
  const [title, setTitle] = useState(idea.title)
  const [content, setContent] = useState(idea.content ?? '')
  const [link, setLink] = useState(idea.link ?? '')
  const [imageUrl, setImageUrl] = useState(idea.image_url ?? '')
  const [contentType, setContentType] = useState<IdeaContentType>(idea.content_type)
  const [status, setStatus] = useState<IdeaStatus>(idea.status)
  const [categoryId, setCategoryId] = useState<string | null>(idea.category_id)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(idea.tags.map((t) => t.id))
  const [newTagName, setNewTagName] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: tags = [] } = useQuery({ queryKey: ['tags'], queryFn: getTags })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const flatCats = flattenCategories(categories)

  const save = useMutation({
    mutationFn: () =>
      updateIdea(idea.id, {
        title,
        content: contentType === 'text' ? content : undefined,
        link: contentType === 'link' ? link : undefined,
        image_url: contentType === 'image' ? imageUrl : undefined,
        content_type: contentType,
        status,
        category_id: categoryId,
        tag_ids: selectedTagIds,
      }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['ideas'] })
      onUpdated(updated)
    },
  })

  const addTag = useMutation({
    mutationFn: () => createTag({ name: newTagName.trim(), color: randomPaletteKey() }),
    onSuccess: (tag: Tag) => {
      qc.invalidateQueries({ queryKey: ['tags'] })
      setSelectedTagIds((ids) => [...ids, tag.id])
      setNewTagName('')
    },
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

  const toggleTag = (id: string) =>
    setSelectedTagIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]))

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Edit Idea</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base font-medium border-b border-gray-200 pb-2 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div className="flex gap-2 mb-4">
          {(['text', 'link', 'image'] as IdeaContentType[]).map((t) => (
            <button
              key={t}
              onClick={() => setContentType(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                contentType === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {contentType === 'text' && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4 resize-none"
          />
        )}
        {contentType === 'link' && (
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
          />
        )}
        {contentType === 'image' && (
          <div className="mb-4">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {imageUrl ? (
              <div className="relative">
                <img src={resolveAssetUrl(imageUrl)} alt="" className="w-full rounded-xl object-cover max-h-48" />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
              >
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </button>
            )}
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              value={categoryId ?? ''}
              onChange={(e) => setCategoryId(e.target.value || null)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">No category</option>
              {flatCats.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IdeaStatus)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 mb-2">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag..."
              className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
              onKeyDown={(e) => { if (e.key === 'Enter' && newTagName.trim()) addTag.mutate() }}
            />
            <button
              onClick={() => addTag.mutate()}
              disabled={!newTagName.trim()}
              className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={() => save.mutate()}
            disabled={!title.trim() || save.isPending}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {save.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function flattenCategories(cats: any[], prefix = ''): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = []
  for (const cat of cats) {
    const label = prefix ? `${prefix} > ${cat.name}` : cat.name
    result.push({ id: cat.id, label })
    if (cat.children?.length) result.push(...flattenCategories(cat.children, label))
  }
  return result
}
