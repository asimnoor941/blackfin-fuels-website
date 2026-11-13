/**
 * Content collections.
 *
 * cities: one Markdown file per city landing page (src/content/cities/<slug>.md).
 * The file name is the URL (/cape-coral/). Frontmatter holds the short pieces
 * of copy; the Markdown body is the long prose under the section heading.
 * Image keys are mapped to imports in src/pages/[city].astro.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const imageKey = z.enum(['cape-coral-canal', 'hose-reel-detail', 'dock-hose-walk', 'fueling-boat-lift', 'driver-hose-truck']);

const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: z.object({
    /** City name as used in links and schema.org. */
    name: z.string(),
    /** Position on the route, north to south. */
    order: z.number(),
    /** The live page's h1. */
    title: z.string(),
    eyebrow: z.string(),
    /** Opening paragraph from the live page's hero. */
    intro: z.string(),
    /** The h2 above the long prose. */
    heading: z.string(),
    /** Closing call-to-action heading; may contain <br />. */
    ctaHeading: z.string(),
    ctaText: z.string(),
    /** Meta description, 140-160 characters. */
    description: z.string().min(140).max(160),
    heroImage: imageKey,
    heroAlt: z.string(),
    heroPosition: z.string().default('50% 50%'),
    bodyImage: imageKey,
    bodyAlt: z.string(),
  }),
});

export const collections = { cities };
