import { z } from "zod";
import { CATEGORY_ICONS } from "@/lib/constants";
import { isValidMediaUrl } from "@/lib/media";

// MySQL VARCHAR columns created by Prisma are 191 characters.
const varchar = (label: string) =>
  z.string().trim().min(1, `${label} wajib diisi`).max(191, `${label} maksimal 191 karakter`);

const slug = z
  .string()
  .trim()
  .min(1, "Slug wajib diisi")
  .max(191)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung");

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna harus berformat #RRGGBB");

const mediaUrl = z
  .string()
  .trim()
  .max(191, "URL maksimal 191 karakter")
  .refine(isValidMediaUrl, "URL harus https:// atau berkas hasil unggahan");

const optionalMediaUrl = z.union([z.literal(""), mediaUrl]).optional();

const handle = z
  .string()
  .trim()
  .max(100)
  .regex(/^[A-Za-z0-9_.-]*$/, "Isi username saja, tanpa URL")
  .optional();

export const postInput = z.object({
  title: varchar("Judul"),
  slug,
  excerpt: z.string().trim().max(1000).default(""),
  content: z.string().min(1, "Konten wajib diisi").max(16_000_000),
  coverImage: optionalMediaUrl,
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  tags: z.array(z.string().min(1)).max(50).default([]),
  readingTime: z.coerce.number().int().min(0).max(600).optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const categoryInput = z.object({
  name: varchar("Nama"),
  slug,
  description: z.string().trim().max(1000).default(""),
  color: hexColor.default("#0A0A0A"),
  bgColor: hexColor.default("#FFE500"),
  icon: z.enum(CATEGORY_ICONS).default("BookOpen"),
});

export const tagInput = z.object({
  name: varchar("Nama"),
  slug,
  color: hexColor.default("#7B2FBE"),
});

export const trackInput = z.object({
  title: varchar("Judul"),
  artist: varchar("Artis"),
  audioUrl: mediaUrl,
  coverUrl: optionalMediaUrl,
  duration: z.coerce.number().int().min(1).max(24 * 3600).nullable().optional(),
});

export const authorInput = z
  .object({
    name: varchar("Nama"),
    email: z.email("Email tidak valid").max(191),
    avatar: mediaUrl,
    bio: z.string().trim().max(5000).default(""),
    twitter: handle,
    github: handle,
    linkedin: handle,
    currentPassword: z.string().optional(),
    newPassword: z.union([z.literal(""), z.string().min(8, "Password baru minimal 8 karakter").max(200)]).optional(),
  })
  .refine((v) => !v.newPassword || !!v.currentPassword, {
    message: "Masukkan password saat ini untuk mengganti password",
    path: ["currentPassword"],
  });

export const loginInput = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi").max(200),
});

export const contactInput = z.object({
  name: varchar("Nama"),
  email: z.email("Email tidak valid").max(191),
  subject: z.string().trim().max(191).optional(),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(5000),
  /** Honeypot: humans never fill this hidden field. */
  website: z.string().max(500).optional(),
});

export const contactUpdateInput = z.object({ read: z.boolean() });
