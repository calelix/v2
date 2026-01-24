import Link from "next/link"

import { Separator } from "@/shared/ui/shadcn/separator"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"

export const HomePage = () => {
  return (
    <div
      style={
        {
          "--header-height": "calc(var(--spacing)*32)",
          "--footer-height": "calc(var(--spacing)*32)",
        } as React.CSSProperties
      }
    >
      <div aria-hidden="true" className="sticky top-0 z-50 h-(--header-height) bg-background" />
      <main className="relative flex container-sm py-8 gap-8 min-h-[calc(100svh-var(--header-height)-var(--footer-height))]">
        <FadeUpContainer className="flex flex-col w-full shrink-0">
          <FadeUpItem>
            <h1 className="text-lg font-bold">
              박종광
            </h1>
          </FadeUpItem>
          <FadeUpItem>
            <p className="mt-4 text-xs/relaxed text-muted-foreground">
              저는 프론트엔드 개발자입니다. 소설을 읽는 것을 좋아하고, 카페에 앉아 공부하며 생각을 정리하는 시간을 즐깁니다.
              혼자 깊이 집중하는 순간을 좋아하면서도, 때로는 대화를 통해 생각이 확장되는 경험을 소중하게 여깁니다.
            </p>
            <p className="mt-4 text-xs/relaxed text-muted-foreground">
              제가 만드는 서비스가 사용자에게 어떤 가치를 전하는지,
              그 가치를 전달하는 과정에서 우리를 불필요하게 번거롭게 하거나 어렵게 만드는 요소는 무엇인지에 늘 관심이 있습니다.
              화면을 만드는 일에 그치지 않고, 그 화면이 실제로 의미 있는 경험으로 이어지도록 고민합니다.
            </p>
            <p className="mt-4 text-xs/relaxed text-muted-foreground">
              저의 개발자로서의 만족은 단순히 구현에서 끝나지 않습니다.
              제가 만든 화면이 사용자에게 닿고, 사용되며, 작은 도움이라도 될 때 비로소 기여했다고 느낍니다.
              그래서 오늘도 화면이 화면으로만 남지 않도록, 묵묵히 땀을 흘리며 작업하고 있습니다.
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <div className="flex flex-col gap-8">
              <Link href="/blog">
                <article className="group">
                  <h2 className="text-base font-semibold group-hover:text-primary transition-colors duration-250">
                    블로그
                  </h2>
                  <p className="mt-2 text-xs/relaxed text-muted-foreground">
                    지난 날을 떠올리다 보면, 기억은 종종 파편처럼 흩어져 잘 떠오르지 않을 때가 있습니다.
                    간혹 적어 두었던 글과 순간들 역시 여기저기 흩어져 있었습니다.
                    이제는 그 조각들을 한곳에 모아두고 싶었습니다.
                  </p>
                </article>
              </Link>
            </div>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
      <div aria-hidden="true" className="h-(--footer-height)" />
    </div>
  )
}
