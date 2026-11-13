/**
 * Single source of truth for facts that appear on more than one page.
 * Every value here comes from the live site (see reference/original-site/content).
 * Do not add facts that are not on the live site or confirmed by the owner.
 */

export const site = {
  name: 'Blackfin Fuels',
  legalName: 'Blackfin Fuels',
  tagline: 'Marine Fuel Delivery',
  slogan: 'Fuel Delivered to Your Dock',
  url: 'https://blackfinfuels.com',
  description:
    'Rec 90 ethanol-free marine fuel delivered to your dock, lift or waterfront home on a scheduled route from Bradenton to Cape Coral. No delivery fee.',
  locale: 'en_US',
  owner: 'Captain Mike Wright',
  usdot: '3894355',
} as const;

export const contact = {
  phoneDisplay: '(941) 724-0453',
  phoneHref: 'tel:+19417240453',
  smsHref: 'sms:+19417240453',
  email: 'accounting@blackfinfuels.com',
  emailHref: 'mailto:accounting@blackfinfuels.com',
  serviceLine: 'Fort Myers to Bradenton',
} as const;

export const social = {
  facebook: 'https://www.facebook.com/BlackfinFuels/',
  instagram: 'https://www.instagram.com/blackfin_fuels',
} as const;

/** Where "Order Fuel" goes everywhere on the site. */
export const ORDER_URL = '/free-estimate/';

export const app = {
  name: 'Blackfin Fuels',
  appStoreId: '6813136497',
  playPackage: 'com.blackfinfuels.app',
  appStoreUrl: 'https://apps.apple.com/us/app/blackfin-fuels/id6813136497',
  playUrl: 'https://play.google.com/store/apps/details?id=com.blackfinfuels.app',
  /** On-site smart link: sends phones to the right store, desktops to /app/. Used by QR codes. */
  smartLink: '/get-app/',
  page: '/app/',
  referral: {
    amount: '$25',
    headline: 'Give $25. Get $25.',
    /** The app's own wording of the offer. Keep every promo on the site consistent with this. */
    terms: 'You and your friend each get $25 when they complete their first confirmed delivery.',
    credit: 'fuel credit',
  },
} as const;

export const forms = {
  /** Our own order form posts here (Cloudflare Pages Function in functions/api/order.ts). */
  orderEndpoint: '/api/order',
  /** Smallest exact-amount order, in gallons. Same as the app (useFuelCalc MIN_GALLONS); fill to full has no minimum. */
  minGallons: 75,
} as const;

/**
 * "Before you submit" checklist, word for word from the app's order screen
 * (blackfin-hub lib/order-terms.js defaults). Every item must be ticked.
 */
export const orderTerms = [
  'I agree to pay the full amount due for all fuel delivered by Blackfin Fuels',
  'My boat will be uncovered and ready for fueling when the truck arrives',
  'Any pets outside will be secured while the driver is on my property',
  'If my boat is on a lift, the lift controls will be accessible and unlocked',
] as const;

/** Delivery areas offered in the order form, north to south (from the live Service Areas page). */
export const orderAreas = [
  'Bradenton',
  'Sarasota',
  'Venice',
  'Englewood & Port Charlotte',
  'Punta Gorda',
  'Fort Myers & Cape Coral',
  'Not sure / other',
] as const;

export const analytics = {
  /** Google tag from the live site (Site Kit). Only loaded on the production hostname. */
  googleTagId: 'GT-5MJL794X',
  productionHost: 'blackfinfuels.com',
} as const;

export const reviews = {
  /** Trustindex widget used on the live site. */
  trustindexLoader: 'https://cdn.trustindex.io/loader.js?3330d0b78f84783e2796ba1c331',
} as const;

export interface City {
  slug: string;
  name: string;
}

/** City landing pages. URLs are root-level on the live site (/cape-coral/), keep them. */
export const cities: City[] = [
  { slug: 'bradenton', name: 'Bradenton' },
  { slug: 'sarasota', name: 'Sarasota' },
  { slug: 'punta-gorda', name: 'Punta Gorda' },
  { slug: 'fort-myers', name: 'Fort Myers' },
  { slug: 'cape-coral', name: 'Cape Coral' },
];

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about-us/' },
  {
    label: 'Fuel Delivery',
    href: '/fuel-delivery/',
    children: [
      { label: 'How delivery works', href: '/fuel-delivery/' },
      { label: 'Pricing', href: '/pricing/' },
      { label: 'Make Payment', href: '/make-payment/' },
    ],
  },
  {
    label: 'Service Areas',
    href: '/service-areas/',
    children: [
      { label: 'All service areas', href: '/service-areas/' },
      ...cities.map((c) => ({ label: c.name, href: `/${c.slug}/` })),
    ],
  },
  { label: 'The App', href: '/app/' },
  { label: 'FAQ', href: '/faqs/' },
  { label: 'Contact', href: '/contact-us/' },
];

/** Headline numbers. Wording matches the live site. */
export const facts = {
  hoseReach: '350 ft',
  fuel: 'Rec 90',
  deliveryFee: '$0',
} as const;
