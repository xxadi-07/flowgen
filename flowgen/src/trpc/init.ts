// utils/trpc.ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
// import superjson from 'superjson'; // optional if you want data serialization

/**
 * Create tRPC context (server-side)
 * Cached to avoid re-creating unnecessarily
 */
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   * You can add authentication or database connections here
   */
  return { userId: 'user_123' };
});

/**
 * Initialize tRPC
 * Using a factory pattern to allow future transformers or middlewares
 */
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   * transformer: superjson, // optional
   */
});

/**
 * Base router and procedure helpers
 */
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * Optional: Dynamic import helper
 * If you want to lazy-load tRPC for SSR or Next.js server-side separation
 */
export async function getTRPC() {
  const { initTRPC } = await import('@trpc/server');
  const tDynamic = initTRPC.create({
    // transformer: superjson,
  });
  return {
    createTRPCRouter: tDynamic.router,
    baseProcedure: tDynamic.procedure,
    createCallerFactory: tDynamic.createCallerFactory,
  };
}
