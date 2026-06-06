import { useState, useEffect } from 'react'
import type { Report } from '../types'

interface AdminPageProps {
  t: (key: string) => string
}

export default function AdminPage({ t }: AdminPageProps) {
  const [token, setToken] = useState(() => localStorage.getItem('admin-token') ?? '')
  const [inputToken, setInputToken] = useState('')
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)

  const fetchReports = async (jwt: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/reports', { headers: { Authorization: `Bearer ${jwt}` } })
      if (!res.ok) { alert('認証失敗'); return }
      const data = await res.json() as Report[]
      setReports(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchReports(token)
  }, [token])

  const handleLogin = () => {
    localStorage.setItem('admin-token', inputToken)
    setToken(inputToken)
  }

  const resolve = async (id: string) => {
    await fetch(`/api/reports/${id}/resolve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, resolved: 1 } : r))
  }

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>{t('adminPage')}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            管理者JWTトークンを入力してください
          </p>
          <input
            type="text"
            placeholder="Bearer token..."
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.btn}>{t('login')}</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <h1 style={styles.title}>{t('reportList')}</h1>
          <button onClick={() => { setToken(''); localStorage.removeItem('admin-token') }} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>{t('target')}</th>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>{t('reason')}</th>
              <th style={styles.th}>{t('status')}</th>
              <th style={styles.th}>日時</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} style={r.resolved ? styles.rowResolved : styles.row}>
                <td style={styles.td}>
                  <span className={`badge badge-${r.target_type === 'shop' ? 'food' : 'inquire'}`}>
                    {r.target_type}
                  </span>
                </td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>
                  {r.target_type === 'shop'
                    ? <a href={`/shops/${r.target_id}`} style={{ color: 'var(--marker)' }}>{r.target_id.slice(0, 8)}...</a>
                    : r.target_id.slice(0, 8) + '...'
                  }
                </td>
                <td style={styles.td}>{r.reason ?? '-'}</td>
                <td style={styles.td}>
                  {r.resolved
                    ? <span style={{ color: 'var(--badge-halal)', fontWeight: 600 }}>✓ 解決済</span>
                    : <span style={{ color: 'var(--badge-pork)', fontWeight: 600 }}>{t('pending')}</span>
                  }
                </td>
                <td style={styles.td}>{new Date(r.created_at).toLocaleString('ja-JP')}</td>
                <td style={styles.td}>
                  {!r.resolved && (
                    <button onClick={() => resolve(r.id)} style={styles.resolveBtn}>
                      {t('resolved')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && !loading && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>
            通報はありません
          </p>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { overflowY: 'auto', flex: 1 },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' },
  loginBox: { maxWidth: '400px', margin: '80px auto', padding: '32px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontFamily: "'DM Serif Display', serif", fontSize: '28px' },
  input: { border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', background: 'white', width: '100%' },
  btn: { background: 'var(--marker)', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  logoutBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '2px solid var(--border)' },
  td: { padding: '10px 12px', fontSize: '14px', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' },
  row: {},
  rowResolved: { opacity: 0.5 },
  resolveBtn: { background: 'var(--badge-halal)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },
}
