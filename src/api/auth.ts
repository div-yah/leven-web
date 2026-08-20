import client from './client'
import { Token, User } from '../types'

export const register = (data: { email: string; username: string; password: string; full_name?: string }) =>
  client.post<Token>('/auth/register', data).then((r) => r.data)

export const login = (data: { email: string; password: string }) =>
  client.post<Token>('/auth/login', data).then((r) => r.data)

export const getMe = () => client.get<User>('/auth/me').then((r) => r.data)

export const changePassword = (data: { current_password: string; new_password: string }) =>
  client.post('/auth/change-password', data).then((r) => r.data)
