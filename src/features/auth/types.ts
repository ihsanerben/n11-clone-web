export type UserRole = 'USER' | 'SELLER' | 'ADMIN'

export type AuthUser = {
  id: number
  username: string
  role: UserRole
}

export type TokenResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export type MessageResponse = {
  message: string
}

export type LoginRequest = {
  usernameOrEmail: string
  password: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
}
