import Link from "next/link"

import { Header } from "@/widgets/header"
import { Separator } from "@/shared/ui/shadcn/separator"
import {
  FadeUpContainer,
  FadeUpItem,
} from "@/shared/ui/fade-up/fade-up"

export const BlogHomePage = () => {
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
        <FadeUpContainer className="flex flex-col">
          <FadeUpItem>
            <h1 className="text-lg font-bold">
              Powered by Caffeine & Confusion
            </h1>
          </FadeUpItem>
          <FadeUpItem>
            <p className="mt-4 text-xs/relaxed text-muted-foreground">
              Can{"'"}t start my day without Americano. For real. One cup to wake up, two to function, three for... just habit. Every post here is written by a caffeine lover.
            </p>
          </FadeUpItem>
          <FadeUpItem>
            <Separator className="my-8 lg:my-12" />
          </FadeUpItem>
          <FadeUpItem>
            <div className="flex flex-col gap-8">
              <Link href="/blog/craft">
                <article className="group">
                  <h2 className="text-sm font-semibold group-hover:text-primary transition-colors duration-250">
                    Craft
                  </h2>
                  <p className="mt-2 text-xs/relaxed text-muted-foreground">
                    Building stuff. Breaking stuff. Fixing stuff. Repeat.
                  </p>
                </article>
              </Link>
              <Link href="/blog/insight">
                <article className="group">
                  <h2 className="text-sm font-semibold group-hover:text-primary transition-colors duration-250">
                    Insight
                  </h2>
                  <p className="mt-2 text-xs/relaxed text-muted-foreground">
                    Thoughts brewed slowly. With time. Lots of time.
                  </p>
                </article>
              </Link>
            </div>
          </FadeUpItem>
        </FadeUpContainer>
      </main>
    </div>
  )
}
