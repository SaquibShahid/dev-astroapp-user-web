import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import Layout from './Layout/Layout'
import SplashScreen from './Layout/SplashScreen'
import Home from './View/Home/Home'
import Login from './View/Login/Login'
import NotFound from './View/NotFound/NotFound'
import { useAuthStore } from './store/useAuthStore'

const SPLASH_MIN_DURATION_MS = 1200;
const SPLASH_FADE_DURATION_MS = 300;

function App() {
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [minDurationDone, setMinDurationDone] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setInitialized(true);
  }, [setInitialized]);

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
