import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CircleCheck, CircleX } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthShell } from '../features/auth/AuthShell'
import { FormField } from '../features/auth/FormField'
import { resetPassword } from '../features/auth/api'
import { applyApiFormErrors } from '../features/auth/formErrors'

type ResetPasswordForm = {
  newPassword: string
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const form = useForm<ResetPasswordForm>()
  const [isComplete, setIsComplete] = useState(false)

  const submit = form.handleSubmit(async ({ newPassword }) => {
    if (!token) return

    try {
      await resetPassword(token, newPassword)
      setIsComplete(true)
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  if (!token) {
    return (
      <AuthShell description="Şifre sıfırlama bağlantısında geçerli bir token bulunamadı." title="Bağlantı geçersiz">
        <div className="text-center">
          <CircleX className="mx-auto text-rose-600" size={52} />
          <Link className="mt-7 block text-sm font-bold text-brand-700" to="/forgot-password">
            Yeni bağlantı iste
          </Link>
        </div>
      </AuthShell>
    )
  }

  if (isComplete) {
    return (
      <AuthShell description="Yeni şifren kaydedildi. Artık hesabına giriş yapabilirsin." title="Şifren güncellendi">
        <div className="text-center">
          <CircleCheck className="mx-auto text-emerald-600" size={52} />
          <Link className="mt-7 block rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white" to="/login">
            Giriş yap
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell description="Hesabın için güçlü ve daha önce kullanmadığın bir şifre belirle." title="Yeni şifre belirle">
      <form className="space-y-5" onSubmit={submit}>
        <FormField
          autoComplete="new-password"
          error={form.formState.errors.newPassword?.message}
          id="newPassword"
          label="Yeni şifre"
          type="password"
          {...form.register('newPassword')}
        />
        {form.formState.errors.root?.message && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            {form.formState.errors.root.message}
          </p>
        )}
        <button
          className="h-12 w-full rounded-xl bg-brand-700 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? 'Kaydediliyor…' : 'Şifremi güncelle'}
        </button>
      </form>
    </AuthShell>
  )
}
