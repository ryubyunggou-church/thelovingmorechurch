import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { BackToTop } from './components/layout/BackToTop'
import { ToastViewport } from './components/ui/toast-viewport'
import { LoginModal } from './features/admin/LoginModal'
import { AdminManageModal } from './features/admin/AdminManageModal'
import { useAdminStore } from './store/admin-store'

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const WorshipPage = lazy(() =>
  import('./pages/WorshipPage').then((m) => ({ default: m.WorshipPage })),
)
const EducationPage = lazy(() =>
  import('./pages/EducationPage').then((m) => ({ default: m.EducationPage })),
)
const MissionsPage = lazy(() =>
  import('./pages/MissionsPage').then((m) => ({ default: m.MissionsPage })),
)
const NewsPage = lazy(() =>
  import('./pages/NewsPage').then((m) => ({ default: m.NewsPage })),
)
const NewsDetailPage = lazy(() =>
  import('./pages/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

/** 라우트 이동 시 이전 페이지의 스크롤 위치가 그대로 남아 상단이 잘려 보이는 문제 방지 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-muted">
      페이지를 불러오는 중…
    </div>
  )
}

export default function App() {
  const initAuth = useAdminStore((s) => s.initAuth)

  useEffect(() => {
    const unsub = initAuth()
    return unsub
  }, [initAuth])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-cream text-ink">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/worship" element={<WorshipPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/missions" element={<MissionsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BackToTop />
        <LoginModal />
        <AdminManageModal />
        <ToastViewport />
      </div>
    </BrowserRouter>
  )
}
