import { Hono } from 'hono'
import type { Env } from '../index'
import { verifyOwnerToken } from './auth'
import { fillMissingComments } from '../utils/translate'
import { checkRateLimit, rateLimitResponse } from '../middleware/rateLimit'

export const shopsRouter = new Hono<{ Bindings: Env }>()

shopsRouter.get('/', async (c) => {
  const { halal_level, category, prayer_space } = c.req.query()

  let query = 'SELECT * FROM shops WHERE is_active = 1'
  const bindings: (string | number)[] = []

  if (halal_level) {
    query += ' AND halal_level = ?'
    bindings.push(halal_level)
  }
  if (category) {
    query += ' AND category = ?'
    bindings.push(category)
  }
  if (prayer_space === '1') {
    query += ' AND has_prayer_space = 1'
  }

  query += ' ORDER BY created_at DESC'

  const { results } = await c.env.DB.prepare(query).bind(...bindings).all()
  return c.json(results)
})

shopsRouter.get('/:id', async (c) => {
  const shop = await c.env.DB.prepare(
    `SELECT s.*, (SELECT json_group_array(json_object('id', p.id, 'photo_url', p.photo_url))
     FROM photos p WHERE p.shop_id = s.id) as photos
     FROM shops s WHERE s.id = ? AND s.is_active = 1`
  )
    .bind(c.req.param('id'))
    .first()

  if (!shop) return c.json({ error: 'Not found' }, 404)
  return c.json(shop)
})

shopsRouter.post('/', async (c) => {
  const ip = c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? 'unknown'
  const rl = await checkRateLimit(c.env.RATE_LIMIT, ip, {
    windowMs: 60 * 60 * 1000, // 1時間
    max: 50,                   // 50件まで
    keyPrefix: 'shop_register',
  })
  if (!rl.allowed) return rateLimitResponse(rl.resetAt)

  const body = await c.req.json<{
    name: string
    address: string
    lat: number
    lng: number
    category: string
    halal_level: string
    has_prayer_space?: number
    opening_hours?: string
    comment_ja?: string
    comment_en?: string
    comment_ms?: string
    comment_id?: string
    comment_bn?: string
    // 登録者情報
    submitter_type: 'owner' | 'user'
    submitter_name?: string
    submitter_email?: string
    submitter_phone?: string
    submitter_nickname?: string
    place_id?: string
    website_url?: string
    instagram_url?: string
    facebook_url?: string
    contains_pork?: number | null
    contains_alcohol?: number | null
    uses_halal_meat?: number | null
    contains_beef?: number | null
    contains_chicken?: number | null
    contains_seafood?: number | null
    contains_dairy?: number | null
    contains_egg?: number | null
    contains_gluten?: number | null
    is_vegetarian?: number | null
    is_vegan?: number | null
    menu_items?: string | null
    submitter_rating?: number | null
  }>()

  if (!body.name || !body.address || body.lat == null || body.lng == null) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  if (!body.submitter_type) {
    return c.json({ error: 'submitter_type is required' }, 400)
  }

  // オーナーの場合はJWTがあればowner_idを紐付け（任意）
  const authHeader = c.req.header('Authorization')
  const ownerId = authHeader ? await verifyOwnerToken(authHeader, c.env.JWT_SECRET) : null

  // コメントをGeminiで5言語補完（APIキーがある場合のみ、失敗しても続行）
  let comments = {
    ja: body.comment_ja,
    en: body.comment_en,
    ms: body.comment_ms,
    id: body.comment_id,
    bn: body.comment_bn,
  }
  if (c.env.GEMINI_API_KEY) {
    comments = await fillMissingComments(comments, c.env.GEMINI_API_KEY) as typeof comments
  }

  const id = crypto.randomUUID()
  await c.env.DB.prepare(
    `INSERT INTO shops (
      id, owner_id, name, address, lat, lng, category, halal_level,
      has_prayer_space, opening_hours,
      comment_ja, comment_en, comment_ms, comment_id, comment_bn,
      submitter_type, submitter_name, submitter_email, submitter_phone, submitter_nickname,
      place_id, website_url, instagram_url, facebook_url,
      contains_pork, contains_alcohol, uses_halal_meat,
      contains_beef, contains_chicken, contains_seafood,
      contains_dairy, contains_egg, contains_gluten,
      is_vegetarian, is_vegan, menu_items, submitter_rating
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id, ownerId ?? null, body.name, body.address, body.lat, body.lng,
      body.category, body.halal_level,
      body.has_prayer_space ?? 0,
      body.opening_hours ?? null,
      comments.ja ?? null, comments.en ?? null,
      comments.ms ?? null, comments.id ?? null, comments.bn ?? null,
      body.submitter_type,
      body.submitter_name ?? null,
      body.submitter_email ?? null,
      body.submitter_phone ?? null,
      body.submitter_nickname ?? null,
      body.place_id ?? null,
      body.website_url ?? null,
      body.instagram_url ?? null,
      body.facebook_url ?? null,
      body.contains_pork ?? null,
      body.contains_alcohol ?? null,
      body.uses_halal_meat ?? null,
      body.contains_beef ?? null,
      body.contains_chicken ?? null,
      body.contains_seafood ?? null,
      body.contains_dairy ?? null,
      body.contains_egg ?? null,
      body.contains_gluten ?? null,
      body.is_vegetarian ?? null,
      body.is_vegan ?? null,
      body.menu_items ?? null,
      body.submitter_rating ?? null
    )
    .run()

  return c.json({ id }, 201)
})

shopsRouter.put('/:id', async (c) => {
  const ownerId = await verifyOwnerToken(c.req.header('Authorization'), c.env.JWT_SECRET)
  if (!ownerId) return c.json({ error: 'Unauthorized' }, 401)

  const shop = await c.env.DB.prepare(
    'SELECT id FROM shops WHERE id = ? AND owner_id = ?'
  )
    .bind(c.req.param('id'), ownerId)
    .first()
  if (!shop) return c.json({ error: 'Not found or forbidden' }, 404)

  const body = await c.req.json<Record<string, unknown>>()
  const allowed = [
    'name', 'address', 'lat', 'lng', 'category', 'halal_level',
    'has_prayer_space', 'opening_hours',
    'comment_ja', 'comment_en', 'comment_ms', 'comment_id', 'comment_bn',
    'main_photo_url',
  ]
  const sets: string[] = []
  const vals: unknown[] = []
  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`)
      vals.push(body[key])
    }
  }
  if (sets.length === 0) return c.json({ error: 'No fields to update' }, 400)

  vals.push(c.req.param('id'))
  await c.env.DB.prepare(`UPDATE shops SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...vals)
    .run()

  return c.json({ ok: true })
})

shopsRouter.delete('/:id', async (c) => {
  const ownerId = await verifyOwnerToken(c.req.header('Authorization'), c.env.JWT_SECRET)
  if (!ownerId) return c.json({ error: 'Unauthorized' }, 401)

  const shop = await c.env.DB.prepare(
    'SELECT id FROM shops WHERE id = ? AND owner_id = ?'
  )
    .bind(c.req.param('id'), ownerId)
    .first()
  if (!shop) return c.json({ error: 'Not found or forbidden' }, 404)

  await c.env.DB.prepare('UPDATE shops SET is_active = 0 WHERE id = ?')
    .bind(c.req.param('id'))
    .run()

  return c.json({ ok: true })
})
