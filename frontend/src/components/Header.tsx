import { Link, useLocation } from 'react-router-dom'
import type { Lang } from '../i18n/translations'

const LANGS: Lang[] = ['ja', 'en', 'ms', 'id', 'bn']

interface HeaderProps {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

export default function Header({ lang, setLang, t }: HeaderProps) {
  const location = useLocation()

  const navItems = [
    { to: '/', label: t('mapView') },
    { to: '/list', label: t('listView') },
    { to: '/register', label: t('registerShop') },
  ]

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoLink}>
        <span style={styles.logoText}>{t('siteTitle')}</span>
        <span style={styles.logoSub}>{t('siteSubtitle')}</span>
      </Link>

      {/* Desktop nav — hidden on mobile (nav is in BottomNav) */}
      <nav className="desktop-only" style={styles.nav}>
        {navItems.map(({ to, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              style={active ? { ...styles.navPill, ...styles.navPillActive } : styles.navPill}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Language selector */}
      <div style={styles.langs}>
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={l === lang ? { ...styles.langPill, ...styles.langPillActive } : styles.langPill}
            aria-label={`言語: ${l.toUpperCase()}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px',
    height: 'var(--header-h)',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
    flexShrink: 0,
  },
  logoLink: {
    textDecoration: 'none',
    color: 'inherit',
    flex: 1,
    minWidth: 0,
  },
  logoText: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '20px',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
  nav: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0,
  },
  navPill: {
    padding: '7px 16px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
    whiteSpace: 'nowrap',
  },
  navPillActive: {
    background: 'var(--marker)',
    color: 'white',
  },
  langs: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0,
  },
  langPill: {
    padding: '5px 9px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border)',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
    touchAction: 'manipulation',
    whiteSpace: 'nowrap',
    letterSpacing: '0.02em',
  },
  langPillActive: {
    background: 'var(--marker)',
    borderColor: 'var(--marker)',
    color: 'white',
  },
  logoSub: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    display: 'block',
    lineHeight: 1.3,
    fontStyle: 'italic',
  },
}
