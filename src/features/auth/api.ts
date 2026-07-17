import { apiRequest } from '../../lib/api/client'
import type { LoginRequest, MessageResponse, RegisterRequest, TokenResponse } from './types'

export function login(request: LoginRequest) {
  return apiRequest<TokenResponse>('/api/auth/login', {
    body: request,
    method: 'POST',
    skipAuthRefresh: true,
  })
}

export function register(request: RegisterRequest) {
  return apiRequest<MessageResponse>('/api/auth/register', {
    body: request,
    method: 'POST',
    skipAuthRefresh: true,
  })
}

export function refresh() {
  return apiRequest<TokenResponse>('/api/auth/refresh', {
    method: 'POST',
    skipAuthRefresh: true,
  })
}

export function logout() {
  return apiRequest<void>('/api/auth/logout', {
    method: 'POST',
    skipAuthRefresh: true,
  })
}

export function verifyEmail(token: string) {
  return apiRequest<MessageResponse>('/api/auth/verify-email', {
    body: { token },
    method: 'POST',
    skipAuthRefresh: true,
  })
}

export function resendVerification(email: string) {
  return apiRequest<MessageResponse>('/api/auth/resend-verification', {
    body: { email },
    method: 'POST',
    skipAuthRefresh: true,
  })
}
