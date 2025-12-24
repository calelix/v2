"use client"

import { useRouter } from "next/navigation"

import { Header } from "@/widgets/header"
import { Button } from "@/shared/ui/shadcn/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/ui/shadcn/empty"

export const NotFoundPage = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div
      className="px-4 lg:px-0"
      style={
        {
          "--header-height": "calc(var(--spacing)*32)",
        } as React.CSSProperties
      }
    >
      <Header className="h-32" />
      <main className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-8 min-h-[calc(100svh-var(--header-height)*2)]">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>
                404 - Not Found
              </EmptyTitle>
              <EmptyDescription>
                The page you{"'"}re looking for doesn{"'"}t exist.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" onClick={handleGoBack} className="cursor-pointer">
                Go Back
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </main>
    </div>
  )
}
