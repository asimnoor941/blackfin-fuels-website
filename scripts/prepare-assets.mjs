// Builds src/assets (and the icons in public/) from the mirrored originals in
// reference/original-site/media. Safe to re-run: every output is overwritten.
//
//   node scripts/prepare-assets.mjs
//
// The originals are 4-15 MB each, so nothing in reference/ is ever imported by
// the site directly. Astro then generates AVIF/WebP variants from these at build.
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'reference/original-site/media';
const OUT = 'src/assets';
const NAVY = { r: 12, g: 30, b: 47, alpha: 1 }; // #0C1E2F

/** Own photography and licence-free (Pexels) images: [source, output]. */
const photos = [
  ['2026/08/DSC_0206.jpg', 'photos/dock-hose-walk.jpg'],
  ['2026/08/DSC_0213.jpg', 'photos/nozzle-closeup.jpg'],
  ['2026/08/DSC_0248.jpg', 'photos/driver-hose-truck.jpg'],
  ['2026/08/DSC_0312.jpg', 'photos/fueling-boat-lift.jpg'],
  ['2026/08/DSC_0343.jpg', 'photos/truck-door-palms.jpg'],
  ['2026/08/DSC_0355.jpg', 'photos/hose-reel-detail.jpg'],
  ['2026/08/The-Blackfin-Story.jpg', 'photos/crew-three.jpg'],
  ['2026/08/Our-Story.png', 'photos/two-tankers-lot.jpg'],
  ['2026/08/Mike-Photo.jpg', 'team/mike.jpg'],
  ['2026/08/TyrelleHeadshot-1200h.jpg', 'team/tyrelle.jpg'],
  ['2026/08/Jesse.jpg', 'team/jesse.jpg'],
  ['2026/08/pexels-photo-10529268.jpeg', 'places/cape-coral-canal.jpg'],
  ['2026/08/pexels-photo-6179845.jpeg', 'places/punta-gorda.jpg'],
  ['2026/08/pexels-photo-1554663-673h.jpeg', 'places/gulf-aerial.jpg'],
];

/** Transparent truck cut-outs: trimmed to the artwork, saved as WebP with alpha. */
const cutouts = [
  ['2026/08/Untitled-design-2.png', 'trucks/f550-1000.webp'],
  ['2026/08/Untitled-design-1.png', 'trucks/international-2800.webp'],
  ['2026/09/Blackfin-Trucks-1.png', 'trucks/freightliner-2800.webp'],
  ['2026/08/Untitled-design-1-1.webp', 'trucks/two-tankers.webp'],
];

const LOGO = '2026/07/BF-logo-RGB-01-7a391c13-1920w.png';

async function out(rel) {
  const file = path.join(OUT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  return file;
}

async function report(file) {
  const m = await sharp(file).metadata();
  const { size } = await stat(file);
  console.log(`  ${file}  ${m.width}x${m.height}  ${Math.round(size / 1024)} KB`);
}

async function buildPhotos() {
  console.log('photos');
  for (const [src, rel] of photos) {
    const file = await out(rel);
    await sharp(path.join(SRC, src))
      .rotate() // honour EXIF orientation
      .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(file);
    await report(file);
  }
}

async function buildCutouts() {
  console.log('cut-outs');
  for (const [src, rel] of cutouts) {
    const file = await out(rel);
    const trimmed = await sharp(path.join(SRC, src)).ensureAlpha().trim({ threshold: 8 }).toBuffer();
    await sharp(trimmed)
      .resize({ width: 2200, withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(file);
    await report(file);
  }
}

/** Raw RGBA pixels of an image. */
async function raw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

const fromRaw = ({ data, width, height }) => sharp(data, { raw: { width, height, channels: 4 } });
const luminance = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/**
 * Returns a copy with the dark navy artwork turned white and the light blue
 * left alone, for use on dark backgrounds. The logo only has those two inks on
 * a transparent ground, so a luminance ramp between them is enough.
 */
function reverseInk(img) {
  const data = Buffer.from(img.data);
  const lums = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 200) lums.push(luminance(data[i], data[i + 1], data[i + 2]));
  }
  lums.sort((a, b) => a - b);
  const dark = lums[Math.floor(lums.length * 0.1)];
  const light = lums[Math.floor(lums.length * 0.9)];
  const lo = dark + 0.35 * (light - dark);
  const hi = dark + 0.75 * (light - dark);
  for (let i = 0; i < data.length; i += 4) {
    if (!data[i + 3]) continue;
    const l = luminance(data[i], data[i + 1], data[i + 2]);
    const t = Math.max(0, Math.min(1, (hi - l) / (hi - lo)));
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] + (255 - data[i + c]) * t);
  }
  console.log(`  ink luminance: navy ${dark.toFixed(2)}, blue ${light.toFixed(2)}`);
  return { ...img, data };
}

/** Splits the stacked logo into its horizontal bands (mark, wordmark, tagline). */
function findBands({ data, width, height }) {
  const filled = [];
  for (let y = 0; y < height; y++) {
    let max = 0;
    for (let x = 0; x < width; x++) max = Math.max(max, data[(y * width + x) * 4 + 3]);
    filled.push(max > 24);
  }
  const bands = [];
  let start = -1;
  let gap = 0;
  for (let y = 0; y <= height; y++) {
    const on = y < height && filled[y];
    if (on) {
      if (start < 0) start = y;
      gap = 0;
    } else if (start >= 0) {
      gap++;
      if (gap > 5 || y === height) {
        bands.push({ top: start, height: y - gap - start + 1 });
        start = -1;
        gap = 0;
      }
    }
  }
  return bands;
}

async function buildBrand() {
  console.log('brand');
  const full = await raw(await sharp(path.join(SRC, LOGO)).ensureAlpha().trim({ threshold: 8 }).toBuffer());
  const reversed = reverseInk(full);
  const bands = findBands(full);
  console.log(`  bands: ${bands.map((b) => `${b.top}+${b.height}`).join(', ')}`);

  const variants = [
    ['', full],
    ['-reversed', reversed],
  ];
  const names = bands.length === 3 ? ['mark', 'wordmark', 'tagline'] : [];
  if (!names.length) console.warn('  expected 3 bands; only the full logo will be written');

  for (const [suffix, img] of variants) {
    const file = await out(`brand/logo-full${suffix}.png`);
    await fromRaw(img).png({ compressionLevel: 9 }).toFile(file);
    await report(file);
    for (let i = 0; i < names.length; i++) {
      const band = await fromRaw(img)
        .extract({ left: 0, top: bands[i].top, width: img.width, height: bands[i].height })
        .png()
        .toBuffer();
      const bandFile = await out(`brand/${names[i]}${suffix}.png`);
      await sharp(band).trim({ threshold: 8 }).png({ compressionLevel: 9 }).toFile(bandFile);
      await report(bandFile);
    }
  }

  // Icons: the reversed mark centred on brand navy.
  if (names.length) {
    const mark = path.join(OUT, 'brand/mark-reversed.png');
    for (const [size, name] of [
      [32, 'favicon-32.png'],
      [180, 'apple-touch-icon.png'],
      [192, 'icon-192.png'],
      [512, 'icon-512.png'],
    ]) {
      const inner = Math.round(size * 0.74);
      const glyph = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
      await mkdir('public', { recursive: true });
      await sharp({ create: { width: size, height: size, channels: 4, background: NAVY } })
        .composite([{ input: glyph, gravity: 'centre' }])
        .png({ compressionLevel: 9 })
        .toFile(path.join('public', name));
      console.log(`  public/${name}`);
    }
  }
}

/** Default social sharing image: a real delivery photo under a navy wash, logo centred. */
async function buildSocialImage() {
  console.log('social image');
  const W = 1200;
  const H = 630;
  const photo = await sharp(path.join(OUT, 'photos/dock-hose-walk.jpg'))
    .resize({ width: W, height: H, fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.75, saturation: 0.8 })
    .toBuffer();
  const wash = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071119" stop-opacity=".78"/><stop offset="1" stop-color="#0C1E2F" stop-opacity=".9"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const logo = await sharp(path.join(OUT, 'brand/logo-full-reversed.png'))
    .resize({ height: 400, fit: 'inside' })
    .toBuffer();
  await sharp(photo)
    .composite([{ input: wash }, { input: logo, gravity: 'centre' }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile('public/og-default.jpg');
  console.log('  public/og-default.jpg');
}

await buildPhotos();
await buildCutouts();
await buildBrand();
await buildSocialImage();
console.log('done');
