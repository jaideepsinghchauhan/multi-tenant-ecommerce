import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';

export const appRouter = createTRPCRouter({
    categories: categoriesRouter
});

// This export is vital for the frontend to get type safety!
export type AppRouter = typeof appRouter;