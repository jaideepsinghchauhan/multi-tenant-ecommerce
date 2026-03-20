import { createTRPCRouter } from '../init';

import { authRouter } from '@/modules/auth/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    products: productsRouter,
    categories: categoriesRouter
});

// This export is vital for the frontend to get type safety!
export type AppRouter = typeof appRouter;