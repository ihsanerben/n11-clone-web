import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Archive, Pencil, Plus, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct, deactivateSellerProduct, getSellerProducts, reactivateSellerProduct, updateProduct } from '../features/catalog/api'
import { Pagination } from '../features/catalog/Pagination'
import { ProductForm } from '../features/catalog/ProductForm'
import { ProductImage } from '../features/catalog/ProductImage'
import { formatPrice } from '../features/catalog/format'
import type { ProductRequest, ProductResponse } from '../features/catalog/types'
import { ApiError } from '../lib/api/client'

export function SellerProductsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [editingProduct, setEditingProduct] = useState<ProductResponse | 'new' | null>(null)
  const productsQuery = useQuery({ queryKey: ['seller-products', page], queryFn: () => getSellerProducts(page) })
  const statusMutation = useMutation({
    mutationFn: async (product: ProductResponse) => {
      if (product.active) await deactivateSellerProduct(product.id)
      else await reactivateSellerProduct(product.id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seller-products'] })
      toast.success('Ürün durumu güncellendi.')
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : 'Ürün güncellenemedi.'),
  })

  async function saveProduct(request: ProductRequest) {
    if (editingProduct === 'new') await createProduct(request)
    else if (editingProduct) await updateProduct(editingProduct.id, request)
    await queryClient.invalidateQueries({ queryKey: ['seller-products'] })
    setEditingProduct(null)
    toast.success('Ürün kaydedildi.')
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-brand-700">Satıcı paneli</p><h1 className="mt-2 text-3xl font-black text-slate-950">Ürünlerim</h1></div><button className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white" onClick={() => setEditingProduct('new')} type="button"><Plus size={18} /> Yeni ürün</button></div>
      {editingProduct && <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="mb-6 text-xl font-black">{editingProduct === 'new' ? 'Yeni ürün' : 'Ürünü düzenle'}</h2><ProductForm onCancel={() => setEditingProduct(null)} onSubmit={saveProduct} product={editingProduct === 'new' ? undefined : editingProduct} /></div>}
      {productsQuery.isPending && <p className="mt-8 text-sm text-slate-500">Ürünler yükleniyor…</p>}
      <div className="mt-8 grid gap-4">
        {productsQuery.data?.content.map((product) => (
          <article className={`flex gap-4 rounded-2xl border bg-white p-4 ${product.active ? 'border-slate-200' : 'border-slate-200 opacity-70'}`} key={product.id}>
            <ProductImage alt={product.name} className="h-24 w-24 shrink-0 rounded-xl" imageUrl={product.imageUrl} />
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><span className={`rounded-full px-2 py-1 text-xs font-bold ${product.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{product.active ? 'Aktif' : 'Pasif'}</span><h2 className="mt-2 truncate font-black text-slate-900">{product.name}</h2><p className="mt-1 text-sm text-slate-500">{formatPrice(product.price)} · {product.stockQuantity} stok</p></div><div className="flex gap-2"><button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" onClick={() => setEditingProduct(product)} type="button" aria-label="Ürünü düzenle"><Pencil size={17} /></button><button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate(product)} type="button" aria-label={product.active ? 'Ürünü pasifleştir' : 'Ürünü aktifleştir'}>{product.active ? <Archive size={17} /> : <RotateCcw size={17} />}</button></div></div></div>
          </article>
        ))}
      </div>
      <Pagination currentPage={page} onPageChange={setPage} totalPages={productsQuery.data?.page.totalPages ?? 0} />
    </section>
  )
}
