import { createTRPCRouter } from '../init';

import { authRouter } from '@/modules/auth/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    categories: categoriesRouter
});

// This export is vital for the frontend to get type safety!
export type AppRouter = typeof appRouter;