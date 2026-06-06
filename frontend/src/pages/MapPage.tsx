import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Shop, HalalLevel, Category } from '../types'
import type { Lang } from '../i18n/translations'
import FilterBar from '../components/FilterBar'
import ShopCard from '../components/ShopCard'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#e8e2d8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a4a4a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d4d8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#d4cfc6' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#c5bfb6' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d0dbc8' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
]

const HAKODATE_CENTER = { lat: 41.7688, lng: 140.7290 }

// Peek shows only handle + count row — filter floats over map
const PEEK_HEIGHT = 72

interface MapPageProps {
  lang: Lang
  t: (key: string) => string
}

interface Filters {
  halalLevel: HalalLevel | ''
  category: Category | ''
  prayerSpace: boolean
}

export default function MapPage({ lang, t }: MapPageProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map())
  const [shops, setShops] = useState<Shop[]>([])
  const [filters, setFilters] = useState<Filters>({ halalLevel: '', category: '', prayerSpace: false })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const navigate = useNavigate()

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

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return
    if (googleMapRef.current) return
    loadGoogleMaps(GOOGLE_MAPS_API_KEY).then(() => initMap()).catch(console.error)
  }, [])

  const initMap = useCallback(() => {
    if (!mapRef.current) return
    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: HAKODATE_CENTER,
      zoom: 13,
      styles: mapStyles,
      mapId: 'hakodate-halal',
      disableDefaultUI: false,
      zoomControl: true,
    })
  }, [])

  useEffect(() => {
    const map = googleMapRef.current
    if (!map) return

    markersRef.current.forEach((m) => { m.map = null })
    markersRef.current.clear()

    shops.forEach((shop, i) => {
      const el = document.createElement('div')
      el.textContent = String(i + 1).padStart(2, '0')
      Object.assign(el.style, {
        width: '44px',
        height: '44px',
        background: '#1e4d2b',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Serif Display', serif",
        fontSize: '15px',
        cursor: 'pointer',
        border: '2px solid transparent',
        transition: 'transform 0.15s, border-color 0.15s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      })

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: shop.lat, lng: shop.lng },
        content: el,
        title: shop.name,
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family:'DM Sans',sans-serif;padding:4px 0;min-width:120px;">
            <div style="font-family:'DM Serif Display',serif;font-size:15px;margin-bottom:6px;">${shop.name}</div>
            <a href="/shops/${shop.id}" style="color:#1e4d2b;font-size:13px;font-weight:600;">
              ${t('viewDetail')} →
            </a>
          </div>
        `,
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      el.addEventListener('dblclick', () => navigate(`/shops/${shop.id}`))

      markersRef.current.set(shop.id, marker)
    })
  }, [shops, navigate, t])

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.content as HTMLElement
      el.style.transform = hoveredId === id ? 'scale(1.2)' : 'scale(1)'
      el.style.borderColor = hoveredId === id ? '#fff' : 'transparent'
    })
  }, [hoveredId])

  return (
    <div style={styles.container}>
      {/* Desktop sidebar */}
      <aside className="desktop-only" style={styles.sidebar}>
        <FilterBar filters={filters} onChange={setFilters} t={t} />
        <div style={styles.sideList}>
          {shops.length === 0 && <p style={styles.empty}>{t('noShops')}</p>}
          {shops.map((shop, i) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              index={i}
              lang={lang}
              t={t}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </aside>

      {/* Map area */}
      <div style={styles.mapWrap}>
        {!GOOGLE_MAPS_API_KEY && (
          <div style={styles.mapPlaceholder}>
            <p>Google Maps APIキーを設定してください</p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
              VITE_GOOGLE_MAPS_API_KEY を .env に追加
            </p>
          </div>
        )}
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Floating filter chips (mobile only) — floats at top of map */}
        <div className="mobile-only" style={styles.floatingFilter}>
          <FilterBar filters={filters} onChange={setFilters} t={t} floating />
        </div>

        {/* Mobile bottom sheet — compact peek, expands on tap */}
        <div
          className="mobile-only"
          style={{
            ...styles.bottomSheet,
            height: sheetExpanded ? 'calc(100% - 60px)' : `${PEEK_HEIGHT}px`,
          }}
        >
          {/* Handle + count row */}
          <button
            style={styles.handleBtn}
            onClick={() => setSheetExpanded(!sheetExpanded)}
            aria-label={sheetExpanded ? t('hideList') : t('showList')}
          >
            <div style={styles.handleBar} />
            <div style={styles.peekRow}>
              <span style={styles.sheetCount}>
                {shops.length} {t('shopUnit')}
              </span>
              <span style={styles.expandHint}>
                {sheetExpanded ? `▼ ${t('hideList')}` : `▲ ${t('showList')}`}
              </span>
            </div>
          </button>

          {/* Scrollable list — only visible when expanded */}
          {sheetExpanded && (
            <div style={styles.sheetList}>
              {shops.length === 0 && <p style={styles.empty}>{t('noShops')}</p>}
              {shops.map((shop, i) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  index={i}
                  lang={lang}
                  t={t}
                  onHover={setHoveredId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '360px',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRight: '1px solid var(--border)',
    background: 'var(--bg)',
  },
  sideList: {
    flex: 1,
    overflowY: 'auto',
  },
  mapWrap: {
    flex: 1,
    position: 'relative',
    background: 'var(--map-bg)',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--map-bg)',
    color: 'var(--text-muted)',
    fontFamily: "'DM Serif Display', serif",
    fontSize: '18px',
    zIndex: 1,
  },
  floatingFilter: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    zIndex: 10,
    background: 'rgba(240, 236, 228, 0.94)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: 'var(--radius-pill)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--bg)',
    borderRadius: '20px 20px 0 0',
    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 10,
  },
  handleBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '10px 0 0',
    cursor: 'pointer',
    flexShrink: 0,
    width: '100%',
    touchAction: 'manipulation',
  },
  handleBar: {
    width: '40px',
    height: '4px',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--border)',
    alignSelf: 'center',
    marginBottom: '8px',
  },
  peekRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px 10px',
  },
  sheetCount: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  expandHint: {
    fontSize: '12px',
    color: 'var(--marker)',
    fontWeight: 600,
  },
  sheetList: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch' as never,
  },
  empty: {
    padding: '32px 16px',
    color: 'var(--text-muted)',
    fontSize: '14px',
    textAlign: 'center',
  },
}
