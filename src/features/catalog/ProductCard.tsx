import { Link } from 'react-router-dom'
import { ProductImage } from './ProductImage'
import { formatPrice } from './format'
import type { ProductResponse } from './types'

type ProductCardProps = {
  product: ProductResponse
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <Link to={`/products/${product.id}`}>
        <ProductImage alt={product.name} className="aspect-square w-full" imageUrl={product.imageUrl} />
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">{product.storeName}</p>
          <h2 className="mt-2 line-clamp-2 min-h-12 font-bold leading-6 text-slate-900">{product.name}</h2>
          <p className="mt-3 text-lg font-black text-slate-950">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-slate-500">{product.stockQuantity > 0 ? `${product.stockQuantity} adet stokta` : 'Stokta yok'}</p>
        </div>
      </Link>
    </article>
  )
}
