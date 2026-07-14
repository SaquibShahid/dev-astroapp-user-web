import { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { authService } from './api/authService'
import { getUserId } from './api/localStorageKeys'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import Layout from './Layout/Layout'
import SplashScreen from './Layout/SplashScreen'
import Home from './View/Home/Home'
import Login from './View/Login/Login'
import NotFound from './View/NotFound/NotFound'
import Profile from './View/Profile/Profile'
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
