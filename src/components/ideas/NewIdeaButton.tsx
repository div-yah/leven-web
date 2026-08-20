import { useState } from 'react'
import { useStore } from '../../store'
import NewIdeaModal from './NewIdeaModal'

export default function NewIdeaButton() {
  const [open, setOpen] = useState(false)
  const { currentCategory } = useStore()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        + New Idea
      </button>
      {open && (
        <NewIdeaModal
          defaultCategoryId={currentCategory?.id ?? null}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
