import { useForm } from 'react-hook-form'
import { FormField } from '../auth/FormField'
import { applyApiFormErrors } from '../auth/formErrors'
import type { AddressRequest, AddressResponse } from './types'

type AddressFormProps = {
  address?: AddressResponse
  onCancel: () => void
  onSubmit: (request: AddressRequest) => Promise<void>
}

export function AddressForm({ address, onCancel, onSubmit }: AddressFormProps) {
  const form = useForm<AddressRequest>({ defaultValues: address })
  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit}>
      <FormField error={form.formState.errors.label?.message} id="label" label="Adres etiketi" placeholder="Ev, İş…" {...form.register('label')} />
      <FormField error={form.formState.errors.recipientName?.message} id="recipientName" label="Alıcı adı" {...form.register('recipientName')} />
      <FormField error={form.formState.errors.phone?.message} id="phone" inputMode="tel" label="Telefon" {...form.register('phone')} />
      <FormField error={form.formState.errors.city?.message} id="city" label="Şehir" {...form.register('city')} />
      <div className="sm:col-span-2"><FormField error={form.formState.errors.addressLine?.message} id="addressLine" label="Açık adres" {...form.register('addressLine')} /></div>
      <FormField error={form.formState.errors.postalCode?.message} id="postalCode" label="Posta kodu" {...form.register('postalCode')} />
      <label className="flex items-center gap-3 self-end pb-3 text-sm font-semibold text-slate-700"><input className="h-4 w-4 accent-brand-700" type="checkbox" {...form.register('defaultAddress')} /> Varsayılan adres yap</label>
      {form.formState.errors.root?.message && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">{form.formState.errors.root.message}</p>}
      <div className="flex justify-end gap-3 sm:col-span-2"><button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold" onClick={onCancel} type="button">Vazgeç</button><button className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? 'Kaydediliyor…' : 'Adresi kaydet'}</button></div>
    </form>
  )
}
