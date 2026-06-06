import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit, rateLimitResponse } from '../middleware/rateLimit'

function makeKV(store: Record<string, string> = {}): KVNamespace {
  return {
    get: vi.fn(async (key: string) => store[key] ?? null),
    put: vi.fn(async (key: string, value: string) => { store[key] = value }),
    delete: vi.fn(),
    list: vi.fn(),
    getWithMetadata: vi.fn(),
  } as unknown as KVNamespace
}

describe('checkRateLimit', () => {
  it('allows first request and returns remaining = max - 1', async () => {
    const kv = makeKV()
    const result = await checkRateLimit(kv, '1.2.3.4', { windowMs: 60000, max: 5, keyPrefix: 'test' })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('blocks when count reaches max', async () => {
    const store: Record<string, string> = {}
    const kv = makeKV(store)
    const opts = { windowMs: 60000, max: 3, keyPrefix: 'test' }

    await checkRateLimit(kv, '1.2.3.4', opts)
    await checkRateLimit(kv, '1.2.3.4', opts)
    await checkRateLimit(kv, '1.2.3.4', opts)
    const result = await checkRateLimit(kv, '1.2.3.4', opts)

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('different IPs have independent counters', async () => {
    const kv = makeKV()
    const opts = { windowMs: 60000, max: 1, keyPrefix: 'test' }

    const r1 = await checkRateLimit(kv, '1.1.1.1', opts)
    const r2 = await checkRateLimit(kv, '2.2.2.2', opts)

    expect(r1.allowed).toBe(true)
    expect(r2.allowed).toBe(true)
  })
})

describe('rateLimitResponse', () => {
  it('returns 429 status', () => {
    const res = rateLimitResponse(Math.floor(Date.now() / 1000) + 60)
    expect(res.status).toBe(429)
  })

  it('includes Retry-After header', () => {
    const resetAt = Math.floor(Date.now() / 1000) + 60
    const res = rateLimitResponse(resetAt)
    expect(res.headers.get('Retry-After')).toBeTruthy()
  })
})
