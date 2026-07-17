export type CategoryResponse = {
  id: number
  name: string
  description: string | null
}

export type ProductResponse = {
  id: number
  name: string
  description: string | null
  price: number
  stockQuantity: number
  imageUrl: string | null
  active: boolean
  version: number
  categoryId: number
  categoryName: string
  sellerId: number
  storeName: string
  createdAt: string
  updatedAt: string
}

export type ProductRequest = {
  name: string
  description?: string
  price: number
  stockQuantity: number
  categoryId: number
  imageUrl?: string
}
