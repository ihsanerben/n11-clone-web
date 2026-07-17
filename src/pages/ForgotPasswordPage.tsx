import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { AuthShell } from '../features/auth/AuthShell'
import { FormField } from '../features/auth/FormField'
import { forgotPassword } from '../features/auth/api'
import { applyApiFormErrors } from '../features/auth/formErrors'

type ForgotPasswordForm = {
  email: string
}

export function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordForm>()
  const [isComplete, setIsComplete] = useState(false)

  const submit = form.handleSubmit(async ({ email }) => {
    try {
      await forgotPassword(email)
      setIsComplete(true)
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  if (isComplete) {
    return (
      <AuthShell
        description="Hesap bulunursa şifre sıfırlama bağlantısı birkaç dakika içinde gönderilecek."
        title="E-postanı kontrol et"
      >
        <div className="text-center">
          <MailCheck className="mx-auto text-brand-700" size={52} />
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Gelen kutunun yanında spam klasörünü de kontrol etmeyi unutma.
          </p>
          <Link
            className="mt-7 block rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white"
            to="/login"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      description="Hesabında kullandığın e-posta adresini yaz; sana tek kullanımlık bir bağlantı gönderelim."
      footer={<Link className="font-bold text-brand-700" to="/login">Giriş sayfasına dön</Link>}
      title="Şifremi unuttum"
    >
      <form className="space-y-5" onSubmit={submit}>
        <FormField
          autoComplete="email"
          error={form.formState.errors.email?.message}
          id="email"
          label="E-posta"
          type="email"
          {...form.register('email')}
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
          {form.formState.isSubmitting ? 'Gönderiliyor…' : 'Sıfırlama bağlantısı gönder'}
        </button>
      </form>
    </AuthShell>
  )
}
