"use client"

import * as React from "react"
import Link from "next/link"

import {
  getMDXComponent,
  type MDXContentProps,
} from "mdx-bundler/client"
import { IconArrowUpRight } from "@tabler/icons-react"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { liveCodeScope } from "../../lib/markdown/live-code-scope"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../shadcn/tabs"
import { LiveCode } from "./live-code"

interface MDXComponentsProps {
  code: string
}

export const MDXComponents = ({
  code,
}: MDXComponentsProps) => {
  const Components = React.useMemo(() => getMDXComponent(code), [code])

  return (
    <>
      {Components({ components })}
    </>
  )
}

const components: MDXContentProps["components"] = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="text-lg font-bold not-first:mt-6"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="text-base font-semibold not-first:mt-6"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="text-sm font-medium not-first:mt-4"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p
      className="text-xs/relaxed text-muted-foreground not-first:mt-2"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong
      className="font-medium in-[p]:text-foreground"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-6 pl-6 border-l-2 italic font-serif [&>p]:before:content-['\201C'] [&>p]:after:content-['\201D']"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul
      className="list-disc my-2 ml-4"
      {...props}
    />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li
      className="mt-1 text-xs/relaxed text-muted-foreground"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="my-4" {...props} />
  ),
  a: ({
    target = "_blank",
    href,
    children,
    ...rest
  }: React.ComponentProps<"a">) => {
    const isImageComponent = React.isValidElement(children) && typeof children.type === "function" && children.type.name === "img"
    const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"))

    if (isInternalLink) {
      return (
        <Link
          href={href || ""}
          target={target}
          className="inline-flex items-center gap-0.5 text-zinc-700 dark:text-zinc-50 underline underline-offset-4 decoration-zinc-700"
          {...rest}
        >
          {children}
          {!isImageComponent && (
            <IconArrowUpRight className="relative -top-1 w-3 h-3 text-zinc-700 dark:text-zinc-50" />
          )}
        </Link>
      )
    }

    return (
      <a
        href={href || ""}
        target={target}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-zinc-700 dark:text-zinc-50 underline underline-offset-4 decoration-zinc-700"
        {...rest}
      >
        {children}
        {!isImageComponent && (
          <IconArrowUpRight className="relative -top-1 w-3 h-3 text-zinc-700 dark:text-zinc-50" />
        )}
      </a>
    )
  },
  code: (props: React.ComponentProps<"code"> & { "data-live"?: string }) => {
    if (props["data-live"] === "true") {
      return (
        <Tabs defaultValue="preview" className="flex flex-1">
          <TabsList className="rounded-sm bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="border-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-transparent data-[state=active]:text-foreground text-muted-foreground dark:data-[state=active]:bg-transparent dark:data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:text-foreground dark:text-muted-foreground"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="border-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-transparent data-[state=active]:text-foreground text-muted-foreground dark:data-[state=active]:bg-transparent dark:data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:text-foreground dark:text-muted-foreground"
            >
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="flex flex-1">
            <div className="flex flex-col w-full items-center justify-center rounded-sm border">
              <LiveCode
                scope={liveCodeScope}
                code={childrenText(props.children) ?? ""}
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="flex flex-1 overflow-y-auto rounded-sm bg-zinc-100 dark:bg-zinc-900">
            <div className="flex flex-1 min-w-0 overflow-hidden">
              <pre
                className={cn(
                  "w-0 flex-1 overflow-x-auto font-mono text-xs",
                  "[&>code]:grid [&>code]:p-4 [&>code]:[counter-reset:line]",
                  "[&_code_[data-line]]:flex [&_code_[data-line]]:pl-2",
                  "[&_code_[data-line]:not(:first-child)]:mt-1",
                  "[&_code_[data-line]>span]:flex [&_code_[data-line]>span]:items-center",
                  "[&_code_[data-line]::before]:inline-flex [&_code_[data-line]::before]:items-center",
                  "[&_code_[data-line]::before]:w-4 [&_code_[data-line]::before]:mr-6",
                  "[&_code_[data-line]::before]:text-right [&_code_[data-line]::before]:text-zinc-500",
                  "[&_code_[data-line]::before]:[counter-increment:line]",
                  "[&_code_[data-line]::before]:content-[counter(line)]",
                  "[&_code[data-line-numbers-max-digits='2']_[data-line]::before]:w-8",
                  "[&_code[data-line-numbers-max-digits='3']_[data-line]::before]:w-12",
                  // Shiki 테마 스타일: CSS 변수를 사용하므로 [color:var(--variable)] 형식이 필요합니다.
                  // 린터 경고가 나타나지만 text- 또는 bg- 단축형은 CSS 변수에서 작동하지 않으므로 무시합니다.
                  "[&_code[data-theme*='light']]:[color:var(--shiki-light)]",
                  "[&_code[data-theme*='light']]:[background-color:var(--shiki-light-bg)]",
                  "[&_code[data-theme*='light']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[color:var(--shiki-light)]",
                  "[&_code[data-theme*='light']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[background-color:var(--shiki-light-bg)]",
                  "dark:[&_code[data-theme*='dark']]:[color:var(--shiki-dark)]",
                  "dark:[&_code[data-theme*='dark']]:[background-color:var(--shiki-dark-bg)]",
                  "dark:[&_code[data-theme*='dark']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[color:var(--shiki-dark)]",
                  "dark:[&_code[data-theme*='dark']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[background-color:var(--shiki-dark-bg)]",
                  "[&_code_.highlighted]:bg-zinc-300 [&_code_.highlighted]:dark:bg-zinc-700",
                  "[&_code_.diff.remove]:bg-red-500/15 [&_code_.diff.remove::before]:content-['-']",
                  "[&_code_.diff.remove::before]:text-red-400",
                  "[&_code_.diff.add]:bg-teal-500/15 [&_code_.diff.add::before]:content-['+']",
                  "[&_code_.diff.add::before]:text-teal-400",
                )}
              >
                <code {...props} />
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      )
    }

    return (
      <code
        className={cn(
          "rounded-sm bg-zinc-100 dark:bg-zinc-900 font-mono font-semibold text-xs in-[p]:text-xs py-0.5 px-1",
          props.className
        )}
        {...props}
      />
    )
  },
  pre: ({ className, children, ...rest }: React.ComponentProps<"pre">) => {
    const childrenElement = children as React.ReactElement<{ "data-live"?: string }> | undefined

    const isLiveCode = React.isValidElement(childrenElement) && childrenElement.props?.["data-live"] === "true"

    if (isLiveCode) {
      return (
        <div className="flex mt-6 h-96">
          {childrenElement}
        </div>
      )
    }

    return (
      <div className="flex mt-6">
        <div className="flex flex-1 rounded-sm min-w-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <pre
            className={cn(
              "w-0 flex-1 overflow-x-auto font-mono text-xs",
              "[&>code]:grid [&>code]:p-4 [&>code]:[counter-reset:line]",
              "[&_code_[data-line]]:flex [&_code_[data-line]]:pl-2",
              "[&_code_[data-line]:not(:first-child)]:mt-1",
              "[&_code_[data-line]>span]:flex [&_code_[data-line]>span]:items-center",
              "[&_code_[data-line]::before]:inline-flex [&_code_[data-line]::before]:items-center",
              "[&_code_[data-line]::before]:w-4 [&_code_[data-line]::before]:mr-6",
              "[&_code_[data-line]::before]:text-right [&_code_[data-line]::before]:text-zinc-500",
              "[&_code_[data-line]::before]:[counter-increment:line]",
              "[&_code_[data-line]::before]:content-[counter(line)]",
              "[&_code[data-line-numbers-max-digits='2']_[data-line]::before]:w-8",
              "[&_code[data-line-numbers-max-digits='3']_[data-line]::before]:w-12",
              // Shiki 테마 스타일: CSS 변수를 사용하므로 [color:var(--variable)] 형식이 필요합니다.
              // 린터 경고가 나타나지만 text- 또는 bg- 단축형은 CSS 변수에서 작동하지 않으므로 무시합니다.
              "[&_code[data-theme*='light']]:[color:var(--shiki-light)]",
              "[&_code[data-theme*='light']]:[background-color:var(--shiki-light-bg)]",
              "[&_code[data-theme*='light']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[color:var(--shiki-light)]",
              "[&_code[data-theme*='light']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[background-color:var(--shiki-light-bg)]",
              "dark:[&_code[data-theme*='dark']]:[color:var(--shiki-dark)]",
              "dark:[&_code[data-theme*='dark']]:[background-color:var(--shiki-dark-bg)]",
              "dark:[&_code[data-theme*='dark']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[color:var(--shiki-dark)]",
              "dark:[&_code[data-theme*='dark']_[data-line]:not(.highlighted):not(.remove):not(.add)_span]:[background-color:var(--shiki-dark-bg)]",
              "[&_code_.highlighted]:bg-zinc-300 [&_code_.highlighted]:dark:bg-zinc-700",
              "[&_code_.diff.remove]:bg-red-500/15 [&_code_.diff.remove::before]:content-['-']",
              "[&_code_.diff.remove::before]:text-red-400",
              "[&_code_.diff.add]:bg-teal-500/15 [&_code_.diff.add::before]:content-['+']",
              "[&_code_.diff.add::before]:text-teal-400",
              className,
            )}
            {...rest}
          >
            {children}
          </pre>
        </div>
      </div>
    )
  },
}

const childrenText = (children?: unknown): string | null => {
  if (isReactElementWithChildren(children)) {
    return childrenText(children.props?.children)
  }

  if (Array.isArray(children)) {
    return children.map(childrenText).flat().filter(Boolean).join("")
  }

  if (typeof children === "string") {
    return children
  }

  return null
}

const isReactElementWithChildren = (
  element?: unknown,
): element is React.ReactElement<{ children: React.ReactNode }> => {
  return React.isValidElement(element) && !!(element.props as any).children
}
