import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import IngredientToggle from '../components/IngredientToggle'

const t = (k: string) => ({ ingNo: 'なし', ingUnknown: '?', ingYes: 'あり' }[k] ?? k)

describe('IngredientToggle', () => {
  it('renders all three buttons', () => {
    render(<IngredientToggle label="豚肉" value={null} onChange={() => {}} t={t} />)
    expect(screen.getByText('なし')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
    expect(screen.getByText('あり')).toBeInTheDocument()
  })

  it('calls onChange with 0 when No is clicked', () => {
    const onChange = vi.fn()
    render(<IngredientToggle label="豚肉" value={null} onChange={onChange} t={t} />)
    fireEvent.click(screen.getByText('なし'))
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('calls onChange with null when Unknown is clicked', () => {
    const onChange = vi.fn()
    render(<IngredientToggle label="豚肉" value={0} onChange={onChange} t={t} />)
    fireEvent.click(screen.getByText('?'))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('calls onChange with 1 when Yes is clicked', () => {
    const onChange = vi.fn()
    render(<IngredientToggle label="豚肉" value={null} onChange={onChange} t={t} />)
    fireEvent.click(screen.getByText('あり'))
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
