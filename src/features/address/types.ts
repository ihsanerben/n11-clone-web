export type AddressRequest = {
  label?: string
  recipientName: string
  phone: string
  addressLine: string
  city: string
  postalCode: string
  defaultAddress: boolean
}

export type AddressResponse = AddressRequest & {
  id: number
}
