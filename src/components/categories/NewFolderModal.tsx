import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createCategory } from '../../api/categories'

interface Props {
  parentId: string | null
  onClose: () => void
  onCreated: () => void
}

const ICONS = ['📁', '💡', '🎨', '📝', '🚀', '📚', '🔧', '🌱', '⭐', '🎯']

export default function NewFolderModal({ parentId, onClose, onCreated }: Props) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📁')

  const create = useMutation({
    mutationFn: () => createCategory({ name, icon, parent_id: parentId }),
    onSuccess: onCreated,
  })

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-gray-900 mb-4">New folder</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {ICONS.map((i) => (
            <button
              key={i}
              onClick={() => setIcon(i)}
              className={`text-xl p-1.5 rounded-lg transition-colors ${
                icon === i ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Folder name"
          autoFocus
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) create.mutate() }}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={() => create.mutate()}
            disabled={!name.trim() || create.isPending}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
