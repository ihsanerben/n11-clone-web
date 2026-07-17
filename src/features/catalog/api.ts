import { apiRequest } from '../../lib/api/client'
import type { PageResponse } from '../../lib/api/types'
import type { CategoryResponse, ProductRequest, ProductResponse } from './types'

export function getCategories() {
  return apiRequest<CategoryResponse[]>('/api/categories')
}

export function getProducts(page: number) {
  const params = pageParams(page)
  return apiRequest<PageResponse<ProductResponse>>(`/api/products?${params}`)
}

export function getProduct(productId: number) {
  return apiRequest<ProductResponse>(`/api/products/${productId}`)
}

export function getSellerProducts(page: number) {
  const params = pageParams(page)
  return apiRequest<PageResponse<ProductResponse>>(`/api/seller/products?${params}`)
}

export function createProduct(request: ProductRequest) {
  return apiRequest<ProductResponse>('/api/seller/products', { body: request, method: 'POST' })
}

export function updateProduct(productId: number, request: ProductRequest) {
  return apiRequest<ProductResponse>(`/api/seller/products/${productId}`, { body: request, method: 'PUT' })
}

export function deactivateSellerProduct(productId: number) {
  return apiRequest<void>(`/api/seller/products/${productId}`, { method: 'DELETE' })
}

export function reactivateSellerProduct(productId: number) {
  return apiRequest<ProductResponse>(`/api/seller/products/${productId}/reactivate`, { method: 'PUT' })
}

export function getAdminProducts(page: number) {
  const params = pageParams(page)
  return apiRequest<PageResponse<ProductResponse>>(`/api/admin/products?${params}`)
}

export function deactivateAdminProduct(productId: number) {
  return apiRequest<void>(`/api/admin/products/${productId}/deactivate`, { method: 'PUT' })
}

function pageParams(page: number) {
  return new URLSearchParams({
    page: String(page),
    size: '12',
    sort: 'createdAt,desc',
  })
}
