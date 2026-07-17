import { apiRequest } from '../../lib/api/client'
import type { PageResponse } from '../../lib/api/types'
import type { CategoryResponse, ProductRequest, ProductResponse } from './types'

export function getCategories() {
  return apiRequest<CategoryResponse[]>('/api/categories')
}

export type ProductFilters = {
  page: number
  search?: string
  categoryId?: number
  sort?: string
}

export function getProducts(filters: ProductFilters) {
  const params = pageParams(filters.page, filters.sort)
  if (filters.search) params.set('search', filters.search)
  if (filters.categoryId) params.set('categoryId', String(filters.categoryId))
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

export function createCategory(request: Omit<CategoryResponse, 'id'>) {
  return apiRequest<CategoryResponse>('/api/categories', { body: request, method: 'POST' })
}

export function updateCategory(categoryId: number, request: Omit<CategoryResponse, 'id'>) {
  return apiRequest<CategoryResponse>(`/api/categories/${categoryId}`, { body: request, method: 'PUT' })
}

export function deleteCategory(categoryId: number) {
  return apiRequest<void>(`/api/categories/${categoryId}`, { method: 'DELETE' })
}

function pageParams(page: number, sort = 'createdAt,desc') {
  return new URLSearchParams({
    page: String(page),
    size: '12',
    sort,
  })
}
