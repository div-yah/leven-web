import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="h-12 border-b border-gray-100 bg-white flex items-center px-5 shrink-0 justify-between">
        <span className="text-base font-semibold tracking-tight text-gray-900">leven</span>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              {user?.username ?? 'account'}
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-sm py-1 w-36 hidden group-hover:block z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-40 border-r border-gray-100 bg-white shrink-0 flex flex-col py-4 px-3">
          <nav>
            <button
              onClick={() => navigate('/ideas')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-900"
            >
              Ideas
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  )
}
