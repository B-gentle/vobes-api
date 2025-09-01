import { z } from "@hono/zod-openapi";

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  createdAt: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), {
      message: "Invalid datetime",
    }),
});

export const authRes = z.object({
  user: userResponseSchema,
  token: z.string(),
});

export type UserRes = z.infer<typeof userResponseSchema>;
