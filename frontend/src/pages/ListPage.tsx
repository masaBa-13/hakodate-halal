import { useEffect, useState, useCallback } from 'react'
import type { Shop, HalalLevel, Category } from '../types'
import type { Lang } from '../i18n/translations'
import FilterBar from '../components/FilterBar'
import ShopCard from '../components/ShopCard'

interface ListPageProps {
  lang: Lang
  t: (key: string) => string
}

interface Filters {
  halalLevel: HalalLevel | ''
  category: Category | ''
  prayerSpace: boolean
}

export default function ListPage({ lang, t }: ListPageProps) {
  const [shops, setShops] = useState<Shop[]>([])
  const [filters, setFilters] = useState<Filters>({ halalLevel: '', category: '', prayerSpace: false })

  const buildQuery = useCallback((f: Filters) => {
    const params = new URLSearchParams()
    if (f.halalLevel) params.set('halal_level', f.halalLevel)
    if (f.category) params.set('category', f.category)
    if (f.prayerSpace) params.set('prayer_space', '1')
    return params.toString()
  }, [])

  useEffect(() => {
    const q = buildQuery(filters)
    fetch(`/api/shops${q ? `?${q}` : ''}`)
      .then((r) => r.json())
      .then(setShops)
      .catch(console.error)
  }, [filters, buildQuery])

  return (
    <div style={styles.page}>
      {/* FilterBar: on mobile stays at top, on desktop in sidebar */}
      <div className="mobile-only" style={{ flexShrink: 0 }}>
        <FilterBar filters={filters} onChange={setFilters} t={t} />
      </div>

      <div style={styles.inner}>
        <aside className="desktop-only" style={styles.sidebar}>
          <FilterBar filters={filters} onChange={setFilters} t={t} />
        </aside>

        <main style={styles.main}>
          {shops.length === 0 && <p style={styles.empty}>{t('noShops')}</p>}
          <div className="shop-list-grid">
            {shops.map((shop, i) => (
              <ShopCard key={shop.id} shop={shop} index={i} lang={lang} t={t} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  inner: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '280px',
    borderRight: '1px solid var(--border)',
    overflowY: 'auto',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch' as never,
  },
  empty: {
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '48px 16px',
    fontSize: '14px',
  },
}
