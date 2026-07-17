import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from '../features/auth/FormField'
import { applyApiFormErrors } from '../features/auth/formErrors'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../features/catalog/api'
import type { CategoryResponse } from '../features/catalog/types'
import { ApiError } from '../lib/api/client'

type CategoryFormValues = {
  name: string
  description: string
}

export function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | 'new' | null>(null)
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const form = useForm<CategoryFormValues>()
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Kategori silindi.')
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : 'Kategori silinemedi.'),
  })

  function openForm(category: CategoryResponse | 'new') {
    setEditingCategory(category)
    form.reset(category === 'new' ? { name: '', description: '' } : { name: category.name, description: category.description ?? '' })
  }

  const submit = form.handleSubmit(async (values) => {
    try {
      const request = { name: values.name, description: values.description || null }
      if (editingCategory === 'new') await createCategory(request)
      else if (editingCategory) await updateCategory(editingCategory.id, request)
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      setEditingCategory(null)
      toast.success('Kategori kaydedildi.')
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-brand-700">Yönetim</p><h1 className="mt-2 text-3xl font-black text-slate-950">Kategoriler</h1></div><button className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white" onClick={() => openForm('new')} type="button"><Plus size={18} /> Yeni kategori</button></div>
      {editingCategory && <form className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_2fr_auto] sm:items-end" onSubmit={submit}><FormField error={form.formState.errors.name?.message} id="categoryName" label="Kategori adı" {...form.register('name')} /><FormField error={form.formState.errors.description?.message} id="categoryDescription" label="Açıklama" {...form.register('description')} /><div className="flex gap-2"><button className="h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold" onClick={() => setEditingCategory(null)} type="button">Vazgeç</button><button className="h-12 rounded-xl bg-brand-700 px-4 text-sm font-bold text-white" type="submit">Kaydet</button></div>{form.formState.errors.root?.message && <p className="text-sm text-rose-600 sm:col-span-3">{form.formState.errors.root.message}</p>}</form>}
      <div className="mt-8 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">{categoriesQuery.data?.map((category) => <article className="flex items-center justify-between gap-4 p-5" key={category.id}><div><h2 className="font-black text-slate-900">{category.name}</h2>{category.description && <p className="mt-1 text-sm text-slate-500">{category.description}</p>}</div><div className="flex gap-1"><button aria-label="Kategoriyi düzenle" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => openForm(category)} type="button"><Pencil size={17} /></button><button aria-label="Kategoriyi sil" className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(category.id)} type="button"><Trash2 size={17} /></button></div></article>)}</div>
    </section>
  )
}
