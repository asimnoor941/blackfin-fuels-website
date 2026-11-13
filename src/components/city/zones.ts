/**
 * Delivery-zone facts for each city page, keyed by the city slug.
 * Wording comes from the "Delivery by Location" cards on the live Service Areas
 * page (reference/original-site/content/service-areas.md).
 *
 * Punta Gorda has no minimum here on purpose: the live zone card says 100 gal,
 * the live FAQ says 75 gal. Leave it out until the owner confirms.
 */
export interface Zone {
  /** Zone name as it appears on the Service Areas page. */
  name: string;
  schedule: string;
  /** Gallons; omitted when the live site disagrees with itself. */
  minimum?: string;
  text: string;
  tags: string[];
}

const fortMyersCapeCoral: Zone = {
  name: 'Fort Myers & Cape Coral',
  schedule: 'Multiple times / week',
  minimum: '75',
  text: 'Fort Myers’ vast canal network, Cape Coral’s 400+ miles of canals, and Caloosahatchee River access. Lowest minimum in our service area.',
  tags: ['Cape Coral Canals', 'Caloosahatchee', 'Sanibel / Estero'],
};

export const zones: Record<string, Zone> = {
  bradenton: {
    name: 'Bradenton',
    schedule: 'Weekly service',
    minimum: '100',
    text: 'Serving private docks, boat lifts, and marinas along the Manatee River and Bradenton waterfront. We route through Palmetto and Snead Island.',
    tags: ['Manatee River', 'Private Docks'],
  },
  sarasota: {
    name: 'Sarasota',
    schedule: 'Weekly service',
    minimum: '100',
    text: 'Sarasota Bay, Siesta Key, Bird Key, and Longboat Key access. We service private residential docks and HOA marina facilities throughout the area.',
    tags: ['Siesta Key', 'Longboat Key'],
  },
  'punta-gorda': {
    name: 'Punta Gorda',
    schedule: 'Multiple times / week',
    text: 'Peace River access, Punta Gorda Isles canal system, and Charlotte Harbor Yacht Club. Commercial and residential dock delivery.',
    tags: ['PG Isles Canals', 'Peace River'],
  },
  'fort-myers': fortMyersCapeCoral,
  'cape-coral': fortMyersCapeCoral,
};
