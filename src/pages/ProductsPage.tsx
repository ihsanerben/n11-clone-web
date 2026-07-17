import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PackageSearch } from 'lucide-react'
import { getProducts } from '../features/catalog/api'
import { Pagination } from '../features/catalog/Pagination'
import { ProductCard } from '../features/catalog/ProductCard'

export function ProductsPage() {
  const [page, setPage] = useState(0)
  const productsQuery = useQuery({
    queryKey: ['products', { page }],
    queryFn: () => getProducts(page),
  })
  const products = productsQuery.data?.content ?? []

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Keşfet</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Tüm ürünler</h1>
      <p className="mt-2 text-slate-600">Bağımsız satıcıların en yeni ürünlerine göz at.</p>

      {productsQuery.isPending && <p className="mt-10 text-sm text-slate-500">Ürünler yükleniyor…</p>}
      {productsQuery.isError && <p className="mt-10 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">Ürünler alınamadı.</p>}
      {!productsQuery.isPending && products.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <PackageSearch className="mx-auto text-slate-400" size={42} />
          <h2 className="mt-4 font-bold text-slate-900">Henüz ürün yok</h2>
        </div>
      )}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      <Pagination currentPage={page} onPageChange={setPage} totalPages={productsQuery.data?.page.totalPages ?? 0} />
    </section>
  )
}
