import client from './client'
import { Comment } from '../types'

export const getComments = (ideaId: string) =>
  client.get<Comment[]>(`/ideas/${ideaId}/comments`).then((r) => r.data)

export const createComment = (ideaId: string, data: { content: string; image_url?: string; parent_id?: string }) =>
  client.post<Comment>(`/ideas/${ideaId}/comments`, data).then((r) => r.data)

export const updateComment = (commentId: string, data: { content?: string; image_url?: string }) =>
  client.put<Comment>(`/comments/${commentId}`, data).then((r) => r.data)

export const deleteComment = (commentId: string) =>
  client.delete(`/comments/${commentId}`).then((r) => r.data)
