// utils/queryClient.ts
import { QueryClient, dehydrate, hydrate, Query } from '@tanstack/react-query';
/**
 * Create a QueryClient configured with a 30-second default query stale time.
 *
 * @returns A new QueryClient instance with `queries.staleTime` set to 30,000 milliseconds.
 */

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
      },
    },
  });
}

/**
 * Produce a dehydrated state of the given QueryClient including only selected queries.
 *
 * Only queries whose state status is `'success'` or `'pending'` are included in the result.
 *
 * @param queryClient - The QueryClient to dehydrate
 * @returns A dehydrated state containing only queries with status `'success'` or `'pending'`
 */
export function customDehydrate(queryClient: QueryClient) {
  return dehydrate(queryClient, {
    shouldDehydrateQuery: (query: Query) =>
      query.state.status === 'success' || query.state.status === 'pending',
  });
}

/**
 * Apply a dehydrated query state to an existing QueryClient.
 *
 * @param queryClient - The QueryClient instance to hydrate
 * @param state - The dehydrated state produced by `dehydrate`
 */
export function customHydrate(queryClient: QueryClient, state: ReturnType<typeof dehydrate>) {
  hydrate(queryClient, state);
}