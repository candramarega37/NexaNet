import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

export const materialFilterSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(60).optional(),
  difficulty: z.enum(["Dasar", "Menengah", "Lanjutan"]).optional(),
});
