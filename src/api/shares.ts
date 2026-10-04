import client from './client'
import { Share } from '../types'

export const shareCategory = (categoryId: string, username: string) =>
  client
    .post<Share>('/shares', { category_id: categoryId, username })
    .then((r) => r.data)

export const getSharesForCategory = (categoryId: string) =>
  client.get<Share[]>(`/shares/category/${categoryId}`).then((r) => r.data)

export const revokeShare = (shareId: string) =>
  client.delete(`/shares/${shareId}`).then((r) => r.data)
