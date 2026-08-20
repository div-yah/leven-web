import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories'
import { getIdeas } from '../api/ideas'
import { Category } from '../types'
import { useStore } from '../store'
import StickyCard from '../components/ideas/StickyCard'
import IdeaPanel from '../components/ideas/IdeaPanel'
import FolderCard from '../components/categories/FolderCard'
import Breadcrumb from '../components/ui/Breadcrumb'
import NewFolderModal from '../components/categories/NewFolderModal'
import NewIdeaModal from '../components/ideas/NewIdeaModal'

export default function IdeasPage() {
  const { selectedIdea, setSelectedIdea } = useStore()
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([])
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [showNewIdea, setShowNewIdea] = useState(false)

  const { data: allCategories = [], refetch: refetchCats } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data: ideas = [], refetch: refetchIdeas } = useQuery({
    queryKey: ['ideas', currentCategory?.id ?? 'root'],
    queryFn: () =>
      currentCategory
        ? getIdeas({ category_id: currentCategory.id })
        : getIdeas({ root_only: true }),
  })

  // Find children of current category
  const subfolders: Category[] = currentCategory
    ? currentCategory.children
    : allCategories // root level: top-level categories

  const navigateInto = (cat: Category) => {
    setBreadcrumb((prev) => [...prev, cat])
    setCurrentCategory(cat)
    setSelectedIdea(null)
  }

  const navigateTo = (index: number) => {
    if (index === -1) {
      setBreadcrumb([])
      setCurrentCategory(null)
    } else {
      const newPath = breadcrumb.slice(0, index + 1)
      setBreadcrumb(newPath)
      setCurrentCategory(newPath[newPath.length - 1])
    }
    setSelectedIdea(null)
  }

  return (
    <div className="flex h-full">
      {/* Content area */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-thin transition-all duration-300 ${
          selectedIdea ? 'pr-0' : ''
        }`}
      >
        <div className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb
            items={breadcrumb}
            onNavigate={navigateTo}
            currentCategory={currentCategory}
          />

          {/* Subfolders — always show this section */}
          <section className="mb-8">
            {subfolders.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Folders</h2>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {subfolders.map((cat) => (
                <FolderCard key={cat.id} category={cat} onClick={() => navigateInto(cat)} onRefetch={refetchCats} />
              ))}
              <button
                onClick={() => setShowNewFolder(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
              >
                <span className="text-lg leading-none">+</span>
                New folder
              </button>
            </div>
          </section>

          {/* Ideas */}
          <section>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Ideas</h2>
            <div className="flex flex-wrap gap-4">
              {ideas.map((idea) => (
                <StickyCard
                  key={idea.id}
                  idea={idea}
                  selected={selectedIdea?.id === idea.id}
                  onClick={() => setSelectedIdea(selectedIdea?.id === idea.id ? null : idea)}
                />
              ))}
              {/* Inline new idea button — same size as sticky cards */}
              <button
                onClick={() => setShowNewIdea(true)}
                className="w-44 min-h-[11rem] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                <span className="text-2xl leading-none">+</span>
                <span className="text-sm">New Idea</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Slide-in detail panel */}
      {selectedIdea && (
        <IdeaPanel
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onUpdated={(updated) => {
            setSelectedIdea(updated)
            refetchIdeas()
          }}
          onDeleted={() => {
            setSelectedIdea(null)
            refetchIdeas()
          }}
        />
      )}

      {showNewFolder && (
        <NewFolderModal
          parentId={currentCategory?.id ?? null}
          onClose={() => setShowNewFolder(false)}
          onCreated={() => {
            refetchCats()
            setShowNewFolder(false)
          }}
        />
      )}

      {showNewIdea && (
        <NewIdeaModal
          defaultCategoryId={currentCategory?.id ?? null}
          onClose={() => {
            setShowNewIdea(false)
            refetchIdeas()
          }}
        />
      )}
    </div>
  )
}
