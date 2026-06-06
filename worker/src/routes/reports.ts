import { Hono } from 'hono'
import type { Env } from '../index'
import { verifyAdminToken } from './auth'
import { checkRateLimit, rateLimitResponse } from '../middleware/rateLimit'

export const reportsRouter = new Hono<{ Bindings: Env }>()

reportsRouter.post('/', async (c) => {
  const ip = c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? 'unknown'
  const rl = await checkRateLimit(c.env.RATE_LIMIT, ip, {
    windowMs: 60 * 60 * 1000, // 1時間
    max: 50,                   // 50件まで
    keyPrefix: 'report',
  })
  if (!rl.allowed) return rateLimitResponse(rl.resetAt)

  const { target_type, target_id, category, reason, contact_email } = await c.req.json<{
    target_type: 'shop' | 'photo'
    target_id: string
    category?: string
    reason?: string
    contact_email?: string
  }>()

  if (!target_type || !target_id) {
    return c.json({ error: 'Missing fields' }, 400)
  }

  const id = crypto.randomUUID()
  await c.env.DB.prepare(
    'INSERT INTO reports (id, target_type, target_id, category, reason, contact_email) VALUES (?, ?, ?, ?, ?, ?)'
  )
    .bind(id, target_type, target_id, category ?? null, reason ?? null, contact_email ?? null)
    .run()

  return c.json({ ok: true }, 201)
})

reportsRouter.get('/', async (c) => {
  const isAdmin = await verifyAdminToken(c.req.header('Authorization'), c.env.JWT_SECRET)
  if (!isAdmin) return c.json({ error: 'Unauthorized' }, 401)

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM reports ORDER BY created_at DESC'
  ).all()

  return c.json(results)
})

reportsRouter.put('/:id/resolve', async (c) => {
  const isAdmin = await verifyAdminToken(c.req.header('Authorization'), c.env.JWT_SECRET)
  if (!isAdmin) return c.json({ error: 'Unauthorized' }, 401)

  await c.env.DB.prepare('UPDATE reports SET resolved = 1 WHERE id = ?')
    .bind(c.req.param('id'))
    .run()

  return c.json({ ok: true })
})
