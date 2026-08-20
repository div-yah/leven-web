import client from './client'
import { Category } from '../types'

export const getCategories = () => client.get<Category[]>('/categories').then((r) => r.data)

export const createCategory = (data: {
  name: string
  description?: string
  color?: string
  icon?: string
  parent_id?: string | null
  order?: number
}) => client.post<Category>('/categories', data).then((r) => r.data)

export const updateCategory = (id: string, data: Partial<{
  name: string
  description: string
  color: string
  icon: string
  parent_id: string | null
  order: number
}>) => client.put<Category>(`/categories/${id}`, data).then((r) => r.data)

export const deleteCategory = (id: string) => client.delete(`/categories/${id}`).then((r) => r.data)
