import { Link } from 'react-router-dom'
import type { Shop } from '../types'
import Badge from './Badge'
import type { Lang } from '../i18n/translations'

interface ShopCardProps {
  shop: Shop
  index: number
  lang: Lang
  t: (key: string) => string
  onHover?: (id: string | null) => void
}

export default function ShopCard({ shop, index, lang, t, onHover }: ShopCardProps) {
  const commentKey = `comment_${lang}` as keyof Shop
  const comment = shop[commentKey] as string | null

  return (
    <Link
      to={`/shops/${shop.id}`}
      className="shop-card"
      style={styles.card}
      onMouseEnter={() => onHover?.(shop.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div style={styles.inner}>
        <div style={styles.markerCircle}>{String(index + 1).padStart(2, '0')}</div>
        <div style={styles.info}>
          <div style={styles.name}>{shop.name}</div>
          {comment && <div style={styles.comment}>{comment}</div>}
          <div style={styles.badges}>
            <Badge value={shop.halal_level} type="halal" t={t} />
            <Badge value={shop.category} type="category" t={t} />
            {shop.has_prayer_space === 1 && (
              <span className="badge" style={{ background: 'var(--marker)', fontSize: '10px' }}>
                {t('prayerSpace')}
              </span>
            )}
          </div>
        </div>
        {shop.main_photo_url && (
          <img
            src={shop.main_photo_url}
            alt={shop.name}
            style={styles.thumb}
            loading="lazy"
          />
        )}
      </div>
    </Link>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'block',
    padding: '14px 16px',
    borderBottom: '1px solid var(--border)',
    textDecoration: 'none',
    color: 'inherit',
    minHeight: '72px',
  },
  inner: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  markerCircle: {
    width: '36px',
    height: '36px',
    background: 'var(--marker)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Serif Display', serif",
    fontSize: '13px',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '16px',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  comment: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.4,
  },
  badges: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  thumb: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)',
    flexShrink: 0,
  },
}
