import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './app/AppLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CheckEmailPage } from './pages/CheckEmailPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SellerOnboardingPage } from './pages/SellerOnboardingPage'
import { AdminSellersPage } from './pages/AdminSellersPage'
import { RequireRole } from './features/auth/RequireRole'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SellerProductsPage } from './pages/SellerProductsPage'
import { AdminProductsPage } from './pages/AdminProductsPage'
import { useAuth } from './features/auth/useAuth'

function App() {
  const auth = useAuth()

  if (auth.isInitializing) {
    return <div className="grid min-h-screen place-items-center bg-stone-50 text-sm font-semibold text-slate-500">Oturum kontrol ediliyor…</div>
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="check-email" element={<CheckEmailPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="seller" element={<RequireRole roles={['USER', 'SELLER']}><SellerOnboardingPage /></RequireRole>} />
        <Route path="admin/sellers" element={<RequireRole roles={['ADMIN']}><AdminSellersPage /></RequireRole>} />
        <Route path="seller/products" element={<RequireRole roles={['SELLER']}><SellerProductsPage /></RequireRole>} />
        <Route path="admin/products" element={<RequireRole roles={['ADMIN']}><AdminProductsPage /></RequireRole>} />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Route>
    </Routes>
  )
}

export default App
