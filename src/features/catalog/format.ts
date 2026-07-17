const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  currency: 'TRY',
  style: 'currency',
})

export function formatPrice(price: number) {
  return currencyFormatter.format(price)
}
