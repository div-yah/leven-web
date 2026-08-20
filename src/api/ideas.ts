import client from './client'
import { Idea, IdeaStatus, IdeaContentType } from '../types'

export const getIdeas = (params?: {
  category_id?: string
  root_only?: boolean
  status?: IdeaStatus
  tag_id?: string
  search?: string
}) => client.get<Idea[]>('/ideas', { params }).then((r) => r.data)

export const getIdea = (id: string) => client.get<Idea>(`/ideas/${id}`).then((r) => r.data)

export const createIdea = (data: {
  title: string
  content?: string
  link?: string
  image_url?: string
  content_type?: IdeaContentType
  status?: IdeaStatus
  category_id?: string | null
  tag_ids?: string[]
}) => client.post<Idea>('/ideas', data).then((r) => r.data)

export const updateIdea = (id: string, data: Partial<{
  title: string
  content: string
  link: string
  image_url: string
  content_type: IdeaContentType
  status: IdeaStatus
  category_id: string | null
  tag_ids: string[]
}>) => client.put<Idea>(`/ideas/${id}`, data).then((r) => r.data)

export const deleteIdea = (id: string) => client.delete(`/ideas/${id}`).then((r) => r.data)
