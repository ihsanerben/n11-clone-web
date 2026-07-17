import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AddressForm } from '../features/address/AddressForm'
import { createAddress, deleteAddress, getAddresses, updateAddress } from '../features/address/api'
import type { AddressRequest, AddressResponse } from '../features/address/types'
import { ApiError } from '../lib/api/client'

export function AddressesPage() {
  const queryClient = useQueryClient()
  const [editingAddress, setEditingAddress] = useState<AddressResponse | 'new' | null>(null)
  const addressesQuery = useQuery({ queryKey: ['addresses'], queryFn: getAddresses })
  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Adres silindi.')
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : 'Adres silinemedi.'),
  })

  async function saveAddress(request: AddressRequest) {
    if (editingAddress === 'new') await createAddress(request)
    else if (editingAddress) await updateAddress(editingAddress.id, request)
    await queryClient.invalidateQueries({ queryKey: ['addresses'] })
    setEditingAddress(null)
    toast.success('Adres kaydedildi.')
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-brand-700">Hesabım</p><h1 className="mt-2 text-3xl font-black text-slate-950">Adreslerim</h1></div><button className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white" onClick={() => setEditingAddress('new')} type="button"><Plus size={18} /> Yeni adres</button></div>
      {editingAddress && <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="mb-6 text-xl font-black">{editingAddress === 'new' ? 'Yeni adres' : 'Adresi düzenle'}</h2><AddressForm address={editingAddress === 'new' ? undefined : editingAddress} onCancel={() => setEditingAddress(null)} onSubmit={saveAddress} /></div>}
      {addressesQuery.isPending && <p className="mt-8 text-sm text-slate-500">Adresler yükleniyor…</p>}
      {!addressesQuery.isPending && addressesQuery.data?.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><MapPin className="mx-auto text-slate-400" size={40} /><h2 className="mt-4 font-bold">Kayıtlı adresin yok</h2></div>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{addressesQuery.data?.map((address) => <article className="rounded-2xl border border-slate-200 bg-white p-5" key={address.id}><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="font-black text-slate-900">{address.label || 'Adres'}</h2>{address.defaultAddress && <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">Varsayılan</span>}</div><p className="mt-3 text-sm font-semibold text-slate-700">{address.recipientName}</p><p className="mt-2 text-sm leading-6 text-slate-600">{address.addressLine}<br />{address.postalCode} {address.city}<br />{address.phone}</p></div><div className="flex gap-1"><button aria-label="Adresi düzenle" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setEditingAddress(address)} type="button"><Pencil size={17} /></button><button aria-label="Adresi sil" className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(address.id)} type="button"><Trash2 size={17} /></button></div></div></article>)}</div>
    </section>
  )
}
