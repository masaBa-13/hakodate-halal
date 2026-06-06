import type { HalalLevel, Category } from '../types'

interface Filters {
  halalLevel: HalalLevel | ''
  category: Category | ''
  prayerSpace: boolean
}

interface FilterBarProps {
  filters: Filters
  onChange: (f: Filters) => void
  t: (key: string) => string
  floating?: boolean
}

const HALAL_OPTS: { value: HalalLevel | ''; labelKey: string }[] = [
  { value: '', labelKey: 'all' },
  { value: 'certified', labelKey: 'certified' },
  { value: 'friendly', labelKey: 'friendly' },
  { value: 'pork_free', labelKey: 'pork_free' },
  { value: 'inquire', labelKey: 'inquire' },
]

const CAT_OPTS: { value: Category; labelKey: string }[] = [
  { value: 'food', labelKey: 'food' },
  { value: 'stay', labelKey: 'stay' },
  { value: 'shop', labelKey: 'shop' },
  { value: 'other', labelKey: 'other' },
]

export default function FilterBar({ filters, onChange, t, floating }: FilterBarProps) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const wrapStyle: React.CSSProperties = floating
    ? { background: 'transparent' }
    : { background: 'var(--bg)', borderBottom: '1px solid var(--border)' }

  return (
    <div style={wrapStyle}>
      <div className="filter-scroll" style={styles.scroll}>
        {/* Halal level chips */}
        {HALAL_OPTS.map(({ value, labelKey }) => (
          <button
            key={`h-${value}`}
            type="button"
            onClick={() => update({ halalLevel: value })}
            style={filters.halalLevel === value
              ? { ...styles.chip, ...styles.chipActive }
              : styles.chip}
          >
            {t(labelKey)}
          </button>
        ))}

        <div style={styles.divider} aria-hidden="true" />

        {/* Category chips */}
        {CAT_OPTS.map(({ value, labelKey }) => (
          <button
            key={`c-${value}`}
            type="button"
            onClick={() => update({ category: filters.category === value ? '' : value })}
            style={filters.category === value
              ? { ...styles.chip, ...styles.chipActive }
              : styles.chip}
          >
            {t(labelKey)}
          </button>
        ))}

        <div style={styles.divider} aria-hidden="true" />

        {/* Prayer space toggle */}
        <button
          type="button"
          onClick={() => update({ prayerSpace: !filters.prayerSpace })}
          style={filters.prayerSpace
            ? { ...styles.chip, ...styles.chipActive }
            : styles.chip}
        >
          {t('filterPrayerSpace')}
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  scroll: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    padding: '10px 12px',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch' as never,
    alignItems: 'center',
  },
  chip: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border)',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    background: 'var(--bg)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    touchAction: 'manipulation',
    minHeight: '36px',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
    WebkitTapHighlightColor: 'transparent',
  },
  chipActive: {
    background: 'var(--marker)',
    borderColor: 'var(--marker)',
    color: 'white',
    fontWeight: 600,
  },
  divider: {
    width: '1px',
    height: '20px',
    background: 'var(--border)',
    flexShrink: 0,
    margin: '0 2px',
  },
}
