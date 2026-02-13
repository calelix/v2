"use client"

import { useRouter } from "next/navigation"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
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
    <>
      <Header className="h-(--header-height) bg-background" />
      <main className="relative flex container py-8 gap-8 min-h-[calc(100svh-var(--header-height)-var(--footer-height))]">
        <div className="flex flex-col w-full max-w-4xl shrink-0">
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
      <Footer className="h-(--footer-height)" />
    </>
  )
}
