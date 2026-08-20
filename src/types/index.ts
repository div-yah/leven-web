export interface User {
  id: string
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
}

export interface Tag {
  id: string
  name: string
  color: string | null
  owner_id: string
  created_at: string | null
}

export interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  order: number
  owner_id: string
  parent_id: string | null
  created_at: string
  updated_at: string | null
  children: Category[]
  idea_count: number
}

export type IdeaStatus = 'draft' | 'active' | 'archived'
export type IdeaContentType = 'text' | 'link' | 'image'

export interface Idea {
  id: string
  title: string
  content: string | null
  link: string | null
  image_url: string | null
  content_type: IdeaContentType
  status: IdeaStatus
  owner_id: string
  category_id: string | null
  tags: Tag[]
  created_at: string
  updated_at: string | null
  comment_count: number
}

export interface Comment {
  id: string
  content: string
  image_url: string | null
  idea_id: string
  owner_id: string
  parent_id: string | null
  owner: User
  replies: Comment[]
  created_at: string
  updated_at: string | null
}

export type SharePermission = 'view' | 'edit'

export interface Share {
  id: string
  permission: SharePermission
  idea_id: string | null
  category_id: string | null
  shared_by_id: string
  shared_with_id: string
  shared_with: User
  created_at: string
}

export interface Token {
  access_token: string
  token_type: string
  user: User
}
