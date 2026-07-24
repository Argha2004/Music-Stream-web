import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Spinner } from '@heroui/react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'

// Route-level code splitting keeps the landing page's bundle small.
const Docs = lazy(() => import('./pages/Docs'))
const License = lazy(() => import('./pages/License'))
const Changelog = lazy(() => import('./pages/Changelog'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Download = lazy(() => import('./pages/Download'))
const Admin = lazy(() => import('./pages/Admin'))
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
    <div className="container-x flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" color="accent" role="status" aria-label="Loading" />
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
                   focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold
                   focus:text-on-accent"
      >
        Skip to content
      </a>

      <RouteChangeEffects />
      <Nav />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs" element={<Docs />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
