import { Heart, LogOut, Menu, Search, ShoppingCart, UserRound } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

const navigationItems = ['Elektronik', 'Moda', 'Ev & Yaşam', 'Kozmetik', 'Spor', 'Kitap']

export function AppLayout() {
  const auth = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="bg-brand-950 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
          Güvenli alışveriş, binlerce ürün ve bağımsız satıcı tek yerde.
        </div>

        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:gap-6 sm:px-6 lg:px-8">
          <button className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden" type="button" aria-label="Menüyü aç">
            <Menu aria-hidden="true" size={22} />
          </button>

          <Link className="shrink-0 text-2xl font-black tracking-tight text-brand-700" to="/" aria-label="Pazar ana sayfa">
            pazar<span className="text-amber-500">.</span>
          </Link>

          <label className="relative hidden flex-1 md:block">
            <span className="sr-only">Ürün ara</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" size={20} />
            <input
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
              placeholder="Ürün, kategori veya marka ara"
              type="search"
            />
          </label>

          <nav className="ml-auto flex items-center gap-1 sm:gap-2" aria-label="Kullanıcı işlemleri">
            {auth.user?.role === 'USER' && <Link className="hidden text-sm font-bold text-brand-700 sm:block" to="/seller">Satıcı ol</Link>}
            {auth.user?.role === 'SELLER' && <Link className="hidden text-sm font-bold text-brand-700 sm:block" to="/seller/products">Satıcı paneli</Link>}
            {auth.user?.role === 'ADMIN' && <Link className="hidden text-sm font-bold text-brand-700 sm:block" to="/admin/sellers">Yönetim</Link>}
            <HeaderAction icon={Heart} label="Favoriler" />
            {auth.user ? (
              <>
                <HeaderAction icon={UserRound} label={auth.user.username} />
                <button
                  className="flex items-center gap-2 rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 sm:px-3"
                  onClick={() => void auth.logout()}
                  type="button"
                >
                  <LogOut aria-hidden="true" size={21} />
                  <span className="sr-only">Çıkış yap</span>
                </button>
              </>
            ) : (
              <Link className="flex items-center gap-2 rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 sm:px-3" to="/login">
                <UserRound aria-hidden="true" size={21} />
                <span className="hidden text-sm font-semibold xl:inline">Giriş yap</span>
                <span className="sr-only xl:hidden">Giriş yap</span>
              </Link>
            )}
            <HeaderAction icon={ShoppingCart} label="Sepetim" />
          </nav>
        </div>

        <div className="px-4 pb-4 md:hidden">
          <label className="relative block">
            <span className="sr-only">Ürün ara</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" size={19} />
            <input className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-brand-500" placeholder="Ürün ara" type="search" />
          </label>
        </div>

        <nav className="mx-auto hidden w-full max-w-7xl items-center justify-between px-6 pb-3 text-sm font-semibold text-slate-600 lg:flex lg:px-8" aria-label="Kategoriler">
          <Link className="text-brand-700" to="/products">Tüm ürünler</Link>
          {navigationItems.map((item) => <span key={item}>{item}</span>)}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Pazar. Marketplace demo projesi.</p>
          <p>React, TypeScript ve güvenli API mimarisiyle geliştiriliyor.</p>
        </div>
      </footer>
    </div>
  )
}

type HeaderActionProps = {
  icon: typeof Heart
  label: string
}

function HeaderAction({ icon: Icon, label }: HeaderActionProps) {
  return (
    <button className="flex items-center gap-2 rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 sm:px-3" type="button">
      <Icon aria-hidden="true" size={21} />
      <span className="hidden text-sm font-semibold xl:inline">{label}</span>
      <span className="sr-only xl:hidden">{label}</span>
    </button>
  )
}
