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
    <h1 {...props} />
  ),
}
