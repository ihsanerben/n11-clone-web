import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { FormField } from '../auth/FormField'
import { applyApiFormErrors } from '../auth/formErrors'
import { getCategories } from './api'
import type { ProductRequest, ProductResponse } from './types'

type ProductFormProps = {
  onCancel: () => void
  onSubmit: (request: ProductRequest) => Promise<void>
  product?: ProductResponse
}

type ProductFormValues = Omit<ProductRequest, 'price' | 'stockQuantity' | 'categoryId'> & {
  price: string
  stockQuantity: string
  categoryId: string
}

export function ProductForm({ onCancel, onSubmit, product }: ProductFormProps) {
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const form = useForm<ProductFormValues>({
    defaultValues: product ? {
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      categoryId: String(product.categoryId),
      imageUrl: product.imageUrl ?? '',
    } : undefined,
  })

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit({
        ...values,
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
      })
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  return (
    <form className="space-y-5" onSubmit={submit}>
      <FormField error={form.formState.errors.name?.message} id="name" label="Ürün adı" {...form.register('name')} />
      <label className="block" htmlFor="description"><span className="mb-2 block text-sm font-bold text-slate-700">Açıklama</span><textarea className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100" id="description" {...form.register('description')} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={form.formState.errors.price?.message} id="price" inputMode="decimal" label="Fiyat (₺)" type="number" step="0.01" {...form.register('price')} />
        <FormField error={form.formState.errors.stockQuantity?.message} id="stockQuantity" inputMode="numeric" label="Stok" min="0" type="number" {...form.register('stockQuantity')} />
      </div>
      <label className="block" htmlFor="categoryId"><span className="mb-2 block text-sm font-bold text-slate-700">Kategori</span><select className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-500" id="categoryId" {...form.register('categoryId')}><option value="">Kategori seç</option>{categoriesQuery.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{form.formState.errors.categoryId?.message && <span className="mt-1.5 block text-xs text-rose-600">{form.formState.errors.categoryId.message}</span>}</label>
      <FormField error={form.formState.errors.imageUrl?.message} id="imageUrl" label="Görsel URL" type="url" {...form.register('imageUrl')} />
      {form.formState.errors.root?.message && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{form.formState.errors.root.message}</p>}
      <div className="flex justify-end gap-3"><button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold" onClick={onCancel} type="button">Vazgeç</button><button className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting ? 'Kaydediliyor…' : 'Kaydet'}</button></div>
    </form>
  )
}
