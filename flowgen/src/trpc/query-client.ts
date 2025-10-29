// utils/queryClient.ts
import { QueryClient, dehydrate, hydrate, Query } from '@tanstack/react-query';
// import superjson from 'superjson'; // optional, if you want custom serialization

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
 * Dehydrate query client state with custom logic
 * E.g., include queries that are pending or successful
 */
export function customDehydrate(queryClient: QueryClient) {
  return dehydrate(queryClient, {
    shouldDehydrateQuery: (query: Query) =>
      query.state.status === 'success' || query.state.status === 'pending',
  });
}

/**
 * Hydrate query client with pre-fetched state
 */
export function customHydrate(queryClient: QueryClient, state: ReturnType<typeof dehydrate>) {
  hydrate(queryClient, state);
}
