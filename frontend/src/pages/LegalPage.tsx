interface LegalPageProps {
  t: (key: string) => string
}

export default function LegalPage({ t }: LegalPageProps) {
  const rows = [
    { label: t('legalLabelSeller'),      value: '株式会社TackMore' },
    { label: t('legalLabelCeo'),         value: '祐川雅治' },
    { label: t('legalLabelAddress'),     value: '〒040-0004 北海道函館市杉並町6-2-103' },
    { label: t('legalLabelPhone'),       value: '080-3327-2551' },
    { label: t('legalLabelEmail'),       value: 'info@tackmore.jp' },
    { label: t('legalLabelService'),     value: t('legalValueService') },
    { label: t('legalLabelFee'),         value: t('legalValueFee') },
    { label: t('legalLabelPayment'),     value: t('legalValueNA') },
    { label: t('legalLabelRefund'),      value: t('legalValueNA') },
    { label: t('legalLabelAvailability'), value: t('legalValueAvailability') },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.h1}>{t('legalPageTitle')}</h1>

        <table style={styles.table}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th style={styles.th}>{row.label}</th>
                <td style={styles.td}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={styles.updated}>{t('legalLastUpdated')}: 2025年6月</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { overflowY: 'auto', flex: 1 },
  container: { maxWidth: '720px', margin: '0 auto', padding: '40px 16px 64px' },
  h1: { fontFamily: "'DM Serif Display', serif", fontSize: '24px', marginBottom: '32px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: {
    width: '160px', padding: '14px 16px', textAlign: 'left', verticalAlign: 'top',
    background: 'var(--map-bg)', borderBottom: '1px solid var(--border)',
    fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px', borderBottom: '1px solid var(--border)',
    color: 'var(--text-primary)', lineHeight: 1.7,
  },
  updated: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '32px', textAlign: 'right' },
}
