type TriState = number | null

interface IngredientToggleProps {
  label: string
  value: TriState
  onChange: (v: TriState) => void
  dangerIfPresent?: boolean
  t: (key: string) => string
}

export default function IngredientToggle({ label, value, onChange, dangerIfPresent, t }: IngredientToggleProps) {
  const opts: { val: TriState; textKey: string }[] = [
    { val: 0, textKey: 'ingNo' },
    { val: null, textKey: 'ingUnknown' },
    { val: 1, textKey: 'ingYes' },
  ]

  return (
    <div style={styles.wrap}>
      <span style={styles.label}>{label}</span>
      <div style={styles.group}>
        {opts.map(({ val, textKey }) => {
          const active = value === val
          return (
            <button
              key={String(val)}
              type="button"
              onClick={() => onChange(val)}
              style={active ? activeStyle(val, dangerIfPresent) : styles.btn}
            >
              {t(textKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function activeStyle(val: TriState, dangerIfPresent?: boolean): React.CSSProperties {
  if (val === null) return { ...styles.btn, background: '#e2e8f0', color: '#475569', fontWeight: 700 }
  if (val === 1) {
    return dangerIfPresent
      ? { ...styles.btn, background: '#fecaca', color: '#dc2626', fontWeight: 700 }
      : { ...styles.btn, background: '#bbf7d0', color: '#15803d', fontWeight: 700 }
  }
  return dangerIfPresent
    ? { ...styles.btn, background: '#bbf7d0', color: '#15803d', fontWeight: 700 }
    : { ...styles.btn, background: '#e2e8f0', color: '#475569', fontWeight: 700 }
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  label: { fontSize: '14px', color: 'var(--text-primary)', flex: 1, minWidth: 0, marginRight: '8px', lineHeight: 1.4 },
  group: { display: 'flex', gap: '4px', flexShrink: 0 },
  btn: {
    padding: '6px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-pill)',
    background: 'white',
    color: 'var(--text-muted)',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    minWidth: '48px',
    textAlign: 'center' as const,
    touchAction: 'manipulation',
  },
}

// 表示専用（ShopPage用）
export function IngredientBadge({ label, value, dangerIfPresent }: {
  label: string
  value: TriState
  dangerIfPresent?: boolean
}) {
  if (value === null) return null

  let text: string
  let bg: string
  let color: string

  if (value === 1) {
    text = 'あり'
    bg = dangerIfPresent ? '#fecaca' : '#bbf7d0'
    color = dangerIfPresent ? '#dc2626' : '#15803d'
  } else {
    text = 'なし'
    bg = dangerIfPresent ? '#bbf7d0' : '#f1f5f9'
    color = dangerIfPresent ? '#15803d' : '#64748b'
  }

  return (
    <div style={badgeStyles.wrap}>
      <span style={badgeStyles.label}>{label}</span>
      <span style={{ ...badgeStyles.val, background: bg, color }}>{text}</span>
    </div>
  )
}

const badgeStyles: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid var(--border)',
  },
  label: { fontSize: '14px', color: 'var(--text-primary)' },
  val: {
    fontSize: '12px', fontWeight: 700, padding: '2px 10px',
    borderRadius: '999px',
  },
}
