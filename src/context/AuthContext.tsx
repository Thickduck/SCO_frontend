import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../services/api'
import type { ProfileUpdate, User } from '../types/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('sco.token')))
  const [sessionError, setSessionError] = useState<string>()

  useEffect(() => {
    const token = localStorage.getItem('sco.token')
    if (!token) return
    api.me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch((cause: unknown) => {
        localStorage.removeItem('sco.token')
        localStorage.removeItem('sco.user')
        setSessionError(cause instanceof Error ? `Your saved session could not be restored: ${cause.message}` : 'Your saved session could not be restored. Please sign in again.')
      })
      .finally(() => setLoading(false))
  }, [])

  const saveSession = useCallback((token: string, currentUser: User) => {
    localStorage.setItem('sco.token', token)
    localStorage.setItem('sco.user', JSON.stringify(currentUser))
    setSessionError(undefined)
    setUser(currentUser)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const session = await api.login(email, password)
    saveSession(session.token, session.user)
  }, [saveSession])

  const register = useCallback(async (email: string, password: string, name: string, role: string) => {
    const session = await api.register(email, password, name, role)
    saveSession(session.token, session.user)
  }, [saveSession])

  const updateProfile = useCallback(async (profile: ProfileUpdate) => {
    const session = await api.updateProfile(profile)
    saveSession(session.token, session.user)
  }, [saveSession])

  const logout = useCallback(() => {
    localStorage.removeItem('sco.token')
    localStorage.removeItem('sco.user')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, sessionError, login, register, updateProfile, logout }),
    [user, loading, sessionError, login, register, updateProfile, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
