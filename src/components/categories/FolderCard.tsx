import { Category } from '../../types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '../../api/categories'

interface Props {
  category: Category
  onClick: () => void
  onRefetch: () => void
}

export default function FolderCard({ category, onClick, onRefetch }: Props) {
  const queryClient = useQueryClient()

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
        <span className="text-xl">{category.icon || '📁'}</span>
        <span className="text-sm font-medium text-gray-800 truncate w-full">{category.name}</span>
        <span className="text-xs text-gray-400">
          {category.idea_count} {category.idea_count === 1 ? 'idea' : 'ideas'}
          {category.children.length > 0 && ` · ${category.children.length} folders`}
        </span>
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); del.mutate() }}
        className="absolute top-3 right-1.5 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs px-1"
        title="Delete folder"
      >
        ✕
      </button>
    </div>
  )
}
