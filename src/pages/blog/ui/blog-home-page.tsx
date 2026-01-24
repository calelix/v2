import Link from "next/link"

import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import { Separator } from "@/shared/ui/shadcn/separator"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"

export const BlogHomePage = () => {
  return (
    <div
      style={
        {
          "--header-height": "calc(var(--spacing)*32)",
          "--footer-height": "calc(var(--spacing)*32)",
        } as React.CSSProperties
      }
    >
      <Header className="sticky top-0 z-50 h-(--header-height) bg-background" />
      <main className="relative flex container py-8 gap-8 min-h-[calc(100svh-var(--header-height)-var(--footer-height))]">
        <FadeUpContainer className="flex flex-col w-full max-w-4xl shrink-0">
          <FadeUpItem>
            <h1 className="text-lg font-bold">
              Blog
            </h1>
          </FadeUpItem>
          <FadeUpItem className="mt-2">
            <p className="text-xs/relaxed text-muted-foreground">
              지난 날을 떠올리다 보면, 기억은 종종 파편처럼 흩어져 잘 떠오르지 않을 때가 있습니다.
            </p>
            <p className="text-xs/relaxed text-muted-foreground">
              간혹 적어 두었던 글과 순간들 역시 여기저기 흩어져 있었습니다. 이제는 그 조각들을 한곳에 모아두고 싶었습니다.
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <div className="flex flex-col gap-8">
              <Link href="/blog/craft">
                <article className="group">
                  <h2 className="text-base font-semibold group-hover:text-primary transition-colors duration-250">
                    Craft
                  </h2>
                  <p className="mt-2 text-xs/relaxed text-muted-foreground">
                    무언가를 만들고, 부수고, 고치고. 이 과정을 반복한다.
                  </p>
                </article>
              </Link>
              <Link href="/blog/insight">
                <article className="group">
                  <h2 className="text-base font-semibold group-hover:text-primary transition-colors duration-250">
                    Insight
                  </h2>
                  <p className="mt-2 text-xs/relaxed text-muted-foreground">
                    생각은 천천히, 오랜 시간에 걸쳐, 서서히 싹텄다.
                  </p>
                </article>
              </Link>
              <Link href="/blog/digest">
                <article className="group">
                  <h2 className="text-base font-semibold group-hover:text-primary transition-colors duration-250">
                    Digest
                  </h2>
                  <p className="mt-2 text-xs/relaxed text-muted-foreground">
                    지식을 이해로 바꾸고, 진정으로 내 것으로 만들다.
                  </p>
                </article>
              </Link>
            </div>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
      <Footer className="h-(--footer-height)" />
    </div>
  )
}
