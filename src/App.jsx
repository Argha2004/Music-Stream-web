import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import Waveform from './components/Waveform'
import PixelBackground from './components/PixelBackground'
import Home from './pages/Home'

// Route-level code splitting keeps the first sheet's bundle small.
const Docs = lazy(() => import('./pages/Docs'))
const License = lazy(() => import('./pages/License'))
const Changelog = lazy(() => import('./pages/Changelog'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Download = lazy(() => import('./pages/Download'))
const Admin = lazy(() => import('./pages/Admin'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Support = lazy(() => import('./pages/Support'))
const Report = lazy(() => import('./pages/Report'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Reset scroll and move focus to main on navigation (a11y: focus-on-route-change). */
function RouteChangeEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])
  return null
}

function PageFallback() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Waveform bars={9} height={28} barWidth={3} gap={3} barClassName="bg-rule" baseline />
      <p className="label" role="status" aria-label="Loading">
        Retrieving sheet
      </p>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col relative">
      <PixelBackground />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
                   focus:bg-stamp focus:px-4 focus:py-2 focus:font-mono focus:text-[0.6875rem]
                   focus:uppercase focus:tracking-[0.18em] focus:text-on-stamp"
      >
        Skip to content
      </a>

      <RouteChangeEffects />
      <Nav />

      <main id="main" tabIndex={-1} className="flex-1 outline-none relative z-10">
        <Suspense fallback={<PageFallback />}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              <Route path="/donate" element={<Support />} />
              <Route path="/license" element={<License />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/download"
                element={
                  <ProtectedRoute>
                    <Download />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/report" element={<Report />} />
              <Route path="/report-bug" element={<Report />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
