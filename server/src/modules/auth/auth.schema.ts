import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const updateProfileSchema = z.object({
    email: z.string().trim().email(),
    firstName: z.union([z.string().trim().max(50), z.null()]).optional(),
    lastName: z.union([z.string().trim().max(50), z.null()]).optional(),
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1).max(100),
    newPassword: z.string().min(6).max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
