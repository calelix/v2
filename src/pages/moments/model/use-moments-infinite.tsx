import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { getMoments } from "@/entities/moment"

export function useMomentsInfiniteQuery() {
  return useSuspenseInfiniteQuery({
    queryKey: ["moments"],
    queryFn: ({ pageParam }) => getMoments({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  })
}
