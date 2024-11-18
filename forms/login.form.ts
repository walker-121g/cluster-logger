import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((password) => {
      return (
        password.match(/[a-z]/) &&
        password.match(/[A-Z]/) &&
        password.match(/[0-9]/)
      );
    }, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
