import { apiRequest } from '../../lib/api/client'
import type { PageResponse } from '../../lib/api/types'
import type { SellerApplicationRequest, SellerResponse, SellerStatus } from './types'

export function getMySellerApplication() {
  return apiRequest<SellerResponse>('/api/sellers/me')
}

export function applyForSeller(request: SellerApplicationRequest) {
  return apiRequest<SellerResponse>('/api/sellers/apply', {
    body: request,
    method: 'POST',
  })
}

export function getSellerApplications(status: SellerStatus, page: number) {
  const params = new URLSearchParams({
    page: String(page),
    size: '20',
    sort: 'appliedAt,desc',
    status,
  })
  return apiRequest<PageResponse<SellerResponse>>(`/api/admin/sellers?${params}`)
}

export function approveSeller(sellerId: number) {
  return apiRequest<SellerResponse>(`/api/admin/sellers/${sellerId}/approve`, { method: 'PUT' })
}

export function rejectSeller(sellerId: number) {
  return apiRequest<SellerResponse>(`/api/admin/sellers/${sellerId}/reject`, { method: 'PUT' })
}
