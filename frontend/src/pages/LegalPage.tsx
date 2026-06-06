export default function LegalPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.h1}>特定商取引法に基づく表記</h1>

        <table style={styles.table}>
          <tbody>
            <Row label="販売業者" value="株式会社TackMore" />
            <Row label="代表者" value="祐川雅治" />
            <Row label="所在地" value="〒040-0004 北海道函館市杉並町6-2-103" />
            <Row label="電話番号" value="080-3327-2551" />
            <Row label="メールアドレス" value="info@tackmore.jp" />
            <Row label="サービス内容" value="函館・道南エリアのムスリムフレンドリー店舗情報の検索・閲覧・登録" />
            <Row label="利用料金" value="無料（広告収入により運営）" />
            <Row label="支払方法" value="該当なし（無料サービス）" />
            <Row label="返金ポリシー" value="該当なし（無料サービス）" />
            <Row label="サービス提供時期" value="会員登録不要・即時利用可能" />
          </tbody>
        </table>

        <p style={styles.updated}>最終更新日: 2025年6月</p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <th style={styles.th}>{label}</th>
      <td style={styles.td}>{value}</td>
    </tr>
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
