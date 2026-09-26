import manifest from '@/data/imageManifest.json';

/**
 * Right-sized copies of the photos in public/assets.
 *
 * scripts/optimize-images.mjs writes WebP copies at a few widths and records
 * them in imageManifest.json. These helpers turn an original path such as
 * '/assets/glamping-tent/prosopsi.jpg' into src/srcSet/sizes for an <img>, so
 * the browser downloads roughly what it displays instead of a 1–2 MB camera
 * file. A path missing from the manifest falls back to the original.
 */

type ManifestEntry = { w: number; h: number; base: string; widths: number[] };

const entries = manifest as Record<string, ManifestEntry>;

const variant = (entry: ManifestEntry, width: number) => `${entry.base}-${width}w.webp`;

/** The smallest generated copy at least `width` pixels wide (or the widest one). */
export function imageUrl(src: string, width: number): string {
  const entry = entries[src];
  if (!entry) return src;
  const fit = entry.widths.find((w) => w >= width) ?? entry.widths[entry.widths.length - 1];
  return variant(entry, fit);
}

/**
 * Props for an <img> (or motion.img) that lets the browser pick a width.
 *
 * `sizes` is the rendered width in CSS pixels, as in the HTML attribute.
 * `withOriginal` adds the full-size file as the largest candidate, for the
 * lightbox on large high-density screens.
 */
export function responsiveImage(
  src: string,
  sizes: string,
  { withOriginal = false } = {},
): { src: string; srcSet?: string; sizes?: string; width?: number; height?: number } {
  const entry = entries[src];
  if (!entry) return { src };

  const candidates = entry.widths.map((w) => `${variant(entry, w)} ${w}w`);
  if (withOriginal && entry.w > entry.widths[entry.widths.length - 1]) {
    candidates.push(`${encodeURI(src)} ${entry.w}w`);
  }

  return {
    src: imageUrl(src, 960),
    srcSet: candidates.join(', '),
    sizes,
    width: entry.w,
    height: entry.h,
  };
}

/** Width/height ratio of an original photo, if known. */
export function aspectRatio(src: string): number | undefined {
  const entry = entries[src];
  return entry ? entry.w / entry.h : undefined;
}
