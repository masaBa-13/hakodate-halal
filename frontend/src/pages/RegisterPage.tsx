import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlaceSearchInput, { type PlaceResult } from '../components/PlaceSearchInput'
import IngredientToggle from '../components/IngredientToggle'

interface RegisterPageProps {
  t: (key: string) => string
}

type SubmitterType = 'owner' | 'user'
type Step = 'select' | 'shop' | 'contact'
type TriState = number | null

interface ShopForm {
  name: string; address: string; lat: string; lng: string; place_id: string
  category: string; halal_level: string; has_prayer_space: boolean; opening_hours: string
  menu_items: string; submitter_rating: number
  contains_pork: TriState; contains_alcohol: TriState; uses_halal_meat: TriState
  contains_beef: TriState; contains_chicken: TriState; contains_seafood: TriState
  contains_dairy: TriState; contains_egg: TriState; contains_gluten: TriState
  is_vegetarian: TriState; is_vegan: TriState
  comment_ja: string; comment_en: string; comment_ms: string; comment_id: string; comment_bn: string
  website_url: string; instagram_url: string; facebook_url: string
}

interface OwnerContact { shop_name: string; owner_name: string; phone: string; email: string }
interface UserContact { nickname: string; email: string }

const initialShop: ShopForm = {
  name: '', address: '', lat: '', lng: '', place_id: '',
  category: 'food', halal_level: 'certified', has_prayer_space: false, opening_hours: '',
  menu_items: '', submitter_rating: 0,
  contains_pork: null, contains_alcohol: null, uses_halal_meat: null,
  contains_beef: null, contains_chicken: null, contains_seafood: null,
  contains_dairy: null, contains_egg: null, contains_gluten: null,
  is_vegetarian: null, is_vegan: null,
  comment_ja: '', comment_en: '', comment_ms: '', comment_id: '', comment_bn: '',
  website_url: '', instagram_url: '', facebook_url: '',
}

export default function RegisterPage({ t }: RegisterPageProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('select')
  const [submitterType, setSubmitterType] = useState<SubmitterType>('owner')
  const [shop, setShop] = useState<ShopForm>(initialShop)
  const [ownerContact, setOwnerContact] = useState<OwnerContact>({ shop_name: '', owner_name: '', phone: '', email: '' })
  const [userContact, setUserContact] = useState<UserContact>({ nickname: '', email: '' })
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedTruth, setAgreedTruth] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const updateShop = (patch: Partial<ShopForm>) => setShop((s) => ({ ...s, ...patch }))

  const handlePlaceSelect = (place: PlaceResult) => {
    updateShop({
      name: place.name, address: place.formattedAddress,
      lat: String(place.lat), lng: String(place.lng),
      place_id: place.placeId, website_url: place.website || '',
    })
  }

  const handleShopNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shop.lat || !shop.lng) { alert(t('selectPlaceAlert')); return }
    setStep('contact')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedTerms || !agreedPrivacy || !agreedTruth) { alert(t('agreeAllAlert')); return }
    setSubmitting(true)
    try {
      const payload = {
        name: shop.name, address: shop.address,
        lat: parseFloat(shop.lat), lng: parseFloat(shop.lng),
        category: shop.category, halal_level: shop.halal_level,
        has_prayer_space: shop.has_prayer_space ? 1 : 0,
        opening_hours: shop.opening_hours || null,
        menu_items: shop.menu_items
          ? JSON.stringify(shop.menu_items.split(',').map((s) => s.trim()).filter(Boolean))
          : null,
        submitter_rating: shop.submitter_rating || null,
        contains_pork: shop.contains_pork, contains_alcohol: shop.contains_alcohol,
        uses_halal_meat: shop.uses_halal_meat, contains_beef: shop.contains_beef,
        contains_chicken: shop.contains_chicken, contains_seafood: shop.contains_seafood,
        contains_dairy: shop.contains_dairy, contains_egg: shop.contains_egg,
        contains_gluten: shop.contains_gluten, is_vegetarian: shop.is_vegetarian,
        is_vegan: shop.is_vegan,
        comment_ja: shop.comment_ja || null, comment_en: shop.comment_en || null,
        comment_ms: shop.comment_ms || null, comment_id: shop.comment_id || null,
        comment_bn: shop.comment_bn || null,
        website_url: shop.website_url || null, instagram_url: shop.instagram_url || null,
        facebook_url: shop.facebook_url || null,
        place_id: shop.place_id || null,
        submitter_type: submitterType,
        ...(submitterType === 'owner'
          ? { submitter_name: ownerContact.owner_name, submitter_email: ownerContact.email, submitter_phone: ownerContact.phone }
          : { submitter_nickname: userContact.nickname, submitter_email: userContact.email }),
      }
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json() as { id: string }
      navigate(`/shops/${data.id}`)
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Step 1: Select type */}
        {step === 'select' && (
          <>
            <h1 style={styles.title}>{t('registerTitle')}</h1>
            <p style={styles.subtitle}>{t('registerSelectType')}</p>
            <div style={styles.cards}>
              <button style={styles.typeCard} onClick={() => { setSubmitterType('owner'); setStep('shop') }}>
                <div style={styles.typeLabel}>{t('ownerType')}</div>
                <div style={styles.typeDesc}>{t('ownerTypeDesc')}</div>
              </button>
              <button style={styles.typeCard} onClick={() => { setSubmitterType('user'); setStep('shop') }}>
                <div style={styles.typeLabel}>{t('userType')}</div>
                <div style={styles.typeDesc}>{t('userTypeDesc')}</div>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Shop info */}
        {step === 'shop' && (
          <>
            <div style={styles.stepNav}>
              <button style={styles.backBtn} onClick={() => setStep('select')}>← {t('back')}</button>
              <span style={styles.stepBadge}>{submitterType === 'owner' ? t('ownerType') : t('userType')}</span>
            </div>
            <h1 style={styles.title}>{t('shopInfo')}</h1>

            <form onSubmit={handleShopNext} style={styles.form}>

              {/* Shop search */}
              <Section title={t('searchShop')}>
                <Field label={t('searchLabel')}>
                  <PlaceSearchInput
                    onSelect={handlePlaceSelect}
                    inputStyle={styles.input}
                    placeholder={t('searchPlaceholder')}
                  />
                </Field>
                {shop.name ? (
                  <div style={styles.selectedPlace}>
                    <div style={{ flex: 1 }}>
                      <div style={styles.selectedName}>{shop.name}</div>
                      <div style={styles.selectedAddr}>{shop.address}</div>
                    </div>
                    <button type="button" onClick={() => updateShop({ name: '', address: '', lat: '', lng: '', place_id: '' })} style={styles.clearBtn}>
                      {t('clearBtn')}
                    </button>
                  </div>
                ) : (
                  <p style={styles.hint}>{t('selectFromList')}</p>
                )}
              </Section>

              {/* Basic info */}
              <Section title={t('basicInfo')}>
                <Field label={`${t('category')} *`}>
                  <select style={styles.input} value={shop.category} onChange={(e) => updateShop({ category: e.target.value })}>
                    <option value="food">{t('food')}</option>
                    <option value="stay">{t('stay')}</option>
                    <option value="shop">{t('shop')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </Field>
                <Field label={`${t('halalLevel')} *`}>
                  <select style={styles.input} value={shop.halal_level} onChange={(e) => updateShop({ halal_level: e.target.value })}>
                    <option value="certified">{t('certified')}</option>
                    <option value="friendly">{t('friendly')}</option>
                    <option value="pork_free">{t('pork_free')}</option>
                    <option value="inquire">{t('inquire')}</option>
                  </select>
                </Field>
                <label style={styles.checkRow}>
                  <input type="checkbox" checked={shop.has_prayer_space} onChange={(e) => updateShop({ has_prayer_space: e.target.checked })} />
                  <span>{t('hasPrayerSpace')}</span>
                </label>
                <Field label={t('openingHours')}>
                  <input style={styles.input} value={shop.opening_hours}
                    onChange={(e) => updateShop({ opening_hours: e.target.value })}
                    placeholder={t('openingHoursPlaceholder')} />
                </Field>
              </Section>

              {/* Menu & Rating */}
              <Section title={t('menuRating')}>
                <Field label={t('menuLabel')}>
                  <textarea style={styles.textarea} value={shop.menu_items}
                    onChange={(e) => updateShop({ menu_items: e.target.value })}
                    placeholder={t('menuPlaceholder')} />
                </Field>
                <Field label={t('rating')}>
                  <div style={styles.ratingBtns}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button"
                        onClick={() => updateShop({ submitter_rating: shop.submitter_rating === n ? 0 : n })}
                        style={shop.submitter_rating >= n ? styles.ratingBtnActive : styles.ratingBtn}>
                        {n}
                      </button>
                    ))}
                    {shop.submitter_rating > 0 && (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '4px' }}>
                        / 5
                      </span>
                    )}
                  </div>
                </Field>
              </Section>

              {/* Ingredient info */}
              <Section title={t('ingredientInfo')}>
                <p style={styles.sectionHint}>{t('ingredientHint')}</p>

                <div style={styles.ingredientGroup}>
                  <p style={styles.groupLabel}>{t('halalRelated')}</p>
                  <IngredientToggle label={t('ingPork')} value={shop.contains_pork} onChange={(v) => updateShop({ contains_pork: v })} dangerIfPresent t={t} />
                  <IngredientToggle label={t('ingAlcoholFull')} value={shop.contains_alcohol} onChange={(v) => updateShop({ contains_alcohol: v })} dangerIfPresent t={t} />
                  <IngredientToggle label={t('ingHalalMeatFull')} value={shop.uses_halal_meat} onChange={(v) => updateShop({ uses_halal_meat: v })} t={t} />
                </div>

                <div style={styles.ingredientGroup}>
                  <p style={styles.groupLabel}>{t('meatSeafood')}</p>
                  <IngredientToggle label={t('ingBeef')} value={shop.contains_beef} onChange={(v) => updateShop({ contains_beef: v })} t={t} />
                  <IngredientToggle label={t('ingChicken')} value={shop.contains_chicken} onChange={(v) => updateShop({ contains_chicken: v })} t={t} />
                  <IngredientToggle label={t('ingSeafood')} value={shop.contains_seafood} onChange={(v) => updateShop({ contains_seafood: v })} t={t} />
                </div>

                <div style={styles.ingredientGroup}>
                  <p style={styles.groupLabel}>{t('allergyRestriction')}</p>
                  <IngredientToggle label={t('ingDairy')} value={shop.contains_dairy} onChange={(v) => updateShop({ contains_dairy: v })} t={t} />
                  <IngredientToggle label={t('ingEgg')} value={shop.contains_egg} onChange={(v) => updateShop({ contains_egg: v })} t={t} />
                  <IngredientToggle label={t('ingGluten')} value={shop.contains_gluten} onChange={(v) => updateShop({ contains_gluten: v })} t={t} />
                  <IngredientToggle label={t('ingVegetarian')} value={shop.is_vegetarian} onChange={(v) => updateShop({ is_vegetarian: v })} t={t} />
                  <IngredientToggle label={t('ingVegan')} value={shop.is_vegan} onChange={(v) => updateShop({ is_vegan: v })} t={t} />
                </div>
              </Section>

              {/* Comments */}
              <Section title={t('commentSection')}>
                {(['ja', 'en', 'ms', 'id', 'bn'] as const).map((l) => {
                  const labels: Record<string, string> = { ja: '日本語', en: 'English', ms: 'Melayu', id: 'Indonesia', bn: 'বাংলা' }
                  return (
                    <Field key={l} label={labels[l]}>
                      <textarea style={styles.textarea}
                        value={shop[`comment_${l}` as keyof ShopForm] as string}
                        onChange={(e) => updateShop({ [`comment_${l}`]: e.target.value } as Partial<ShopForm>)} />
                    </Field>
                  )
                })}
              </Section>

              {/* SNS / Website */}
              <Section title={t('snsSection')}>
                <Field label="Website">
                  <input style={styles.input} type="url" value={shop.website_url}
                    onChange={(e) => updateShop({ website_url: e.target.value })}
                    placeholder="https://..." />
                  {shop.website_url && <p style={styles.hint}>{t('websiteAutoFill')}</p>}
                </Field>
                <Field label="Instagram URL">
                  <input style={styles.input} type="url" value={shop.instagram_url}
                    onChange={(e) => updateShop({ instagram_url: e.target.value })}
                    placeholder="https://www.instagram.com/..." />
                </Field>
                <Field label="Facebook URL">
                  <input style={styles.input} type="url" value={shop.facebook_url}
                    onChange={(e) => updateShop({ facebook_url: e.target.value })}
                    placeholder="https://www.facebook.com/..." />
                </Field>
              </Section>

              <button type="submit" style={styles.btn}>{t('nextContact')}</button>
            </form>
          </>
        )}

        {/* Step 3: Contact */}
        {step === 'contact' && (
          <>
            <div style={styles.stepNav}>
              <button style={styles.backBtn} onClick={() => setStep('shop')}>← {t('back')}</button>
              <span style={styles.stepBadge}>{submitterType === 'owner' ? t('ownerType') : t('userType')}</span>
            </div>
            <h1 style={styles.title}>{submitterType === 'owner' ? t('contactInfo') : t('yourInfo')}</h1>

            <form onSubmit={handleSubmit} style={styles.form}>
              <Section title={submitterType === 'owner' ? t('shopOwnerSection') : t('userSection')}>
                {submitterType === 'owner' ? (
                  <>
                    <Field label={`${t('shopNameConfirm')} *`}>
                      <input required style={styles.input} value={ownerContact.shop_name}
                        onChange={(e) => setOwnerContact((c) => ({ ...c, shop_name: e.target.value }))} />
                    </Field>
                    <Field label={`${t('ownerName')} *`}>
                      <input required style={styles.input} value={ownerContact.owner_name}
                        onChange={(e) => setOwnerContact((c) => ({ ...c, owner_name: e.target.value }))} />
                    </Field>
                    <Field label={`${t('phone')} *`}>
                      <input required type="tel" style={styles.input} value={ownerContact.phone}
                        onChange={(e) => setOwnerContact((c) => ({ ...c, phone: e.target.value }))}
                        placeholder="0138-XX-XXXX" />
                    </Field>
                    <Field label={`${t('email')} *`}>
                      <input required type="email" style={styles.input} value={ownerContact.email}
                        onChange={(e) => setOwnerContact((c) => ({ ...c, email: e.target.value }))} />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label={`${t('nickname')} *`}>
                      <input required style={styles.input} value={userContact.nickname}
                        onChange={(e) => setUserContact((c) => ({ ...c, nickname: e.target.value }))} />
                    </Field>
                    <Field label={`${t('email')} *`}>
                      <input required type="email" style={styles.input} value={userContact.email}
                        onChange={(e) => setUserContact((c) => ({ ...c, email: e.target.value }))} />
                      <p style={styles.hint}>{t('emailPrivacyNote')}</p>
                    </Field>
                  </>
                )}
              </Section>

              <Section title={t('agreementSection')}>
                <label style={styles.agreeRow}>
                  <input type="checkbox" checked={agreedTruth} onChange={(e) => setAgreedTruth(e.target.checked)} required />
                  <span>{t('agreement')}</span>
                </label>
                <label style={styles.agreeRow}>
                  <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} required />
                  <span>{t('agreeTermsLabel')} (<a href="/terms" target="_blank" style={styles.link}>{t('terms')}</a>)</span>
                </label>
                <label style={styles.agreeRow}>
                  <input type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} required />
                  <span>{t('agreePrivacyLabel')} (<a href="/privacy" target="_blank" style={styles.link}>{t('privacyPolicy')}</a>)</span>
                </label>
              </Section>

              <button type="submit" disabled={submitting} style={styles.btn}>
                {submitting ? t('submitting') : t('register')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}

const sectionStyle: React.CSSProperties = {
  background: 'white', borderRadius: '12px', padding: '20px',
  border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px',
}
const sectionTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif", fontSize: '16px',
  paddingBottom: '8px', borderBottom: '1px solid var(--border)', margin: 0,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' },
  container: { maxWidth: '600px', margin: '0 auto', padding: '24px 16px', paddingBottom: '48px' },
  title: { fontFamily: "'DM Serif Display', serif", fontSize: '26px', marginBottom: '6px' },
  subtitle: { color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' },

  cards: { display: 'flex', flexDirection: 'column', gap: '12px' },
  typeCard: {
    width: '100%', padding: '20px', background: 'white',
    border: '1.5px solid var(--border)', borderRadius: '12px',
    cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
  },
  typeLabel: { fontSize: '17px', fontWeight: 700, marginBottom: '6px', fontFamily: "'DM Serif Display', serif" },
  typeDesc: { fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 },

  stepNav: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  backBtn: { background: 'none', border: 'none', color: 'var(--marker)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', padding: 0 },
  stepBadge: { fontSize: '12px', background: 'var(--map-bg)', padding: '3px 10px', borderRadius: '999px', color: 'var(--text-muted)' },

  form: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' },
  input: {
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '10px 12px', fontSize: '16px',
    background: 'white', outline: 'none', width: '100%',
    WebkitAppearance: 'none',
  },
  textarea: {
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '10px 12px', fontSize: '15px', background: 'white',
    outline: 'none', width: '100%', minHeight: '80px', resize: 'vertical',
  },
  hint: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' },

  selectedPlace: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'var(--map-bg)', border: '1.5px solid var(--marker)',
    borderRadius: '10px', padding: '12px 14px',
  },
  selectedName: { fontFamily: "'DM Serif Display', serif", fontSize: '15px', fontWeight: 700 },
  selectedAddr: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' },
  clearBtn: {
    background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
    padding: '6px 10px', fontSize: '12px', cursor: 'pointer',
    color: 'var(--text-muted)', flexShrink: 0, whiteSpace: 'nowrap',
  },

  checkRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', cursor: 'pointer', padding: '4px 0' },

  ratingBtns: { display: 'flex', gap: '6px', alignItems: 'center' },
  ratingBtn: {
    width: '44px', height: '44px', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-pill)', background: 'white', color: 'var(--text-muted)',
    fontSize: '16px', fontWeight: 600, cursor: 'pointer',
  },
  ratingBtnActive: {
    width: '44px', height: '44px', border: '1.5px solid var(--marker)',
    borderRadius: 'var(--radius-pill)', background: 'var(--marker)', color: 'white',
    fontSize: '16px', fontWeight: 600, cursor: 'pointer',
  },

  sectionHint: { fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '4px' },
  ingredientGroup: { display: 'flex', flexDirection: 'column', gap: '0' },
  groupLabel: { fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', marginTop: '8px' },

  agreeRow: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', cursor: 'pointer', lineHeight: 1.6 },
  link: { color: 'var(--marker)', fontWeight: 600, textDecoration: 'underline' },

  btn: {
    background: 'var(--marker)', color: 'white', border: 'none',
    borderRadius: '10px', padding: '14px 24px', fontSize: '16px',
    fontWeight: 600, cursor: 'pointer', width: '100%',
  },
}
