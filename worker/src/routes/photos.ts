import { Hono } from 'hono'
import type { Env } from '../index'
import { verifyAdminToken } from './auth'

export const photosRouter = new Hono<{ Bindings: Env }>()

photosRouter.post('/shops/:id/photos', async (c) => {
  if (!c.env.PHOTOS) {
    return c.json({ error: 'Photo upload is not available yet (R2 not configured)' }, 503)
  }

  const shopId = c.req.param('id')
  const shop = await c.env.DB.prepare('SELECT id FROM shops WHERE id = ? AND is_active = 1')
    .bind(shopId)
    .first()
  if (!shop) return c.json({ error: 'Shop not found' }, 404)

  const formData = await c.req.formData()
  const files = formData.getAll('photos') as unknown as File[]

  if (!files.length || files.length > 3) {
    return c.json({ error: 'Upload 1 to 3 photos' }, 400)
  }

  const maxSize = 5 * 1024 * 1024
  const uploaded: string[] = []

  for (const file of files) {
    if (file.size > maxSize) {
      return c.json({ error: 'Each file must be under 5MB' }, 400)
    }
    const ext = file.name.split('.').pop() ?? 'jpg'
    const key = `photos/${shopId}/${crypto.randomUUID()}.${ext}`
    await c.env.PHOTOS.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    })
    const photoId = crypto.randomUUID()
    const photoUrl = `/photos/${key}`
    await c.env.DB.prepare('INSERT INTO photos (id, shop_id, photo_url) VALUES (?, ?, ?)')
      .bind(photoId, shopId, photoUrl)
      .run()
    uploaded.push(photoUrl)
  }

  return c.json({ uploaded }, 201)
})

photosRouter.get('/photos/:key{.+}', async (c) => {
  if (!c.env.PHOTOS) return c.json({ error: 'Not found' }, 404)
  const key = c.req.param('key')
  const obj = await c.env.PHOTOS.get(key)
  if (!obj) return c.json({ error: 'Not found' }, 404)
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'public, max-age=31536000')
  return new Response(obj.body, { headers })
})

photosRouter.delete('/photos/:id', async (c) => {
  const isAdmin = await verifyAdminToken(c.req.header('Authorization'), c.env.JWT_SECRET)
  if (!isAdmin) return c.json({ error: 'Unauthorized' }, 401)

  const photo = await c.env.DB.prepare('SELECT id, photo_url FROM photos WHERE id = ?')
    .bind(c.req.param('id'))
    .first<{ id: string; photo_url: string }>()
  if (!photo) return c.json({ error: 'Not found' }, 404)

  if (c.env.PHOTOS) {
    const key = photo.photo_url.replace('/photos/', '')
    await c.env.PHOTOS.delete(key)
  }
  await c.env.DB.prepare('DELETE FROM photos WHERE id = ?').bind(photo.id).run()

  return c.json({ ok: true })
})
