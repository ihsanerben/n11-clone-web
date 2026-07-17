import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../features/auth/AuthShell'
import { FormField } from '../features/auth/FormField'
import { register as registerAccount } from '../features/auth/api'
import { applyApiFormErrors } from '../features/auth/formErrors'
import type { RegisterRequest } from '../features/auth/types'

export function RegisterPage() {
  const navigate = useNavigate()
  const form = useForm<RegisterRequest>()

  const submit = form.handleSubmit(async (values) => {
    try {
      await registerAccount(values)
      navigate('/check-email', { replace: true, state: { email: values.email } })
    } catch (error) {
      if (!applyApiFormErrors(error, form.setError)) throw error
    }
  })

  return (
    <AuthShell
      description="Pazar'a katıl, ürünleri keşfet ve alışverişini kolayca yönet."
      footer={<>Zaten hesabın var mı? <Link className="font-bold text-brand-700" to="/login">Giriş yap</Link></>}
      title="Hesap oluştur"
    >
      <form className="space-y-5" onSubmit={submit}>
        <FormField autoComplete="username" error={form.formState.errors.username?.message} id="username" label="Kullanıcı adı" {...form.register('username')} />
        <FormField autoComplete="email" error={form.formState.errors.email?.message} id="email" label="E-posta" type="email" {...form.register('email')} />
        <FormField autoComplete="new-password" error={form.formState.errors.password?.message} id="password" label="Şifre" type="password" {...form.register('password')} />
        {form.formState.errors.root?.message && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{form.formState.errors.root.message}</p>}
        <button className="h-12 w-full rounded-xl bg-brand-700 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60" disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? 'Hesap oluşturuluyor…' : 'Kayıt ol'}
        </button>
      </form>
    </AuthShell>
  )
}
