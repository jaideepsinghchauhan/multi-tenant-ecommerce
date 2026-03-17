import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init"

import { headers as getHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";
import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({

    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();

        const session = await ctx.db.auth({ headers });

        return session;
    }),
    register: baseProcedure.input(
        registerSchema,
    ).mutation(async ({ input, ctx }) => {
        const existingData = await ctx.db.find({
            collection: "users",
            limit: 1,
            where: {
                username: { equals: input.username },
            },
        });
        const existingUsername = existingData?.docs?.[0]
        if (existingUsername) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Username already exists",
            })
        }

        const user = await ctx.db.create({
            collection: "users",
            data: {
                email: input.email,
                username: input.username,
                password: input.password, // this will hashed and not stored as plain text
            },
        });

        // once user is created, we can log them in by creating a session and setting the cookie
        const data = await ctx.db.login({
            collection: "users",
            data: {
                email: input.email,
                password: input.password,
            },
        });

        if (!data.token) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid email or password",
            })
        }

        await generateAuthCookie({
            prefix: ctx.db.config.cookiePrefix,
            value: data.token
        });

        return user;
    }),
    login: baseProcedure.input(
        loginSchema).mutation(async ({ input, ctx }) => {
            const data = await ctx.db.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password,
                },
            });

            if (!data.token) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password",
                })
            }

            await generateAuthCookie({
                prefix: ctx.db.config.cookiePrefix,
                value: data.token
            });

            return data;
        })

}) 