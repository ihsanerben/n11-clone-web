import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import type { UserRole } from './types'

type RequireRoleProps = PropsWithChildren<{
  roles: UserRole[]
}>

export function RequireRole({ children, roles }: RequireRoleProps) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  if (!roles.includes(auth.user.role)) {
    return <Navigate replace to="/" />
  }

  return children
}
