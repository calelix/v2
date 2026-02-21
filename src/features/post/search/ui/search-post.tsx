"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { IconSearch } from "@tabler/icons-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/shadcn/command"
import { Button } from "@/shared/ui/shadcn/button"
import { useSearchPost } from "../model/use-search-post"

export const SearchPost = () => {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const {
    searchValue,
    onSearchValueChange,
    searchResult,
  } = useSearchPost()

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleSelect = (category: string, post: string) => {
    router.push(`/blog/${category}/${post}`)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="lg"
        onClick={handleToggle}
        className="w-fit cursor-pointer"
      >
        <IconSearch />
        <span className="sr-only">Search</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="포스트 제목 검색..."
            value={searchValue}
            onValueChange={onSearchValueChange}
          />
          <CommandList>
            <CommandEmpty>
              검색 결과가 없습니다.
            </CommandEmpty>
            {searchResult.map(item => (
              <CommandGroup key={`${item.category}/${item.post}`} heading="포스트">
                <CommandItem value={item.title} onSelect={() => handleSelect(item.category, item.post)}>
                  <span>
                    {item.title}
                  </span>
                </CommandItem>
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
