import path from "node:path";

export type UploadKind = "images" | "audio";

interface FileRule {
  kind: UploadKind;
  maxBytes: number;
  matches: (b: Buffer) => boolean;
}

const MB = 1024 * 1024;
const ascii = (b: Buffer, start: number, text: string) => b.toString("latin1", start, start + text.length) === text;

const RULES: Record<string, FileRule> = {
  ".jpg": { kind: "images", maxBytes: 5 * MB, matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  ".png": { kind: "images", maxBytes: 5 * MB, matches: (b) => b.readUInt32BE(0) === 0x89504e47 },
  ".gif": { kind: "images", maxBytes: 5 * MB, matches: (b) => ascii(b, 0, "GIF8") },
  ".webp": { kind: "images", maxBytes: 5 * MB, matches: (b) => ascii(b, 0, "RIFF") && ascii(b, 8, "WEBP") },
  ".mp3": {
    kind: "audio",
    maxBytes: 25 * MB,
    matches: (b) => ascii(b, 0, "ID3") || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0),
  },
  ".wav": { kind: "audio", maxBytes: 25 * MB, matches: (b) => ascii(b, 0, "RIFF") && ascii(b, 8, "WAVE") },
  ".ogg": { kind: "audio", maxBytes: 25 * MB, matches: (b) => ascii(b, 0, "OggS") },
  ".m4a": { kind: "audio", maxBytes: 25 * MB, matches: (b) => ascii(b, 4, "ftyp") },
};
RULES[".jpeg"] = RULES[".jpg"];

export const ACCEPTED_EXTENSIONS = Object.keys(RULES);

export type UploadCheck = { ok: true; kind: UploadKind; ext: string } | { ok: false; error: string };

/** Validates extension, size, and that the bytes really are that file type. */
export function checkUpload(fileName: string, size: number, head: Buffer): UploadCheck {
  const ext = path.extname(fileName).toLowerCase();
  const rule = RULES[ext];
  if (!rule) {
    return { ok: false, error: `Tipe berkas tidak didukung. Gunakan: ${ACCEPTED_EXTENSIONS.join(", ")}` };
  }
  if (size === 0) return { ok: false, error: "Berkas kosong." };
  if (size > rule.maxBytes) {
    return { ok: false, error: `Ukuran berkas maksimal ${rule.maxBytes / MB} MB.` };
  }
  if (head.length < 12 || !rule.matches(head)) {
    return { ok: false, error: "Isi berkas tidak sesuai dengan ekstensinya." };
  }
  return { ok: true, kind: rule.kind, ext: ext === ".jpeg" ? ".jpg" : ext };
}

/** Local upload URLs referenced by a piece of content (cover, inline images, audio...). */
export function extractUploadUrls(...values: (string | null | undefined)[]): string[] {
  const found = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    for (const match of value.matchAll(/\/uploads\/(?:images|audio)\/[A-Za-z0-9_-][A-Za-z0-9_.-]*/g)) {
      found.add(match[0]);
    }
  }
  return [...found];
}
