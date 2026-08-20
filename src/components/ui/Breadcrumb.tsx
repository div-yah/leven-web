import { Category } from '../../types'

interface Props {
  items: Category[]
  currentCategory: Category | null
  onNavigate: (index: number) => void
}

export default function Breadcrumb({ items, onNavigate }: Props) {
  return (
    <div className="flex items-center gap-1 mb-6 text-sm">
      <button
        onClick={() => onNavigate(-1)}
        className="text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        All Ideas
      </button>
      {items.map((item, i) => (
        <span key={item.id} className="flex items-center gap-1">
          <span className="text-gray-300">/</span>
          <button
            onClick={() => onNavigate(i)}
            className={`transition-colors font-medium ${
              i === items.length - 1
                ? 'text-gray-900 cursor-default'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {item.name}
          </button>
        </span>
      ))}
    </div>
  )
}
