import client from './client'
import { Tag } from '../types'

export const getTags = () => client.get<Tag[]>('/tags').then((r) => r.data)

export const createTag = (data: { name: string; color?: string }) =>
  client.post<Tag>('/tags', data).then((r) => r.data)

export const deleteTag = (id: string) => client.delete(`/tags/${id}`).then((r) => r.data)
