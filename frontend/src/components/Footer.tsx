import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.links}>
          <Link to="/terms" style={styles.link}>利用規約</Link>
          <span style={styles.sep}>|</span>
          <Link to="/privacy" style={styles.link}>プライバシーポリシー</Link>
          <span style={styles.sep}>|</span>
          <Link to="/legal" style={styles.link}>特定商取引法</Link>
          <span style={styles.sep}>|</span>
          <a href="mailto:info@tackmore.jp" style={styles.link}>お問い合わせ</a>
        </div>
        <p style={styles.copy}>© {new Date().getFullYear()} 株式会社TackMore. All rights reserved.</p>
      </div>
    </footer>
  )
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: '1px solid var(--border)',
    background: 'var(--bg)',
    flexShrink: 0,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  link: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    padding: '2px 4px',
  },
  sep: { fontSize: '12px', color: 'var(--border)' },
  copy: { fontSize: '11px', color: 'var(--text-muted)', margin: 0 },
}
