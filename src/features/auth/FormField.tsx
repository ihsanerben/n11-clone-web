import type { InputHTMLAttributes } from 'react'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label: string
}

export function FormField({ error, id, label, ...inputProps }: FormFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        {...inputProps}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
        id={id}
      />
      {error && <span className="mt-1.5 block text-xs font-medium text-rose-600" id={`${id}-error`}>{error}</span>}
    </label>
  )
}
