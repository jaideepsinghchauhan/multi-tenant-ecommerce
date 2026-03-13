import z from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().
        min(3, "username must be at least 3 characters long").
        max(20, "username must be at most 20 characters long").
        regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "username can only contain letters, numbers, and hyphens, and must start and end with a letter or number").
        refine((username) => !username.includes("--"), "username cannot contain consecutive hyphens").
        transform((username) => username.toLowerCase())
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})