import { useState } from 'react'
import { MailCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthShell } from '../features/auth/AuthShell'
import { resendVerification } from '../features/auth/api'
import { ApiError } from '../lib/api/client'

export function CheckEmailPage() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const [isSending, setIsSending] = useState(false)

  async function resend() {
    if (!email) return
    setIsSending(true)
    try {
      const response = await resendVerification(email)
      toast.success(response.message)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'E-posta gönderilemedi.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AuthShell description="Hesabını etkinleştirmek için gönderdiğimiz bağlantıya tıkla." title="E-postanı kontrol et">
      <div className="text-center">
        <MailCheck className="mx-auto text-brand-700" size={52} />
        {email && <p className="mt-4 text-sm font-semibold text-slate-700">{email}</p>}
        <p className="mt-3 text-sm leading-6 text-slate-500">E-posta birkaç dakika içinde ulaşmazsa spam klasörünü kontrol edebilirsin.</p>
        {email && <button className="mt-5 text-sm font-bold text-brand-700 disabled:opacity-50" disabled={isSending} onClick={resend} type="button">{isSending ? 'Gönderiliyor…' : 'Doğrulama e-postasını yeniden gönder'}</button>}
        <Link className="mt-7 block rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white" to="/login">Giriş sayfasına dön</Link>
      </div>
    </AuthShell>
  )
}
