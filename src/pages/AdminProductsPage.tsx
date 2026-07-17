import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Ban } from 'lucide-react'
import { toast } from 'sonner'
import { deactivateAdminProduct, getAdminProducts } from '../features/catalog/api'
import { Pagination } from '../features/catalog/Pagination'
import { ProductImage } from '../features/catalog/ProductImage'
import { formatPrice } from '../features/catalog/format'
import { ApiError } from '../lib/api/client'

export function AdminProductsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const productsQuery = useQuery({ queryKey: ['admin-products', page], queryFn: () => getAdminProducts(page) })
  const deactivateMutation = useMutation({
    mutationFn: deactivateAdminProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Ürün platformdan kaldırıldı.')
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : 'Ürün kaldırılamadı.'),
  })

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Yönetim</p><h1 className="mt-2 text-3xl font-black text-slate-950">Ürün moderasyonu</h1><p className="mt-2 text-slate-600">Platformdaki aktif ve pasif ürünleri denetle.</p>
      {productsQuery.isPending && <p className="mt-8 text-sm text-slate-500">Ürünler yükleniyor…</p>}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-3xl text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Ürün</th><th className="p-4">Satıcı</th><th className="p-4">Fiyat</th><th className="p-4">Durum</th><th className="p-4 text-right">İşlem</th></tr></thead><tbody>{productsQuery.data?.content.map((product) => <tr className="border-b border-slate-100 last:border-0" key={product.id}><td className="p-4"><div className="flex items-center gap-3"><ProductImage alt={product.name} className="h-12 w-12 rounded-lg" imageUrl={product.imageUrl} /><span className="font-bold text-slate-900">{product.name}</span></div></td><td className="p-4 text-slate-600">{product.storeName}</td><td className="p-4 font-semibold">{formatPrice(product.price)}</td><td className="p-4"><span className={product.active ? 'text-emerald-700' : 'text-slate-500'}>{product.active ? 'Aktif' : 'Pasif'}</span></td><td className="p-4 text-right"><button className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 font-bold text-rose-700 disabled:opacity-40" disabled={!product.active || deactivateMutation.isPending} onClick={() => deactivateMutation.mutate(product.id)} type="button"><Ban size={16} /> Kaldır</button></td></tr>)}</tbody></table></div>
      <Pagination currentPage={page} onPageChange={setPage} totalPages={productsQuery.data?.page.totalPages ?? 0} />
    </section>
  )
}
