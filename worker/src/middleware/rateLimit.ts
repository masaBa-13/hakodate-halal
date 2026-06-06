interface RateLimitOptions {
  windowMs: number  // ウィンドウ幅（ミリ秒）
  max: number       // ウィンドウ内の最大リクエスト数
  keyPrefix: string
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number   // Unix時刻（秒）
}

export async function checkRateLimit(
  kv: KVNamespace,
  ip: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = Math.floor(now / options.windowMs) * options.windowMs
  const resetAt = Math.floor((windowStart + options.windowMs) / 1000)
  const key = `${options.keyPrefix}:${ip}:${windowStart}`
  const ttl = Math.ceil(options.windowMs / 1000) + 60

  const raw = await kv.get(key)
  const current = raw ? parseInt(raw) : 0

  if (current >= options.max) {
    return { allowed: false, remaining: 0, resetAt }
  }

  await kv.put(key, String(current + 1), { expirationTtl: ttl })
  return { allowed: true, remaining: options.max - current - 1, resetAt }
}

export function rateLimitResponse(resetAt: number): Response {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(resetAt - Math.floor(Date.now() / 1000)),
        'X-RateLimit-Reset': String(resetAt),
      },
    }
  )
}
