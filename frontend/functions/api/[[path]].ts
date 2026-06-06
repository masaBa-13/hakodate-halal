interface Env {
  WORKER_URL: string
}

// /api/* へのリクエストをすべて Worker に転送する
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context
  const workerUrl = env.WORKER_URL
  if (!workerUrl) {
    return new Response('WORKER_URL is not configured', { status: 500 })
  }

  const path = Array.isArray(params.path) ? params.path.join('/') : (params.path ?? '')
  const url = new URL(request.url)
  const target = new URL(`/api/${path}${url.search}`, workerUrl)

  const headers = new Headers(request.headers)
  headers.delete('host')

  const init: RequestInit = {
    method: request.method,
    headers,
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
    // @ts-ignore duplex required for streaming body in Workers runtime
    init.duplex = 'half'
  }

  return fetch(target.toString(), init)
}
