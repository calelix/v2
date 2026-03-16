"use client"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import { Separator } from "@/shared/ui/shadcn/separator"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"
import { ErrorBoundary } from "@/shared/ui/error-boundary/error-boundary"
import { MomentsGallery } from "./moments-gallery"
import { MomentsGalleryError } from "./moments-gallery-error"

export const MomentsHomePage = () => {
  return (
    <>
      <Header className="h-(--header-height) bg-background" />
      <main className="relative flex gap-8 container py-8 min-h-[calc(100svh-var(--page-spacing))]">
        <FadeUpContainer className="flex flex-col w-full max-w-4xl shrink-0">
          <FadeUpItem>
            <h1 className="text-lg font-bold">
              Moments
            </h1>
          </FadeUpItem>
          <FadeUpItem className="mt-2">
            <p className="text-xs/loose text-body">
              쉽게 보내기 싫은 지나간 순간들을 사진으로 남깁니다.
            </p>
            <p className="text-xs/loose text-body">
              하루의 빛과 스치는 풍경, 사소한 감정들을 모아 흐릿해지기 전의 기억을 조용히 붙잡아 두었습니다.
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <ErrorBoundary fallback={<MomentsGalleryError />}>
              <MomentsGallery />
            </ErrorBoundary>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
      <Footer className="h-(--footer-height)" />
    </>
  )
}
