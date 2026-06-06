import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Shop, Photo } from '../types'
import type { Lang } from '../i18n/translations'
import Badge from '../components/Badge'
import { IngredientBadge } from '../components/IngredientToggle'

const isInstagram = (url: string) => url.includes('instagram.com')
const isFacebook = (url: string) => url.includes('facebook.com')

function hasAnyIngredient(shop: Shop) {
  return [
    shop.contains_pork, shop.contains_alcohol, shop.uses_halal_meat,
    shop.contains_beef, shop.contains_chicken, shop.contains_seafood,
    shop.contains_dairy, shop.contains_egg, shop.contains_gluten,
    shop.is_vegetarian, shop.is_vegan,
  ].some((v) => v !== null)
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function WebsiteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  )
}

interface ShopPageProps {
  lang: Lang
  t: (key: string) => string
}

export default function ShopPage({ lang, t }: ShopPageProps) {
  const { id } = useParams<{ id: string }>()
  const [shop, setShop] = useState<(Shop & { photos: string }) | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [reportingId, setReportingId] = useState<string | null>(null)
  const [reportCategory, setReportCategory] = useState('')
  const [reportDetail, setReportDetail] = useState('')
  const [reportContactEmail, setReportContactEmail] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/shops/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setShop(data)
        try {
          setPhotos(JSON.parse(data.photos ?? '[]'))
        } catch {
          setPhotos([])
        }
      })
      .catch(console.error)
  }, [id])

  const comment = shop ? (shop[`comment_${lang}` as keyof Shop] as string | null) : null

  const handlePhotoUpload = async () => {
    const files = fileRef.current?.files
    if (!files || files.length === 0 || !id) return
    if (files.length > 3) {
      alert(t('maxPhotos'))
      return
    }
    const formData = new FormData()
    for (const f of Array.from(files)) formData.append('photos', f)
    setUploading(true)
    try {
      const res = await fetch(`/api/shops/${id}/photos`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json() as { uploaded: string[] }
      setPhotos((prev) => [...prev, ...data.uploaded.map((url, i) => ({ id: `new-${i}`, photo_url: url }))])
      if (fileRef.current) fileRef.current.value = ''
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleReport = async (targetType: 'shop' | 'photo', targetId: string) => {
    if (!reportCategory) return
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId,
        category: reportCategory,
        reason: reportDetail || undefined,
        contact_email: reportContactEmail || undefined,
      }),
    })
    setReportingId(null)
    setReportCategory('')
    setReportDetail('')
    setReportContactEmail('')
    alert(t('reportReceived'))
  }

  if (!shop) return <div style={styles.loading}>Loading...</div>

  const allPhotos = [
    ...(shop.main_photo_url ? [{ id: 'main', photo_url: shop.main_photo_url }] : []),
    ...photos,
  ]

  const mapsUrl = shop.place_id
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name)}&query_place_id=${shop.place_id}`
    : `https://www.google.com/maps?q=${shop.lat},${shop.lng}`

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>← {t('back')}</Link>

        <div style={styles.header}>
          <div>
            <h1 style={styles.name}>{shop.name}</h1>
            <div style={styles.badges}>
              <Badge value={shop.halal_level} type="halal" t={t} />
              <Badge value={shop.category} type="category" t={t} />
              {shop.has_prayer_space === 1 && (
                <span className="badge" style={{ background: 'var(--marker)' }}>
                  {t('prayerSpace')}
                </span>
              )}
            </div>
          </div>
          <button
            style={styles.reportBtn}
            onClick={() => setReportingId(shop.id)}
            aria-label={t('report')}
          >
            <FlagIcon /> {t('report')}
          </button>
        </div>

        {/* External links */}
        <div style={styles.mapBtns}>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={styles.mapBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {t('googleMaps')}
          </a>

          {shop.instagram_url && (
            <a href={shop.instagram_url} target="_blank" rel="noopener noreferrer" style={styles.iconBtn} aria-label="Instagram">
              <InstagramIcon />
            </a>
          )}
          {shop.facebook_url && (
            <a href={shop.facebook_url} target="_blank" rel="noopener noreferrer" style={styles.iconBtn} aria-label="Facebook">
              <FacebookIcon />
            </a>
          )}
          {shop.website_url && !isInstagram(shop.website_url) && !isFacebook(shop.website_url) && (
            <a href={shop.website_url} target="_blank" rel="noopener noreferrer" style={styles.iconBtn} aria-label="Website">
              <WebsiteIcon />
            </a>
          )}
          {shop.website_url && isInstagram(shop.website_url) && !shop.instagram_url && (
            <a href={shop.website_url} target="_blank" rel="noopener noreferrer" style={styles.iconBtn} aria-label="Instagram">
              <InstagramIcon />
            </a>
          )}
          {shop.website_url && isFacebook(shop.website_url) && !shop.facebook_url && (
            <a href={shop.website_url} target="_blank" rel="noopener noreferrer" style={styles.iconBtn} aria-label="Facebook">
              <FacebookIcon />
            </a>
          )}
        </div>

        <div style={styles.meta}>
          {shop.opening_hours && (
            <div><span style={styles.metaLabel}>{t('openingHours')}</span> {shop.opening_hours}</div>
          )}
        </div>

        {/* Rating */}
        {shop.submitter_rating != null && shop.submitter_rating > 0 && (
          <div style={styles.ratingRow}>
            {[1,2,3,4,5].map((n) => (
              <span key={n} style={{ ...styles.ratingDot, background: n <= shop.submitter_rating! ? 'var(--marker)' : 'var(--border)' }} />
            ))}
            <span style={styles.ratingText}>{shop.submitter_rating} / 5</span>
          </div>
        )}

        {/* Menu items */}
        {shop.menu_items && (() => {
          try {
            const items: string[] = JSON.parse(shop.menu_items)
            if (items.length === 0) return null
            return (
              <div style={styles.menuSection}>
                <p style={styles.metaLabel}>{t('menuItems')}</p>
                <div style={styles.menuTags}>
                  {items.map((item, i) => (
                    <span key={i} style={styles.menuTag}>{item}</span>
                  ))}
                </div>
              </div>
            )
          } catch { return null }
        })()}

        {/* Ingredient info */}
        {hasAnyIngredient(shop) && (
          <div style={styles.ingredientSection}>
            <p style={styles.metaLabel}>{t('ingredientInfo')}</p>
            <div style={styles.ingredientGroup}>
              <p style={styles.ingredientGroupLabel}>{t('halalRelated')}</p>
              <IngredientBadge label={t('ingPork')} value={shop.contains_pork} dangerIfPresent />
              <IngredientBadge label={t('ingAlcohol')} value={shop.contains_alcohol} dangerIfPresent />
              <IngredientBadge label={t('ingHalalMeat')} value={shop.uses_halal_meat} />
            </div>
            <div style={styles.ingredientGroup}>
              <p style={styles.ingredientGroupLabel}>{t('meatSeafood')}</p>
              <IngredientBadge label={t('ingBeef')} value={shop.contains_beef} />
              <IngredientBadge label={t('ingChicken')} value={shop.contains_chicken} />
              <IngredientBadge label={t('ingSeafood')} value={shop.contains_seafood} />
            </div>
            <div style={styles.ingredientGroup}>
              <p style={styles.ingredientGroupLabel}>{t('allergyRestriction')}</p>
              <IngredientBadge label={t('ingDairy')} value={shop.contains_dairy} />
              <IngredientBadge label={t('ingEgg')} value={shop.contains_egg} />
              <IngredientBadge label={t('ingGluten')} value={shop.contains_gluten} />
              <IngredientBadge label={t('ingVegetarian')} value={shop.is_vegetarian} />
              <IngredientBadge label={t('ingVegan')} value={shop.is_vegan} />
            </div>
          </div>
        )}

        {comment && <p style={styles.comment}>{comment}</p>}

        {allPhotos.length > 0 && (
          <div style={styles.gallery}>
            {allPhotos.map((p, i) => (
              <div key={p.id} style={styles.photoWrap}>
                <img src={p.photo_url} alt={`${shop.name} photo ${i + 1}`} style={styles.photo} loading="lazy" />
                {p.id !== 'main' && (
                  <button
                    style={styles.photoReport}
                    onClick={() => setReportingId(`photo:${p.id}`)}
                    aria-label={t('report')}
                  >
                    <FlagIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={styles.uploadSection}>
          <h2 style={styles.sectionTitle}>{t('uploadPhoto')}</h2>
          <p style={styles.hint}>{t('selectFiles')}</p>
          <div style={styles.uploadRow}>
            <input type="file" accept="image/*" multiple ref={fileRef} style={styles.fileInput} />
            <button onClick={handlePhotoUpload} disabled={uploading} style={styles.btn}>
              {uploading ? '...' : t('submit')}
            </button>
          </div>
        </div>

        {reportingId && (
          <div style={styles.overlay} onClick={() => setReportingId(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>{t('report')}</h3>
              <p style={styles.modalLabel}>{t('reportCategoryLabel')}</p>
              <div style={styles.categoryPills}>
                {(['reportCatOld', 'reportCatHalal', 'reportCatClosed', 'reportCatOther'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setReportCategory(key)}
                    style={{
                      ...styles.categoryPill,
                      ...(reportCategory === key ? styles.categoryPillActive : {}),
                    }}
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
              <textarea
                value={reportDetail}
                onChange={(e) => setReportDetail(e.target.value)}
                placeholder={t('reportDetail')}
                style={styles.textarea}
              />
              <input
                type="email"
                value={reportContactEmail}
                onChange={(e) => setReportContactEmail(e.target.value)}
                placeholder={t('reportContactEmail')}
                style={styles.emailInput}
              />
              <div style={styles.modalBtns}>
                <button
                  onClick={() => {
                    const isPhoto = reportingId.startsWith('photo:')
                    const targetId = isPhoto ? reportingId.slice(6) : reportingId
                    handleReport(isPhoto ? 'photo' : 'shop', targetId)
                  }}
                  disabled={!reportCategory}
                  style={{ ...styles.btn, opacity: reportCategory ? 1 : 0.4 }}
                >
                  {t('submit')}
                </button>
                <button
                  onClick={() => {
                    setReportingId(null)
                    setReportCategory('')
                    setReportDetail('')
                    setReportContactEmail('')
                  }}
                  style={styles.cancelBtn}
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { overflowY: 'auto', flex: 1 },
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px 16px' },
  loading: { padding: '48px', textAlign: 'center', color: 'var(--text-muted)' },
  back: { fontSize: '14px', color: 'var(--marker)', fontWeight: 600, display: 'inline-block', marginBottom: '16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' },
  name: { fontFamily: "'DM Serif Display', serif", fontSize: '28px', marginBottom: '8px' },
  badges: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  mapBtns: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0', alignItems: 'center' },
  mapBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'var(--marker)', color: 'white',
    padding: '8px 16px', borderRadius: 'var(--radius-pill)',
    fontSize: '13px', fontWeight: 600, textDecoration: 'none',
  },
  iconBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'white', border: '1.5px solid var(--border)',
    color: 'var(--text-primary)', textDecoration: 'none',
    transition: 'border-color 0.15s',
  },
  meta: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: 'var(--text-muted)', margin: '12px 0' },
  metaLabel: { fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px', marginBottom: '4px' },
  comment: { fontSize: '15px', lineHeight: 1.7, margin: '16px 0', padding: '16px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' },
  gallery: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' },
  photoWrap: { position: 'relative' },
  photo: { width: '160px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' },
  photoReport: { position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: 'var(--radius-pill)', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '6px', margin: '10px 0' },
  ratingDot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  ratingText: { fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '4px' },
  menuSection: { margin: '12px 0' },
  menuTags: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginTop: '6px' },
  menuTag: { background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', fontSize: '13px' },
  ingredientSection: { margin: '16px 0', padding: '16px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' },
  ingredientGroup: { marginTop: '10px' },
  ingredientGroupLabel: { fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', marginTop: '8px' },
  uploadSection: { margin: '24px 0', padding: '20px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' },
  sectionTitle: { fontFamily: "'DM Serif Display', serif", fontSize: '18px', marginBottom: '6px' },
  hint: { fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' },
  uploadRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  fileInput: { flex: 1, fontSize: '13px' },
  btn: { background: 'var(--marker)', color: 'white', border: 'none', borderRadius: 'var(--radius-pill)', padding: '8px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  reportBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', width: '360px', maxWidth: '90vw' },
  modalTitle: { fontFamily: "'DM Serif Display', serif", fontSize: '20px', marginBottom: '12px' },
  modalLabel: { fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' },
  categoryPills: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '12px' },
  categoryPill: { background: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' },
  categoryPillActive: { background: 'var(--marker)', borderColor: 'var(--marker)', color: 'white' },
  textarea: { width: '100%', boxSizing: 'border-box' as const, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px', fontSize: '14px', minHeight: '72px', resize: 'vertical' as const, marginBottom: '8px' },
  emailInput: { width: '100%', boxSizing: 'border-box' as const, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', fontSize: '14px', marginBottom: '4px' },
  modalBtns: { display: 'flex', gap: '8px', marginTop: '12px' },
  cancelBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '8px 20px', fontSize: '14px', cursor: 'pointer' },
}
