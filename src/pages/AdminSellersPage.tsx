import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Store, X } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { approveSeller, getSellerApplications, rejectSeller } from '../features/seller/api'
import { ApiError } from '../lib/api/client'

export function AdminSellersPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const applicationsQuery = useQuery({
    queryKey: ['admin', 'seller-applications', 'PENDING', page],
    queryFn: () => getSellerApplications('PENDING', page),
  })
  const reviewMutation = useMutation({
    mutationFn: ({ action, sellerId }: { action: 'approve' | 'reject'; sellerId: number }) => (
      action === 'approve' ? approveSeller(sellerId) : rejectSeller(sellerId)
    ),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'seller-applications'] })
      toast.success(variables.action === 'approve' ? 'Satıcı onaylandı.' : 'Başvuru reddedildi.')
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Başvuru güncellenemedi.')
    },
  })

  const applications = applicationsQuery.data?.content ?? []

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Yönetim</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Satıcı başvuruları</h1>
          <p className="mt-2 text-slate-600">Bekleyen mağazaları inceleyip sonuçlandır.</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">{applications.length} bekleyen</span>
      </div>

      {applicationsQuery.isPending && <p className="mt-10 text-sm text-slate-500">Başvurular yükleniyor…</p>}
      {applicationsQuery.isError && <p className="mt-10 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">Başvurular alınamadı.</p>}
      {!applicationsQuery.isPending && applications.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Store className="mx-auto text-slate-400" size={40} />
          <h2 className="mt-4 font-bold text-slate-900">Bekleyen başvuru yok</h2>
        </div>
      )}

      <div className="mt-8 grid gap-4">
        {applications.map((application) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6" key={application.id}>
            <div>
              <h2 className="text-lg font-black text-slate-900">{application.storeName}</h2>
              <p className="mt-1 text-sm text-slate-500">{application.username} · {application.email}</p>
              {application.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{application.description}</p>}
            </div>
            <div className="mt-5 flex shrink-0 gap-2 sm:mt-0">
              <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50" disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ action: 'reject', sellerId: application.id })} type="button"><X size={17} /> Reddet</button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50" disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ action: 'approve', sellerId: application.id })} type="button"><Check size={17} /> Onayla</button>
            </div>
          </article>
        ))}
      </div>

      {(applicationsQuery.data?.page.totalPages ?? 0) > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Başvuru sayfaları">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40" disabled={page === 0} onClick={() => setPage((currentPage) => currentPage - 1)} type="button">Önceki</button>
          <span className="text-sm font-semibold text-slate-600">{page + 1} / {applicationsQuery.data?.page.totalPages}</span>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40" disabled={page + 1 >= (applicationsQuery.data?.page.totalPages ?? 0)} onClick={() => setPage((currentPage) => currentPage + 1)} type="button">Sonraki</button>
        </nav>
      )}
    </section>
  )
}
