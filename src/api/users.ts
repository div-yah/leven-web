import client from './client'
import { User } from '../types'

export const searchUsers = (q: string) =>
  client.get<User[]>('/users/search', { params: { q } }).then((r) => r.data)

export const updateMe = (data: { full_name?: string; username?: string; avatar_url?: string }) =>
  client.put<User>('/users/me', data).then((r) => r.data)
