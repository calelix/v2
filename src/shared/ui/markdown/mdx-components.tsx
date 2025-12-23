"use client"

import * as React from "react"

import {
  getMDXComponent,
  type MDXContentProps,
} from "mdx-bundler/client"

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
      className="text-sm font-semibold not-first:mt-6"
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
      className="mt-6 pl-6 border-l-2 italic font-serif [&>p]:before:content-['\201C'] [&>p]:after:content-['\201D']"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="w-full overflow-x-auto"
      {...props}
    />
  ),
}
