import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, LoaderCircle, RefreshCw, ServerOff } from 'lucide-react'
import { getHealth } from './api'

export function HealthStatus() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: 1,
  })

  if (healthQuery.isPending) {
    return <StatusCard icon={<LoaderCircle className="animate-spin text-brand-600" />} label="API bağlantısı kontrol ediliyor" />
  }

  if (healthQuery.isError) {
    return (
      <StatusCard icon={<ServerOff className="text-rose-600" />} label="API şu anda erişilemiyor">
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700" onClick={() => healthQuery.refetch()} type="button">
          <RefreshCw size={14} /> Yeniden dene
        </button>
      </StatusCard>
    )
  }

  return <StatusCard icon={<CheckCircle2 className="text-emerald-600" />} label={`API bağlantısı hazır · ${healthQuery.data.status}`} />
}

type StatusCardProps = {
  children?: React.ReactNode
  icon: React.ReactNode
  label: string
}

function StatusCard({ children, icon, label }: StatusCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg shadow-brand-950/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  )
}
