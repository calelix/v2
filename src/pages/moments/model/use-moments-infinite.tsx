import { useInfiniteQuery } from "@tanstack/react-query"

import { getMoments } from "@/entities/moment"

export function useMomentsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ["moments"],
    queryFn: ({ pageParam }) => getMoments({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  })
}
