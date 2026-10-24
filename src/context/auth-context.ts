import { createContext } from 'react'
import type { ProfileUpdate, User } from '../types/api'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  sessionError?: string
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: string) => Promise<void>
  updateProfile: (profile: ProfileUpdate) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
