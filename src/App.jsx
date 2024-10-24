import { ProtectedRoute } from '@/components/composite'
import { ThemeProvider } from '@/components/theme-provider'
import LoginPage from '@/pages/auth/Login'
import SignUp from '@/pages/auth/SignUp'
import Home from '@/pages/Home/home'
import Template from '@/pages/Template'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './App.css'
import Chat from './components/custom/chat'
import Logout from './pages/auth/Logout'
import OAuthCallback from './pages/auth/OAuthCallback'
import MapComponent from './pages/Map/Map'
import PlaceDetails from './pages/Map/PlaceDetails'
import User from './pages/Profile/User'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/oauth" element={<OAuthCallback />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/user/profile" element={<User />} />
          <Route element={<Template />}>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/place" element={<PlaceDetails />} />

            <Route path="/user" element={<ProtectedRoute role="user" />}>
              <Route path="/user/chat" element={<Chat />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
