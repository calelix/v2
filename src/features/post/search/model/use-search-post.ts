"use client"

import * as React from "react"

import { useQuery } from "@tanstack/react-query"

import { getPosts } from "../api/get-posts"

export function useSearchPost() {
  const [searchValue, setSearchValue] = React.useState("")

  const {
    data: posts = [],
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime: "static",
  })

  const searchResult = React.useMemo(
    () => {
      const query = searchValue.trim().toLowerCase()

      if (!query) {
        return []
      }

      return posts.filter(post =>
        post.title.toLowerCase().includes(query)
      )
    },
    [posts, searchValue]
  )

  return {
    searchValue,
    onSearchValueChange: setSearchValue,
    searchResult,
  }
}
