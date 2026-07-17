export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type SellerApplicationRequest = {
  storeName: string
  description?: string
}

export type SellerResponse = {
  id: number
  userId: number
  username: string
  email: string
  storeName: string
  description: string | null
  status: SellerStatus
  appliedAt: string
  reviewedAt: string | null
}
