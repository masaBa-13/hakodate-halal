import { Link, useLocation } from 'react-router-dom'

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function PlusCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  )
}

interface BottomNavProps {
  t: (key: string) => string
}

export default function BottomNav({ t }: BottomNavProps) {
  const location = useLocation()

  const tabs = [
    { to: '/', label: t('mapView'), icon: <MapIcon /> },
    { to: '/list', label: t('listView'), icon: <ListIcon /> },
    { to: '/register', label: t('registerShop'), icon: <PlusCircleIcon /> },
    { to: '/info', label: t('infoNav'), icon: <InfoIcon /> },
  ]

  return (
    <nav className="mobile-only" style={styles.nav} aria-label="メインナビゲーション">
      {tabs.map((tab) => {
        const active = tab.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(tab.to)
        return (
          <Link
            key={tab.to}
            to={tab.to}
            style={styles.tab}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
          >
            <div style={active ? { ...styles.iconWrap, ...styles.iconWrapActive } : styles.iconWrap}>
              <span style={{ color: active ? 'var(--marker)' : 'var(--text-muted)', display: 'flex' }}>
                {tab.icon}
              </span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--marker)' : 'var(--text-muted)',
            }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 'var(--bottom-nav-h)',
    background: 'var(--bg)',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    flex: 1,
    padding: '6px 4px',
    textDecoration: 'none',
    color: 'inherit',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  },
  iconWrap: {
    width: '48px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-pill)',
    transition: 'background 0.15s',
  },
  iconWrapActive: {
    background: 'var(--marker-light)',
  },
}
