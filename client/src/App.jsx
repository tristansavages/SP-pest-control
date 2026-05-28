import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import ProtectionPlansPage from './pages/ProtectionPlansPage'
import IndustriesPage from './pages/IndustriesPage'
import ResidentialPage from './pages/ResidentialPage'
import CommercialPage from './pages/CommercialPage'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import BookingsManager from './pages/admin/BookingsManager'
import ServicesManager from './pages/admin/ServicesManager'
import ContentManager from './pages/admin/ContentManager'
import GalleryManager from './pages/admin/GalleryManager'
import TestimonialsManager from './pages/admin/TestimonialsManager'
import PlansManager from './pages/admin/PlansManager'
import IndustriesManager from './pages/admin/IndustriesManager'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/protection-plans" element={<ProtectionPlansPage />} />
      <Route path="/industries" element={<IndustriesPage />} />
      <Route path="/residential" element={<ResidentialPage />} />
      <Route path="/commercial" element={<CommercialPage />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<BookingsManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="plans" element={<PlansManager />} />
        <Route path="industries-admin" element={<IndustriesManager />} />
        <Route path="content" element={<ContentManager />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#1b2d3e', color: '#fff', border: '1px solid #243447' },
            success: { iconTheme: { primary: '#EF6E37', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
