import { create } from 'zustand'
import { User, Idea, Category } from '../types'

interface AppStore {
  user: User | null
  setUser: (user: User | null) => void

  // Currently browsed category (null = root)
  currentCategory: Category | null
  setCurrentCategory: (cat: Category | null) => void

  // Category breadcrumb path
  categoryPath: Category[]
  setCategoryPath: (path: Category[]) => void

  // Selected idea for slide-in panel
  selectedIdea: Idea | null
  setSelectedIdea: (idea: Idea | null) => void
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  currentCategory: null,
  setCurrentCategory: (cat) => set({ currentCategory: cat }),

  categoryPath: [],
  setCategoryPath: (path) => set({ categoryPath: path }),

  selectedIdea: null,
  setSelectedIdea: (idea) => set({ selectedIdea: idea }),
}))
