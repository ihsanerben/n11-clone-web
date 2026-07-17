import { useForm } from 'react-hook-form'
import { FormField } from '../auth/FormField'
import { applyApiFormErrors } from '../auth/formErrors'
import type { SellerApplicationRequest } from './types'

type SellerApplicationFormProps = {
  defaultValues?: SellerApplicationRequest
  onSubmit: (request: SellerApplicationRequest) => Promise<void>
  submitLabel: string
}

export function SellerApplicationForm({ defaultValues, onSubmit, submitLabel }: SellerApplicationFormProps) {
  const form = useForm<SellerApplicationRequest>({ defaultValues })

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  return (
    <form className="space-y-5" onSubmit={submit}>
      <FormField
        error={form.formState.errors.storeName?.message}
        id="storeName"
        label="Mağaza adı"
        {...form.register('storeName')}
      />
      <label className="block" htmlFor="description">
        <span className="mb-2 block text-sm font-bold text-slate-700">Mağaza açıklaması</span>
        <textarea
          className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
          id="description"
          {...form.register('description')}
        />
        {form.formState.errors.description?.message && <span className="mt-1.5 block text-xs font-medium text-rose-600">{form.formState.errors.description.message}</span>}
      </label>
      {form.formState.errors.root?.message && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{form.formState.errors.root.message}</p>}
      <button className="h-12 w-full rounded-xl bg-brand-700 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? 'Gönderiliyor…' : submitLabel}
      </button>
    </form>
  )
}
