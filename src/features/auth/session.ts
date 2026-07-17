import type { AuthUser, UserRole } from './types'

let accessToken: string | null = null
let refreshSession: (() => Promise<string | null>) | null = null

export function getAccessToken() {
  return accessToken
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function registerRefreshSession(handler: (() => Promise<string | null>) | null) {
  refreshSession = handler
}

export function requestSessionRefresh() {
  return refreshSession?.() ?? Promise.resolve(null)
}

export function readUserFromToken(token: string): AuthUser | null {
  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) return null

    const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const payload: unknown = JSON.parse(atob(normalizedPayload))

    if (!isJwtPayload(payload)) return null

    return {
      id: payload.userId,
      username: payload.sub,
      role: payload.roles[0],
    }
  } catch {
    return null
  }
}

type JwtPayload = {
  sub: string
  userId: number
  roles: [UserRole, ...UserRole[]]
}

function isJwtPayload(payload: unknown): payload is JwtPayload {
  if (typeof payload !== 'object' || payload === null) return false

  const candidate = payload as Record<string, unknown>
  return (
    typeof candidate.sub === 'string' &&
    typeof candidate.userId === 'number' &&
    Array.isArray(candidate.roles) &&
    candidate.roles.length > 0 &&
    isUserRole(candidate.roles[0])
  )
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'USER' || value === 'SELLER' || value === 'ADMIN'
}
