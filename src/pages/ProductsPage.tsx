import { useQuery } from '@tanstack/react-query'
import { PackageSearch, Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getProducts } from '../features/catalog/api'
import { Pagination } from '../features/catalog/Pagination'
import { ProductCard } from '../features/catalog/ProductCard'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? 0)
  const search = searchParams.get('search') ?? ''
  const categoryId = Number(searchParams.get('categoryId')) || undefined
  const sort = searchParams.get('sort') ?? 'createdAt,desc'
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const productsQuery = useQuery({
    queryKey: ['products', { categoryId, page, search, sort }],
    queryFn: () => getProducts({ categoryId, page, search, sort }),
  })
  const products = productsQuery.data?.content ?? []

  function updateFilter(name: string, value?: string) {
    const nextParams = new URLSearchParams(searchParams)
    if (value) nextParams.set(name, value)
    else nextParams.delete(name)
    if (name !== 'page') nextParams.delete('page')
    setSearchParams(nextParams)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Keşfet</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Tüm ürünler</h1>
      <p className="mt-2 text-slate-600">Bağımsız satıcıların en yeni ürünlerine göz at.</p>

      <div className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_200px]">
        <label className="relative block">
          <span className="sr-only">Ürün ara</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none focus:border-brand-500" defaultValue={search} key={search} onKeyDown={(event) => { if (event.key === 'Enter') updateFilter('search', event.currentTarget.value.trim()) }} placeholder="Ürün veya kategori ara" />
          {search && <button aria-label="Aramayı temizle" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => updateFilter('search')} type="button"><X size={17} /></button>}
        </label>
        <select className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand-500" onChange={(event) => updateFilter('categoryId', event.target.value)} value={categoryId ?? ''}><option value="">Tüm kategoriler</option>{categoriesQuery.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
        <select className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand-500" onChange={(event) => updateFilter('sort', event.target.value)} value={sort}><option value="createdAt,desc">En yeniler</option><option value="price,asc">Fiyat: Artan</option><option value="price,desc">Fiyat: Azalan</option><option value="name,asc">İsme göre</option></select>
      </div>

      {productsQuery.isPending && <p className="mt-10 text-sm text-slate-500">Ürünler yükleniyor…</p>}
      {productsQuery.isError && <p className="mt-10 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">Ürünler alınamadı.</p>}
      {!productsQuery.isPending && products.length === 0 && <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><PackageSearch className="mx-auto text-slate-400" size={42} /><h2 className="mt-4 font-bold text-slate-900">Aramana uygun ürün bulunamadı</h2></div>}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      <Pagination currentPage={page} onPageChange={(nextPage) => updateFilter('page', String(nextPage))} totalPages={productsQuery.data?.page.totalPages ?? 0} />
    </section>
  )
}
