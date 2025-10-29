// utils/trpc.ts
import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import next from 'next';
import { headers } from 'next/headers';
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
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  // your session logic, for example:
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return next({ ctx: { ...ctx, auth: session } });
});

