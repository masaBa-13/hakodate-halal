import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { shopsRouter } from './routes/shops'
import { photosRouter } from './routes/photos'
import { reportsRouter } from './routes/reports'
import { authRouter } from './routes/auth'

export type Env = {
  DB: D1Database
  PHOTOS?: R2Bucket
  PHOTOS_PUBLIC_URL?: string
  JWT_SECRET: string
  CORS_ORIGIN: string
  GEMINI_API_KEY?: string
  RATE_LIMIT: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGIN || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
  return corsMiddleware(c, next)
})

app.route('/api/auth', authRouter)
app.route('/api/shops', shopsRouter)
app.route('/api', photosRouter)
app.route('/api/reports', reportsRouter)

app.get('/', (c) => c.json({ ok: true, service: 'hakodate-halal-map-api' }))

export default app
