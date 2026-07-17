import type { PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthShellProps = PropsWithChildren<{
  description: string
  footer?: ReactNode
  title: string
}>

export function AuthShell({ children, description, footer, title }: AuthShellProps) {
  return (
    <section className="bg-gradient-to-br from-brand-50 via-white to-amber-50 px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white bg-white/90 p-6 shadow-2xl shadow-brand-950/10 sm:p-8">
        <Link
          className="text-xl font-black tracking-tight text-brand-700"
          to="/"
        >
          pazar<span className="text-amber-500">.</span>
        </Link>
        <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-7">{children}</div>
        {footer && <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">{footer}</div>}
      </div>
    </section>
  )
}
