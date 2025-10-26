'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
/**
 * Obtain a React Query client appropriate for the current environment.
 *
 * On the server, this creates and returns a new QueryClient. In the browser, this returns a shared singleton QueryClient, creating it if one does not already exist.
 *
 * @returns A QueryClient instance for the current runtime environment.
 */
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
/**
 * Compute the base URL for the TRPC API appropriate to the current runtime environment.
 *
 * @returns The full TRPC API URL (e.g. `"/api/trpc"` in the browser, `https://<VERCEL_URL>/api/trpc` on Vercel, or `http://localhost:3000/api/trpc` on a local server)
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}
/**
 * Provides TRPC and React Query contexts to its child component tree.
 *
 * Wraps `props.children` with a QueryClientProvider and TRPCProvider configured
 * with a shared QueryClient and a lazily created tRPC client using the app's
 * API URL.
 *
 * @param props - Component props.
 * @param props.children - React nodes to render inside the providers.
 * @returns A React element containing the provided children wrapped by the providers.
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}