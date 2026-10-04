import { Category } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '../../api/categories'
import { useStore } from '../../store'

interface Props {
  category: Category
  onClick: () => void
  onRefetch: () => void
}

export default function FolderCard({ category, onClick, onRefetch }: Props) {
  const queryClient = useQueryClient()
  const currentUser = useStore((s) => s.user)

  const isOwner = category.owner_id === currentUser?.id
  // Mirrors the backend rule: you can't delete a category that was
  // shared with you directly (only nested sub-folders you have via
  // inherited/ancestor access, or your own categories).
  const isDirectlySharedWithMe =
    !isOwner && category.shared_with.some((u) => u.id === currentUser?.id)
  const canDelete = isOwner || !isDirectlySharedWithMe

  const del = useMutation({
    mutationFn: () => deleteCategory(category.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onRefetch()
    },
  })

  return (
    <div className="group relative w-36">
      {/* Folder tab on top */}
      <div className="flex">
        <div
          className="h-2.5 w-14 rounded-tl-md rounded-tr-md bg-gray-200 group-hover:bg-gray-300 transition-colors"
          style={{ marginBottom: '-1px' }}
        />
      </div>

      {/* Folder body */}
      <button
        onClick={onClick}
        className="w-full flex flex-col items-start gap-1.5 px-4 pt-3 pb-3 rounded-b-xl rounded-tr-xl border border-gray-200 bg-gray-50 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all text-left shadow-sm"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xl">{category.icon || '📁'}</span>
          {category.is_shared && (
            <span
              className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600"
              title={`Shared by @${category.owner?.username}`}
            >
              {category.owner?.username.charAt(0).toUpperCase()}
            </span>
          )}
          {!category.is_shared && category.shared_with.length > 0 && (
            <span
              className="text-xs text-gray-400"
              title={`Shared with ${category.shared_with.map((u) => '@' + u.username).join(', ')}`}
            >
              👥 {category.shared_with.length}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-gray-800 truncate w-full">{category.name}</span>
        <span className="text-xs text-gray-400">
          {category.idea_count} {category.idea_count === 1 ? 'idea' : 'ideas'}
          {category.children.length > 0 && ` · ${category.children.length} folders`}
        </span>
      </button>

      {/* Delete button */}
      {canDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); del.mutate() }}
          className="absolute top-3 right-1.5 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs px-1"
          title="Delete folder"
        >
          ✕
        </button>
      )}
    </div>
  )
}
