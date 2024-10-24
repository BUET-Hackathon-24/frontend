import { ProtectedRoute } from '@/components/composite'
import { ThemeProvider } from '@/components/theme-provider'
import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './App.css'

// Lazy load components
const LoginPage = lazy(() => import('@/pages/auth/Login'))
const SignUp = lazy(() => import('@/pages/auth/SignUp'))
const Home = lazy(() => import('@/pages/Home/home'))
const Template = lazy(() => import('@/pages/Template'))
const Chat = lazy(() => import('./components/custom/chat'))
const Logout = lazy(() => import('./pages/auth/Logout'))
const OAuthCallback = lazy(() => import('./pages/auth/OAuthCallback'))
const MapComponent = lazy(() => import('./pages/Map/Map'))
const PlaceDetails = lazy(() => import('./pages/Map/PlaceDetails'))
const User = lazy(() => import('./pages/Profile/User'))

// Loading component
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/oauth" element={<OAuthCallback />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<Template />}>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapComponent />} />
              <Route path="/place" element={<PlaceDetails />} />
              <Route path="/user" element={<ProtectedRoute role="user" />}>
                <Route path="/user/profile" element={<User />} />
                <Route path="/user/chat" element={<Chat />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
