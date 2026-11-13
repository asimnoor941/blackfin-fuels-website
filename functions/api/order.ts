/**
 * POST /api/order receives the website's fuel order form and forwards it to
 * the business's CRM. Runs as a Cloudflare Pages Function (this file's path is
 * the URL). The CRM address and key live in Cloudflare environment settings,
 * never in the site's code.
 *
 * Environment variables (Cloudflare dashboard → Pages project → Settings → Variables):
 *   CRM_WEBHOOK_URL      required. The CRM endpoint that accepts a new order / lead (HTTPS).
 *   CRM_AUTH_HEADER      optional. Header name for the CRM key, e.g. "Authorization" or "X-Api-Key".
 *   CRM_AUTH_VALUE       optional. Its value, e.g. "Bearer abc123". Store as an encrypted secret.
 *   ALLOWED_ORIGIN       optional. Defaults to https://blackfinfuels.com.
 *
 * The hub receives JSON shaped like the app's fuel request (blackfin-hub
 * createBooking input), with source "web":
 *   { source: "web", type: "booking_request", submittedAt, fuelType: "rec90",
 *     name, firstName, lastName, phone (10 digits), email, address, area,
 *     boat: { type, tanks, tankGallons, name },
 *     fillType: "fill" | "exact", gallons (exact amount, fill guess, or null),
 *     dateType: "asap" | "before" | "on", requestedDate (YYYY-MM-DD or ""), okSooner,
 *     notes, termsAck: { items, at }, page, placement, quotedPrice, quotedAt, estimatedTotal }
 * If the hub expects different field names, map them in toCrm() below.
 */

interface Env {
  CRM_WEBHOOK_URL?: string;
  CRM_AUTH_HEADER?: string;
  CRM_AUTH_VALUE?: string;
  ALLOWED_ORIGIN?: string;
}

interface Context {
  request: Request;
  env: Env;
}

interface Order {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  boat: { type: string; tanks: number; tankGallons: number | null; name: string };
  fillType: 'fill' | 'exact';
  gallons: number | null;
  dateType: 'asap' | 'before' | 'on';
  requestedDate: string;
  okSooner: boolean;
  notes: string;
  termsAck: { items: string[]; at: string };
  page: string;
  placement: string;
  /** Per-gallon price the visitor saw when booking (from /api/price), if any. */
  quotedPrice: number | null;
  quotedAt: string;
}

const AREAS = new Set([
  'Bradenton',
  'Sarasota',
  'Venice',
  'Englewood & Port Charlotte',
  'Punta Gorda',
  'Fort Myers & Cape Coral',
  'Not sure / other',
]);
const MIN_GALLONS = 75;
const MAX_GALLONS = 9999;
const TERMS_COUNT = 4;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const whole = (value: unknown) => {
  const n = Math.round(Number(value));
  return value == null || value === '' || !Number.isFinite(n) || n <= 0 ? null : n;
};

function clean(input: Record<string, unknown>): { order?: Order; error?: string } {
  const boat = (input.boat ?? {}) as Record<string, unknown>;
  const terms = (input.termsAck ?? {}) as Record<string, unknown>;
  const name = clip(input.name, 120);
  const [first = '', ...rest] = name.split(/\s+/);
  const order: Order = {
    name,
    firstName: clip(input.firstName, 60) || first,
    lastName: clip(input.lastName, 60) || rest.join(' '),
    phone: clip(input.phone, 30).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, ''),
    email: clip(input.email, 160),
    address: clip(input.address, 200),
    area: clip(input.area, 60),
    boat: {
      type: ['Boat', 'Jet ski', 'Other'].includes(clip(boat.type, 20)) ? clip(boat.type, 20) : 'Boat',
      tanks: Math.min(20, whole(boat.tanks) ?? 1),
      tankGallons: whole(boat.tankGallons),
      name: clip(boat.name, 120),
    },
    fillType: input.fillType === 'exact' ? 'exact' : 'fill',
    gallons: whole(input.gallons),
    dateType: input.dateType === 'before' || input.dateType === 'on' ? input.dateType : 'asap',
    requestedDate: clip(input.requestedDate, 10),
    okSooner: input.okSooner === true,
    notes: clip(input.notes, 1000),
    termsAck: {
      items: Array.isArray(terms.items) ? terms.items.slice(0, 10).map((t) => clip(t, 200)) : [],
      at: clip(terms.at, 40),
    },
    page: clip(input.page, 200),
    placement: clip(input.placement, 40),
    quotedPrice: Number.isFinite(Number(input.quotedPrice)) && Number(input.quotedPrice) > 0 ? Number(input.quotedPrice) : null,
    quotedAt: clip(input.quotedAt, 40),
  };

  if (input.fillType !== 'fill' && input.fillType !== 'exact') return { error: 'fillType' };
  if (order.gallons && order.gallons > MAX_GALLONS) return { error: 'gallons' };
  if (order.fillType === 'exact' && (!order.gallons || order.gallons < MIN_GALLONS)) return { error: 'gallons' };
  if (order.dateType === 'asap') order.requestedDate = '';
  else {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(order.requestedDate)) return { error: 'date' };
    const day = new Date(`${order.requestedDate}T12:00:00Z`).getUTCDay();
    if (day === 0 || day === 6) return { error: 'date' };
  }
  if (order.name.length < 2) return { error: 'name' };
  if (order.phone.length !== 10) return { error: 'phone' };
  if (order.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) return { error: 'email' };
  if (order.address.length < 5) return { error: 'address' };
  if (!AREAS.has(order.area)) return { error: 'area' };
  if (order.termsAck.items.length < TERMS_COUNT) return { error: 'terms' };
  return { order };
}

/** The payload the CRM receives. Rename keys here if the CRM needs other names. */
function toCrm(order: Order) {
  return {
    source: 'web',
    type: 'booking_request',
    submittedAt: new Date().toISOString(),
    fuelType: 'rec90',
    ...order,
    estimatedTotal: order.quotedPrice && order.gallons ? Math.round(order.quotedPrice * order.gallons * 100) / 100 : null,
  };
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const origin = request.headers.get('origin');
  const allowed = env.ALLOWED_ORIGIN ?? 'https://blackfinfuels.com';
  if (origin && origin !== allowed && origin !== allowed.replace('://', '://www.')) return json({ ok: false }, 403);

  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  // Spam: the hidden field was filled, or the form was sent faster than a person can type.
  if (clip(input.company, 100) || Number(input.elapsedMs ?? 0) < 2500) return json({ ok: true });

  const { order, error } = clean(input);
  if (!order) return json({ ok: false, error }, 422);

  if (!env.CRM_WEBHOOK_URL) {
    console.error('CRM_WEBHOOK_URL is not set; order not forwarded', order.name, order.area);
    return json({ ok: false, error: 'not-configured' }, 503);
  }

  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (env.CRM_AUTH_HEADER && env.CRM_AUTH_VALUE) headers[env.CRM_AUTH_HEADER] = env.CRM_AUTH_VALUE;

  try {
    const response = await fetch(env.CRM_WEBHOOK_URL, { method: 'POST', headers, body: JSON.stringify(toCrm(order)) });
    if (!response.ok) {
      console.error('CRM rejected order', response.status, await response.text().catch(() => ''));
      return json({ ok: false, error: 'crm' }, 502);
    }
  } catch (err) {
    console.error('CRM unreachable', err);
    return json({ ok: false, error: 'crm' }, 502);
  }

  return json({ ok: true });
}

export function onRequest(): Response {
  return json({ ok: false, error: 'method' }, 405);
}
