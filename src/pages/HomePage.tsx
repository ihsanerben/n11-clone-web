import { ArrowRight, BadgeCheck, PackageCheck, Store } from 'lucide-react'
import { HealthStatus } from '../features/health/HealthStatus'

const benefits = [
  { icon: BadgeCheck, title: 'Güvenli alışveriş', description: 'Doğrulanmış hesaplar ve kontrollü satıcı süreci.' },
  { icon: Store, title: 'Bağımsız satıcılar', description: 'Farklı mağazalardan binlerce ürünü keşfet.' },
  { icon: PackageCheck, title: 'Kolay sipariş takibi', description: 'Her siparişin durumunu hesabından izle.' },
]

export function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-brand-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-800">Yeni nesil pazar yeri</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Aradığın her şey,<br /><span className="text-brand-700">güvendiğin satıcılardan.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Ürünleri keşfet, satıcıları karşılaştır ve alışverişini tek bir yerden kolayca yönet.
            </p>
            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800" type="button">
              Alışverişe başla <ArrowRight size={18} />
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="relative rounded-3xl border border-white bg-white/70 p-5 shadow-2xl shadow-brand-950/10 backdrop-blur sm:p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Sistem durumu</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Frontend temeli hazır</h2>
              <p className="mb-6 mt-2 text-sm leading-6 text-slate-600">Backend servisiyle bağlantı durumu aşağıda canlı olarak kontrol edilir.</p>
              <HealthStatus />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-16" aria-label="Platform avantajları">
        {benefits.map(({ icon: Icon, title, description }) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-6" key={title}>
            <div className="mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-700"><Icon aria-hidden="true" size={23} /></div>
            <h2 className="font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </section>
    </>
  )
}
