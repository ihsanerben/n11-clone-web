import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthShell } from '../features/auth/AuthShell'
import { FormField } from '../features/auth/FormField'
import { useAuth } from '../features/auth/useAuth'
import { applyApiFormErrors } from '../features/auth/formErrors'
import type { LoginRequest } from '../features/auth/types'

export function LoginPage() {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const form = useForm<LoginRequest>()

  if (auth.isAuthenticated) return <Navigate replace to="/" />

  const submit = form.handleSubmit(async (values) => {
    try {
      await auth.login(values)
      toast.success('Tekrar hoş geldin!')
      const destination = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(destination, { replace: true })
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  return (
    <AuthShell
      description="Hesabına giriş yaparak sepetini ve siparişlerini yönet."
      footer={<>Hesabın yok mu? <Link className="font-bold text-brand-700" to="/register">Kayıt ol</Link></>}
      title="Giriş yap"
    >
      <form className="space-y-5" onSubmit={submit}>
        <FormField
          autoComplete="username"
          error={form.formState.errors.usernameOrEmail?.message}
          id="usernameOrEmail"
          label="Kullanıcı adı veya e-posta"
          {...form.register('usernameOrEmail')}
        />
        <FormField
          autoComplete="current-password"
          error={form.formState.errors.password?.message}
          id="password"
          label="Şifre"
          type="password"
          {...form.register('password')}
        />
        {form.formState.errors.root?.message && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{form.formState.errors.root.message}</p>}
        <div className="flex justify-end">
          <Link className="text-sm font-semibold text-brand-700" to="/forgot-password">Şifremi unuttum</Link>
        </div>
        <button className="h-12 w-full rounded-xl bg-brand-700 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60" disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? 'Giriş yapılıyor…' : 'Giriş yap'}
        </button>
      </form>
    </AuthShell>
  )
}
