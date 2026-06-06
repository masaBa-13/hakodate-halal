import { Hono } from 'hono'
import { compare, hash } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import type { Env } from '../index'
import { checkRateLimit, rateLimitResponse } from '../middleware/rateLimit'

export const authRouter = new Hono<{ Bindings: Env }>()

authRouter.post('/register', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()

  if (!email || !password || password.length < 8) {
    return c.json({ error: 'Invalid email or password (min 8 chars)' }, 400)
  }

  const existing = await c.env.DB.prepare('SELECT id FROM owners WHERE email = ?')
    .bind(email)
    .first()
  if (existing) {
    return c.json({ error: 'Email already registered' }, 409)
  }

  const passwordHash = await hash(password, 10)
  const id = crypto.randomUUID()

  await c.env.DB.prepare(
    'INSERT INTO owners (id, email, password_hash) VALUES (?, ?, ?)'
  )
    .bind(id, email, passwordHash)
    .run()

  const token = await makeToken(id, c.env.JWT_SECRET)
  return c.json({ token }, 201)
})

authRouter.post('/login', async (c) => {
  const ip = c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? 'unknown'
  const rl = await checkRateLimit(c.env.RATE_LIMIT, ip, {
    windowMs: 15 * 60 * 1000, // 15分
    max: 20,                   // 20回まで
    keyPrefix: 'login',
  })
  if (!rl.allowed) return rateLimitResponse(rl.resetAt)

  const { email, password } = await c.req.json<{ email: string; password: string }>()

  const owner = await c.env.DB.prepare(
    'SELECT id, password_hash FROM owners WHERE email = ?'
  )
    .bind(email)
    .first<{ id: string; password_hash: string }>()

  if (!owner || !(await compare(password, owner.password_hash))) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const token = await makeToken(owner.id, c.env.JWT_SECRET)
  return c.json({ token })
})

async function makeToken(ownerId: string, secret: string) {
  const key = new TextEncoder().encode(secret)
  return new SignJWT({ sub: ownerId, role: 'owner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(key)
}

export async function verifyOwnerToken(
  authHeader: string | undefined,
  secret: string
): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(authHeader.slice(7), key)
    if (payload.role !== 'owner') return null
    return payload.sub as string
  } catch {
    return null
  }
}

export async function verifyAdminToken(
  authHeader: string | undefined,
  secret: string
): Promise<boolean> {
  if (!authHeader?.startsWith('Bearer ')) return false
  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(authHeader.slice(7), key)
    return payload.role === 'admin'
  } catch {
    return false
  }
}
