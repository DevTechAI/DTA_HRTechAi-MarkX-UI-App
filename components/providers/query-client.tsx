'use client';

import { QueryClientProvider as Provider, QueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return <Provider client={queryClient}>{children}</Provider>;
}
