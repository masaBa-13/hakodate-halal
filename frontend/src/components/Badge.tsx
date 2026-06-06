interface BadgeProps {
  value: string
  type?: 'halal' | 'category'
  t?: (key: string) => string
}

const halalFallback: Record<string, string> = {
  certified: 'Halal Certified',
  friendly: 'Muslim Friendly',
  pork_free: 'Pork Free',
  inquire: 'Inquire',
}

const categoryFallback: Record<string, string> = {
  food: 'Food',
  stay: 'Stay',
  shop: 'Shop',
  other: 'Other',
}

export default function Badge({ value, type = 'halal', t }: BadgeProps) {
  const label = t
    ? t(value)
    : (type === 'halal' ? halalFallback[value] : categoryFallback[value]) ?? value
  const className = `badge badge-${value}`
  return <span className={className}>{label}</span>
}
