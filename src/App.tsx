import { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { authService } from './api/authService'
import { getUserId } from './api/localStorageKeys'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import Layout from './Layout/Layout'
import SplashScreen from './Layout/SplashScreen'
import About from './View/About/About'
import Address from './View/Address/Address'
import Help from './View/Help/Help'
import Home from './View/Home/Home'
import Kundli from './View/Kundli/Kundli'
import Login from './View/Login/Login'
import MyProfiles from './View/MyProfiles/MyProfiles'
import NotFound from './View/NotFound/NotFound'
import Profile from './View/Profile/Profile'
import RemedyBookings from './View/RemedyBookings/RemedyBookings'
import RemedyCategories from './View/Remedies/RemedyCategories'
import RemedyDetail from './View/Remedies/RemedyDetail'
import RemedyList from './View/Remedies/RemedyList'
import Wallet from './View/Wallet/Wallet'
import { useAuthStore } from './store/useAuthStore'

const SPLASH_MIN_DURATION_MS = 1200;
const SPLASH_FADE_DURATION_MS = 300;

function App() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [minDurationDone, setMinDurationDone] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Guards against StrictMode's dev-only double-invoke — the backend
    // rotates the stored password on each auto-login call, so firing it
    // twice would race and the second call could use an already-stale one.
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      // If a previous session exists, refresh it via auto-login instead of
      // trusting a possibly-expired token straight from localStorage.
      if (getUserId()) {
        const res = await authService.autoLogin();
        if (res.success) {
          login(res.user);
        } else {
          logout();
        }
      }
      setInitialized(true);
    };
    init();
  }, [login, logout, setInitialized]);

  useEffect(() => {
    const timer = setTimeout(() => setMinDurationDone(true), SPLASH_MIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const ready = isInitialized && minDurationDone;

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setShowSplash(false), SPLASH_FADE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <>
      <Toaster duration={3000} richColors position="bottom-center" visibleToasts={4} />
      {showSplash && <SplashScreen fadingOut={ready} />}
      <Routes>
        {/* Login is full-bleed and intentionally outside the standard Header/Footer chrome */}
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/my-profiles"
                  element={
                    <ProtectedRoute>
                      <MyProfiles />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/addresses"
                  element={
                    <ProtectedRoute>
                      <Address />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/kundli/:chatProfileId"
                  element={
                    <ProtectedRoute>
                      <Kundli />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/remedies"
                  element={
                    <ProtectedRoute>
                      <RemedyCategories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/remedies/:categoryId"
                  element={
                    <ProtectedRoute>
                      <RemedyList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/remedies/:categoryId/:remedyId"
                  element={
                    <ProtectedRoute>
                      <RemedyDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/remedies-bookings"
                  element={
                    <ProtectedRoute>
                      <RemedyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </>
  )
}

export default App
