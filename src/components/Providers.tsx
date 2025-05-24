"use client";

import type { ReactNode } from 'react';

// If you need client-side providers like React Query, add them here.
// For now, it's a simple pass-through.
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  // return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  return <>{children}</>;
}
