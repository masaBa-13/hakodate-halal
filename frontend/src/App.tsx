import { Routes, Route } from 'react-router-dom'
import { useLang } from './i18n/useLang'
import MapPage from './pages/MapPage'
import ListPage from './pages/ListPage'
import ShopPage from './pages/ShopPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import LegalPage from './pages/LegalPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import InfoPage from './pages/InfoPage'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import type { Lang } from './i18n/translations'

export default function App() {
  const { lang, setLang, t } = useLang()

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
          <Route path="/legal" element={<LegalPage t={t} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/info" element={<InfoPage t={t} />} />
        </Routes>
      </div>
      <BottomNav t={t} />
    </div>
  )
}

export type AppProps = {
  lang: Lang
  t: (key: string) => string
}
