// Converts a name like "Rose Gold Centerpiece" into "rose-gold-centerpiece"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word characters
    .replace(/[\s_-]+/g, "-") // collapse spaces/underscores into a single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}