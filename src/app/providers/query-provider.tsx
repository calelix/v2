"use client"

import { useState } from "react"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

interface QueryProviderProps {
  children: React.ReactNode
}

export const QueryProvider = ({
  children,
}: QueryProviderProps) => {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
