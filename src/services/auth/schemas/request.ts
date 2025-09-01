import { z } from "@hono/zod-openapi";

export const signUpUserSchema = z
  .object({
    email: z.string(),
    name: z.string().min(2).max(100),
    image: z.string().optional(),
    role: z.enum(["user", "admin"]).optional(),
    password: z.string().min(6).max(100),
  })
  .openapi({
    example: {
      email: "example@user.com",
      name: "Bright Eyo",
      role: "user",
      password: "123456",
      image: "http://link-to-img.com",
    },
  });

export const signInUserSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .openapi({
    example: {
      email: "example@user.com",
      password: "123456",
    },
  });

export const updateUserSchema = z
  .object({
    email: z.string().optional(),
    name: z.string().min(2).max(100).optional(),
    image: z.string().optional(),
    password: z.string().min(8).max(100).optional(),
  })
  .openapi({
    example: {
      email: "example@uer.com",
      name: "New Name",
      image: "http://new-img.com",
      password: "newpassword",
    },
  });

export type SignInPayload = z.infer<typeof signInUserSchema>;
export type SignUpPayload = z.infer<typeof signUpUserSchema>;
