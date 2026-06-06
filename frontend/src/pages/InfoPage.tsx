import { useState } from 'react'
import { Link } from 'react-router-dom'

interface InfoPageProps {
  t: (key: string) => string
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function InfoPage({ t }: InfoPageProps) {
  const [category, setCategory] = useState('')
  const [detail, setDetail] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const categories = ['feedbackCatBug', 'feedbackCatSuggestion', 'reportCatOther'] as const

  const handleSubmit = async () => {
    if (!category) return
    setSubmitting(true)
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: 'general',
          target_id: 'app',
          category,
          reason: detail || undefined,
          contact_email: email || undefined,
        }),
      })
      setSubmitted(true)
      setCategory('')
      setDetail('')
      setEmail('')
    } finally {
      setSubmitting(false)
    }
  }

  const legalLinks = [
    { to: '/terms', label: t('terms') },
    { to: '/privacy', label: t('privacyPolicy') },
    { to: '/legal', label: '特定商取引法に基づく表記' },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* 法的情報 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('legalSection')}</h2>
          <div style={styles.card}>
            {legalLinks.map((link, i) => (
              <Link key={link.to} to={link.to} style={{
                ...styles.legalRow,
                ...(i < legalLinks.length - 1 ? styles.legalRowBorder : {}),
              }}>
                <span style={styles.legalLabel}>{link.label}</span>
                <ChevronIcon />
              </Link>
            ))}
          </div>
          <a href="mailto:info@tackmore.jp" style={styles.contactLink}>
            📧 info@tackmore.jp
          </a>
        </section>

        {/* バグ・フィードバック */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('feedbackSection')}</h2>
          {submitted ? (
            <div style={styles.successBox}>
              <span style={styles.successIcon}>✓</span>
              <p style={styles.successText}>{t('feedbackSubmitDone')}</p>
              <button onClick={() => setSubmitted(false)} style={styles.resetBtn}>
                {t('clearBtn')}
              </button>
            </div>
          ) : (
            <div style={styles.card}>
              <p style={styles.fieldLabel}>{t('reportCategoryLabel')}</p>
              <div style={styles.pills}>
                {categories.map((key) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    style={{
                      ...styles.pill,
                      ...(category === key ? styles.pillActive : {}),
                    }}
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder={t('reportDetail')}
                style={styles.textarea}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('reportContactEmail')}
                style={styles.input}
              />
              <button
                onClick={handleSubmit}
                disabled={!category || submitting}
                style={{ ...styles.submitBtn, opacity: category && !submitting ? 1 : 0.4 }}
              >
                {submitting ? t('submitting') : t('submit')}
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { overflowY: 'auto', flex: 1 },
  container: { maxWidth: '600px', margin: '0 auto', padding: '24px 16px 40px' },
  section: { marginBottom: '32px' },
  sectionTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '20px',
    marginBottom: '12px',
    color: 'var(--text-primary)',
  },
  card: {
    background: 'white',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    padding: '16px',
  },
  legalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    fontSize: '15px',
  },
  legalRowBorder: {
    borderBottom: '1px solid var(--border)',
  },
  legalLabel: { fontWeight: 500 },
  contactLink: {
    display: 'inline-block',
    marginTop: '12px',
    fontSize: '14px',
    color: 'var(--marker)',
    textDecoration: 'none',
  },
  fieldLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '8px',
    marginTop: 0,
  },
  pills: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '12px' },
  pill: {
    background: 'white',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-pill)',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  pillActive: { background: 'var(--marker)', borderColor: 'var(--marker)', color: 'white' },
  textarea: {
    width: '100%',
    boxSizing: 'border-box' as const,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px',
    fontSize: '14px',
    minHeight: '72px',
    resize: 'vertical' as const,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box' as const,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 10px',
    fontSize: '14px',
    marginBottom: '12px',
  },
  submitBtn: {
    background: 'var(--marker)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
  successBox: {
    background: 'white',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  successIcon: { fontSize: '32px', color: 'var(--marker)' },
  successText: { fontSize: '15px', color: 'var(--text-primary)', margin: 0 },
  resetBtn: {
    marginTop: '8px',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-pill)',
    padding: '6px 20px',
    fontSize: '13px',
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
}
