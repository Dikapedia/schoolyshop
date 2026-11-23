import { z } from "zod";
import { request } from "./client";

export const userProfileSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  role: z.enum(["admin", "user"]),
  createdAt: z.string(),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

export const updateProfileInputSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  // Backend menerima phone opsional/nullable; kosong berarti tidak diubah.
  phone: z.string().trim().max(20).optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export function getProfile(): Promise<UserProfile> {
  return request("/users/me", { responseSchema: userProfileSchema });
}

export function updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
  const parsed = updateProfileInputSchema.parse(input);
  const body: Record<string, unknown> = {
    name: parsed.name,
    email: parsed.email,
  };
  if (parsed.phone) body.phone = parsed.phone;

  return request("/users/me", {
    method: "PATCH",
    body,
    responseSchema: userProfileSchema,
    statusMessages: { 409: "Email sudah digunakan." },
  });
}
