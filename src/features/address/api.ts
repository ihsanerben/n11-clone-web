import { apiRequest } from '../../lib/api/client'
import type { AddressRequest, AddressResponse } from './types'

export function getAddresses() {
  return apiRequest<AddressResponse[]>('/api/addresses')
}

export function createAddress(request: AddressRequest) {
  return apiRequest<AddressResponse>('/api/addresses', { body: request, method: 'POST' })
}

export function updateAddress(addressId: number, request: AddressRequest) {
  return apiRequest<AddressResponse>(`/api/addresses/${addressId}`, { body: request, method: 'PUT' })
}

export function deleteAddress(addressId: number) {
  return apiRequest<void>(`/api/addresses/${addressId}`, { method: 'DELETE' })
}
