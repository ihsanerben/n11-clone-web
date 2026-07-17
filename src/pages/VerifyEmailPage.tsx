import { useEffect, useState } from 'react'
import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthShell } from '../features/auth/AuthShell'
import { verifyEmail } from '../features/auth/api'

type VerificationStatus = 'loading' | 'success' | 'error'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<VerificationStatus>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    void verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <AuthShell description="Hesap doğrulama işleminin sonucunu aşağıda görebilirsin." title="E-posta doğrulama">
      <div className="text-center">
        {status === 'loading' && <><LoaderCircle className="mx-auto animate-spin text-brand-700" size={48} /><p className="mt-4 text-sm text-slate-600">E-posta adresin doğrulanıyor…</p></>}
        {status === 'success' && <><CircleCheck className="mx-auto text-emerald-600" size={48} /><p className="mt-4 font-bold text-slate-900">E-posta adresin doğrulandı.</p><Link className="mt-6 block rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white" to="/login">Giriş yap</Link></>}
        {status === 'error' && <><CircleX className="mx-auto text-rose-600" size={48} /><p className="mt-4 font-bold text-slate-900">Bağlantı geçersiz veya süresi dolmuş.</p><Link className="mt-6 block text-sm font-bold text-brand-700" to="/register">Yeni hesap oluştur</Link></>}
      </div>
    </AuthShell>
  )
}
