import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ShieldCheck, Store } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../features/catalog/api'
import { ProductImage } from '../features/catalog/ProductImage'
import { formatPrice } from '../features/catalog/format'

export function ProductDetailPage() {
  const productId = Number(useParams().productId)
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    enabled: Number.isInteger(productId) && productId > 0,
  })

  if (productQuery.isPending) return <p className="mx-auto max-w-7xl px-4 py-16 text-sm text-slate-500">Ürün yükleniyor…</p>
  if (productQuery.isError || !productQuery.data) return <p className="mx-auto max-w-7xl px-4 py-16 text-sm text-rose-700">Ürün bulunamadı.</p>

  const product = productQuery.data
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <Link className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-700" to="/products"><ArrowLeft size={17} /> Ürünlere dön</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductImage alt={product.name} className="aspect-square w-full rounded-3xl" imageUrl={product.imageUrl} />
        <div className="py-2">
          <p className="text-sm font-bold text-brand-700">{product.categoryName}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
          <p className="mt-5 text-3xl font-black text-slate-950">{formatPrice(product.price)}</p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><Store className="text-brand-700" /><div><p className="text-xs text-slate-500">Satıcı</p><p className="font-bold text-slate-900">{product.storeName}</p></div></div>
          {product.description && <p className="mt-7 whitespace-pre-line leading-7 text-slate-600">{product.description}</p>}
          <p className="mt-7 text-sm font-bold text-slate-700">{product.stockQuantity > 0 ? `${product.stockQuantity} adet stokta` : 'Ürün şu anda stokta yok'}</p>
          <button className="mt-5 h-13 w-full rounded-xl bg-brand-700 px-6 text-sm font-bold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50" disabled={product.stockQuantity === 0} type="button">Sepete ekle</button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} /> Güvenli marketplace alışverişi</p>
        </div>
      </div>
    </section>
  )
}
