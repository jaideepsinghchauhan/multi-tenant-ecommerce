import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init"

import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

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

        const cookies = await getCookies();
        cookies.set({
            name: AUTH_COOKIE,
            value: data.token,
            httpOnly: true,
            path: "/",  // ensure cross domain cookie sharing works
            // sameSite: 'none',
            // domain: "funroad.com", // set to your domain
        })

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

            const cookies = await getCookies();
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                path: "/",  // ensure cross domain cookie sharing works
                // sameSite: 'none',
                // domain: "funroad.com", // set to your domain
            })
            return data;
        }),
    logout: baseProcedure.mutation(async ({ ctx }) => {
        const cookies = await getCookies();
        cookies.delete(AUTH_COOKIE);
    })

}) 