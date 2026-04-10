import { Role } from '@/@types/user'

export interface AdminUserItem {
  id: string
  email: string
  fullName: string
  avatar: string | null
  role: Role
  isBanned: boolean
  createdAt: string | Date
  _count: {
    coursesCreated: number
    enrollments: number
  }
}

export interface AdminGetUsersResponse {
  items: AdminUserItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface GetUsersQuery {
  page?: number
  limit?: number
  role?: Role | ''
  isBanned?: 'true' | 'false' | ''
  search?: string
  sort?: 'newest' | 'oldest' | 'name-asc' | 'name-desc'
}

export interface AdminUserDetailResponse {
  id: string
  email: string
  fullName: string
  avatar: string | null
  bio: string | null
  headline: string | null
  website: string | null
  role: Role
  isBanned: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface UpdateUserRoleBody {
  role: Role
}

export interface UpdateBanStatusBody {
  isBanned: boolean
}

export interface AdminUpdateUserResponse {
  id: string
  role: Role
  isBanned: boolean
}
