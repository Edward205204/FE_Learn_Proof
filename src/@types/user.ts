export enum Role {
  LEARNER = 'LEARNER',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string
  email: string
  fullName: string
  avatar: string | null
  bio: string | null
  headline: string | null
  website: string | null
  role: (typeof Role)[keyof typeof Role]
}
