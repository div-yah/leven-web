import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Category } from '../../types'
import { shareCategory, getSharesForCategory, revokeShare } from '../../api/shares'

interface Props {
  category: Category
  onClose: () => void
  onUpdated: () => void
}

export default function ShareCategoryModal({ category, onClose, onUpdated }: Props) {
  const queryClient = useQueryClient()
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: shares = [], refetch } = useQuery({
    queryKey: ['shares', category.id],
    queryFn: () => getSharesForCategory(category.id),
  })

  const share = useMutation({
    mutationFn: () => shareCategory(category.id, username.trim()),
    onSuccess: () => {
      setUsername('')
      setError(null)
      refetch()
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onUpdated()
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail ?? 'Could not share folder')
    },
  })

  const revoke = useMutation({
    mutationFn: (shareId: string) => revokeShare(shareId),
    onSuccess: () => {
      refetch()
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onUpdated()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-gray-900 mb-1">Share "{category.name}"</h2>
        <p className="text-xs text-gray-400 mb-4">
          Invite someone by username to collaborate on this folder — they'll be able to view,
          create, and edit ideas and sub-folders inside it.
        </p>

        <div className="flex gap-2 mb-1">
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null) }}
            placeholder="username"
            autoFocus
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            onKeyDown={(e) => { if (e.key === 'Enter' && username.trim()) share.mutate() }}
          />
          <button
            onClick={() => share.mutate()}
            disabled={!username.trim() || share.isPending}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            Invite
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        <div className="mt-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Collaborators
          </h3>
          {shares.length === 0 ? (
            <p className="text-sm text-gray-400">Not shared with anyone yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {shares.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {s.shared_with.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">@{s.shared_with.username}</span>
                  </div>
                  <button
                    onClick={() => revoke.mutate(s.id)}
                    disabled={revoke.isPending}
                    className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
