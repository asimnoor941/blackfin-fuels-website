/**
 * GET /api/price returns today's Rec 90 price for the website, read live from the
 * same CRM / app backend the mobile app uses. Cached at Cloudflare's edge for
 * a few minutes so the CRM is not called on every page view.
 *
 * Environment variables (Cloudflare Pages → Settings → Variables):
 *   CRM_PRICE_URL        required. URL that returns the current price as JSON.
 *   CRM_PRICE_FIELD      optional. Dot path to the per-gallon price in that JSON, e.g. "data.rec90.price".
 *                        Without it, the first of price / pricePerGallon / rec90 / rec90Price is used.
 *   CRM_PRICE_UPDATED_FIELD optional. Dot path to the "last updated" timestamp.
 *   CRM_AUTH_HEADER / CRM_AUTH_VALUE  optional. Same key as the order function, if the CRM needs one.
 *   PRICE_CACHE_SECONDS  optional. Defaults to 300.
 *
 * Response: { ok: true, price: 5.70, currency: "USD", unit: "gal", updatedAt: "..." }
 * or { ok: false } when the price is not available (the site then hides the price
 * and says it will be confirmed by text).
 */

interface Env {
  CRM_PRICE_URL?: string;
  CRM_PRICE_FIELD?: string;
  CRM_PRICE_UPDATED_FIELD?: string;
  CRM_AUTH_HEADER?: string;
  CRM_AUTH_VALUE?: string;
  PRICE_CACHE_SECONDS?: string;
}

interface Context {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
}

const pick = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((value, key) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined), obj);

function readPrice(data: unknown, field?: string): number | null {
  const candidates = field ? [pick(data, field)] : ['price', 'pricePerGallon', 'rec90', 'rec90Price', 'data.price'].map((p) => pick(data, p));
  for (const value of candidates) {
    const n = typeof value === 'string' ? Number(value.replace(/[^0-9.]/g, '')) : Number(value);
    // A sane per-gallon marine fuel price; anything else is treated as bad data.
    if (Number.isFinite(n) && n > 1 && n < 20) return Math.round(n * 100) / 100;
  }
  return null;
}

const reply = (body: unknown, seconds: number) =>
  new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=60, s-maxage=${seconds}`,
    },
  });

export async function onRequestGet({ request, env, waitUntil }: Context): Promise<Response> {
  const seconds = Number(env.PRICE_CACHE_SECONDS ?? 300) || 300;
  if (!env.CRM_PRICE_URL) return reply({ ok: false, reason: 'not-configured' }, 60);

  const cache = (globalThis as unknown as { caches?: { default: Cache } }).caches?.default;
  const cacheKey = new Request(new URL('/api/price', request.url).toString());
  const cached = await cache?.match(cacheKey);
  if (cached) return cached;

  const headers: Record<string, string> = { accept: 'application/json' };
  if (env.CRM_AUTH_HEADER && env.CRM_AUTH_VALUE) headers[env.CRM_AUTH_HEADER] = env.CRM_AUTH_VALUE;

  try {
    const res = await fetch(env.CRM_PRICE_URL, { headers });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const price = readPrice(data, env.CRM_PRICE_FIELD);
    if (price === null) throw new Error('no usable price in CRM response');
    const updated = env.CRM_PRICE_UPDATED_FIELD ? pick(data, env.CRM_PRICE_UPDATED_FIELD) : undefined;
    const response = reply(
      { ok: true, price, currency: 'USD', unit: 'gal', updatedAt: typeof updated === 'string' ? updated : new Date().toISOString() },
      seconds,
    );
    if (cache) waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    console.error('price unavailable', err);
    return reply({ ok: false, reason: 'unavailable' }, 60);
  }
}
