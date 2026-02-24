import { cache } from 'react'
import { initTRPC } from '@trpc/server';

import { getPayload } from 'payload';
import configPromise from "@payload-config";

export const createTRPCContext = cache(async () => {

    return { userId: 'user_123' }
})

const t = initTRPC.create({
    // createContext is the function that will be called for each request to create the context
})

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
    const payload = await getPayload({
        config: configPromise,
    });

    return next({
        ctx: {
            db: payload,
        },
    });
});