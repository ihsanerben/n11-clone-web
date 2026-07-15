import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-700">404</p>
      <h1 className="mt-3 text-4xl font-black text-slate-950">Bu sayfa bulunamadı</h1>
      <p className="mt-4 text-slate-600">Aradığın sayfa taşınmış veya henüz oluşturulmamış olabilir.</p>
      <Link className="mt-7 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white hover:bg-brand-800" to="/">Ana sayfaya dön</Link>
    </section>
  )
}
