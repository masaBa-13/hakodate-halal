import { Routes, Route, useLocation } from 'react-router-dom'
import { useLang } from './i18n/useLang'
import MapPage from './pages/MapPage'
import ListPage from './pages/ListPage'
import ShopPage from './pages/ShopPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import LegalPage from './pages/LegalPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import type { Lang } from './i18n/translations'

// 法的・登録ページはフッター表示、BottomNavは常時表示
const NO_FOOTER_PATHS = ['/', '/list']

export default function App() {
  const { lang, setLang, t } = useLang()
  const location = useLocation()
  const showFooter = !NO_FOOTER_PATHS.includes(location.pathname)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <Header lang={lang} setLang={setLang} t={t} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<MapPage lang={lang} t={t} />} />
          <Route path="/list" element={<ListPage lang={lang} t={t} />} />
          <Route path="/shops/:id" element={<ShopPage lang={lang} t={t} />} />
          <Route path="/register" element={<RegisterPage t={t} />} />
          <Route path="/admin" element={<AdminPage t={t} />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
      <BottomNav t={t} />
    </div>
  )
}

export type AppProps = {
  lang: Lang
  t: (key: string) => string
}
