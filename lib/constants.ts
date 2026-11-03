export const SITE_NAME = "Chronica";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Icons selectable for a category (rendered by CategoryIcon). */
export const CATEGORY_ICONS = [
  "BookOpen",
  "Globe",
  "PenTool",
  "Compass",
  "Sparkles",
  "Users",
  "MessageSquare",
  "Music",
  "Film",
] as const;
export type CategoryIconName = (typeof CATEGORY_ICONS)[number];

export const QUOTES = [
  { text: "Those who cannot remember the past are condemned to repeat it.", author: "George Santayana" },
  { text: "Man is born free, and everywhere he is in chains.", author: "Jean-Jacques Rousseau" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "The library is an archive of the desires of the human soul.", author: "Jorge Luis Borges" },
  { text: "Politics is the art of the possible, the attainable.", author: "Otto von Bismarck" },
];

export type Quote = (typeof QUOTES)[number];

/** Rotates once per (UTC) day. */
export function getDailyQuote(date = new Date()): Quote {
  const day = Math.floor(date.getTime() / 86_400_000);
  return QUOTES[day % QUOTES.length];
}
