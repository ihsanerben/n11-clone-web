import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import * as authApi from './api'
import { readUserFromToken, registerRefreshSession, setAccessToken } from './session'
import type { AuthUser, LoginRequest } from './types'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const applyToken = useCallback((token: string | null) => {
    setAccessToken(token)
    setUser(token ? readUserFromToken(token) : null)
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const response = await authApi.refresh()
      applyToken(response.accessToken)
      return response.accessToken
    } catch {
      applyToken(null)
      return null
    }
  }, [applyToken])

  useEffect(() => {
    registerRefreshSession(refreshSession)
    void refreshSession().finally(() => setIsInitializing(false))

    return () => registerRefreshSession(null)
  }, [refreshSession])

  const login = useCallback(async (request: LoginRequest) => {
    const response = await authApi.login(request)
    applyToken(response.accessToken)
  }, [applyToken])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      applyToken(null)
    }
  }, [applyToken])

  const value = useMemo(() => ({
    user,
    isAuthenticated: user !== null,
    isInitializing,
    login,
    logout,
  }), [isInitializing, login, logout, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
