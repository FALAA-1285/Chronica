// Fixed locale + UTC so server and client render the same string (no hydration mismatch).
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(date: string | Date): string {
  return dateFormatter.format(typeof date === "string" ? new Date(date) : date);
}

/** ~200 words per minute, minimum 1 minute. */
export function estimateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
