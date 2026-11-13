/**
 * Today's Rec 90 price, loaded once per page from /api/price (which reads it
 * live from the CRM). Any element with data-price shows it:
 *
 *   <span data-price>…</span>           → "$5.70"
 *   <span data-price-updated>…</span>   → "Updated today, 9:14 AM"
 *   <div data-price-block hidden>…</div> → shown only when a price is available
 *   <div data-price-missing>…</div>      → shown only when it is not
 *
 * In local development and in the demo build (npm run build:demo) there is no
 * CRM, so a clearly labelled sample price is used.
 */
export const DEMO = import.meta.env.DEV || import.meta.env.PUBLIC_DEMO === '1';

export interface Price {
  price: number;
  updatedAt: string;
  sample?: boolean;
}

let pending: Promise<Price | null> | null = null;

export function getPrice(): Promise<Price | null> {
  if (pending) return pending;
  pending = (async () => {
    if (DEMO) return { price: 5.7, updatedAt: new Date().toISOString(), sample: true };
    try {
      const res = await fetch('/api/price', { headers: { accept: 'application/json' } });
      if (!res.ok) return null;
      const data = (await res.json()) as { ok: boolean; price?: number; updatedAt?: string };
      return data.ok && typeof data.price === 'number' ? { price: data.price, updatedAt: data.updatedAt ?? '' } : null;
    } catch {
      return null;
    }
  })();
  return pending;
}

export const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function updatedLabel(iso: string, sample?: boolean): string {
  if (sample) return 'Sample price (preview)';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Today’s price';
  const sameDay = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return sameDay ? `Updated today, ${time}` : `Updated ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export async function paintPrices(): Promise<Price | null> {
  const price = await getPrice();
  document.querySelectorAll<HTMLElement>('[data-price-block]').forEach((el) => (el.hidden = !price));
  document.querySelectorAll<HTMLElement>('[data-price-missing]').forEach((el) => (el.hidden = Boolean(price)));
  if (!price) return null;
  document.querySelectorAll<HTMLElement>('[data-price]').forEach((el) => (el.textContent = money(price.price)));
  document.querySelectorAll<HTMLElement>('[data-price-updated]').forEach((el) => (el.textContent = updatedLabel(price.updatedAt, price.sample)));
  return price;
}
