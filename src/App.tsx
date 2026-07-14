import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './Layout/Layout'
import Home from './View/Home/Home'
import NotFound from './View/NotFound/NotFound'

function App() {
  return (
    <>
      <Toaster duration={3000} richColors position="bottom-center" visibleToasts={4} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
