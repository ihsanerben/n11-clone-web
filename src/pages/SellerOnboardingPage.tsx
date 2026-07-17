import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleCheck, Clock3, Store, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { applyForSeller, getMySellerApplication } from '../features/seller/api'
import { SellerApplicationForm } from '../features/seller/SellerApplicationForm'
import type { SellerApplicationRequest } from '../features/seller/types'
import { ApiError } from '../lib/api/client'

export function SellerOnboardingPage() {
  const queryClient = useQueryClient()
  const applicationQuery = useQuery({
    queryKey: ['seller-application', 'me'],
    queryFn: getMySellerApplication,
    retry: false,
  })

  async function submit(request: SellerApplicationRequest) {
    await applyForSeller(request)
    await queryClient.invalidateQueries({ queryKey: ['seller-application', 'me'] })
    toast.success('Satıcı başvurun alındı.')
  }

  if (applicationQuery.isPending) return <StatusPanel icon={<Clock3 className="animate-pulse text-brand-700" />} title="Başvurun kontrol ediliyor" />

  const hasNoApplication = applicationQuery.error instanceof ApiError && applicationQuery.error.status === 404
  if (applicationQuery.isError && !hasNoApplication) {
    return <StatusPanel icon={<TriangleAlert className="text-rose-600" />} title="Başvuru durumu alınamadı" description="Lütfen daha sonra tekrar dene." />
  }

  const application = applicationQuery.data
  if (!application || hasNoApplication) {
    return <FormPanel title="Satıcı ol" description="Mağazanı açmak için bilgilerini paylaş. Başvurun yönetici tarafından incelenecek."><SellerApplicationForm onSubmit={submit} submitLabel="Başvuruyu gönder" /></FormPanel>
  }

  if (application.status === 'PENDING') {
    return <StatusPanel icon={<Clock3 className="text-amber-600" />} title="Başvurun inceleniyor" description={`${application.storeName} mağazası için başvurunu aldık. Sonuçlandığında rolün otomatik olarak güncellenecek.`} />
  }

  if (application.status === 'REJECTED') {
    return <FormPanel title="Başvurunu yeniden gönder" description="Başvurun onaylanmadı. Mağaza bilgilerini düzenleyerek tekrar başvurabilirsin."><SellerApplicationForm defaultValues={{ storeName: application.storeName, description: application.description ?? '' }} onSubmit={submit} submitLabel="Yeniden başvur" /></FormPanel>
  }

  return <StatusPanel icon={<CircleCheck className="text-emerald-600" />} title="Mağazan onaylandı" description="Yeni rolünün görünmesi için oturumun yenilendiğinde satıcı paneline erişebilirsin."><Link className="mt-6 inline-flex rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white" to="/seller/products">Satıcı paneline git</Link></StatusPanel>
}

type PanelProps = {
  children?: React.ReactNode
  description?: string
  icon?: React.ReactNode
  title: string
}

function StatusPanel({ children, description, icon = <Store />, title }: PanelProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl bg-white p-4 shadow-sm [&>svg]:h-12 [&>svg]:w-12">{icon}</div>
      <h1 className="mt-6 text-3xl font-black text-slate-950">{title}</h1>
      {description && <p className="mt-3 leading-7 text-slate-600">{description}</p>}
      {children}
    </section>
  )
}

function FormPanel({ children, description, title }: PanelProps) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black text-slate-950">{title}</h1>
        <p className="mb-8 mt-3 leading-7 text-slate-600">{description}</p>
        {children}
      </div>
    </section>
  )
}
