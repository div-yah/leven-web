import client from './client'
import { PublicUser, User } from '../types'

export const searchUsers = (q: string) =>
  client.get<User[]>('/users/search', { params: { q } }).then((r) => r.data)

export const updateMe = (data: { full_name?: string; username?: string; avatar_url?: string }) =>
  client.put<User>('/users/me', data).then((r) => r.data)

export const getUserByUsername = (username: string) =>
  client.get<PublicUser>(`/users/by-username/${encodeURIComponent(username)}`).then((r) => r.data)
