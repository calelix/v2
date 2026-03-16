import fs from "fs"
import path from "path"

import { cache } from "react"

import matter from "gray-matter"
import { bundleMDX } from "mdx-bundler"
import rehypePrettyCode from "rehype-pretty-code"
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import {
  type Element,
  type Root,
} from "hast"
import { visit } from "unist-util-visit"
import { ko } from "date-fns/locale"
import {
  format,
  parseISO,
} from "date-fns"

import { PostFrontmatter } from "../model/post"

export const DATA_PATH = path.join(process.cwd(), "content/blog")

export const getPostFrontmatter = cache(async (category: string, post: string) => {
  const source = await getMarkdownContent(category, post)

  if (!source) {
    return undefined
  }

  return source.frontmatter as PostFrontmatter
})

export const getBundleMDX = cache(async (category: string, post: string) => {
  const source = await getMarkdownContent(category, post)

  if (!source) {
    return undefined
  }

  const { code } = await bundleMDX({
    source: source.content,
    cwd: process.cwd(),
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [
          rehypePrettyCode,
          {
            theme: {
              dark: "github-dark",
              light: "github-light",
            },
            keepBackground: false,
            transformers: [
              transformerNotationDiff(),
              transformerNotationHighlight(),
            ],
          },
        ],
        rehypeMetaAttributes,
      ]
      return options
    },
  })

  const publishedDate = parseISO(source.frontmatter.publishedAt as string)
  const formattedPublishedAt = format(publishedDate, "MMMM dd, yyyy", { locale: ko })

  return {
    frontmatter: {
      ...source.frontmatter,
      formattedPublishedAt,
    } as PostFrontmatter,
    code
  }
})

const getMarkdownContent = cache(async (category: string, post: string) => {
  const filePath = path.join(DATA_PATH, category, `${post}.mdx`)

  const fileContents = await fs.promises.readFile(filePath, "utf8").catch(() => undefined)

  if (!fileContents) {
    return undefined
  }

  const { data, content } = matter(fileContents)

  return {
    frontmatter: data,
    content,
  }
})

const META_STRING_PATTERN = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g

const parseMetaString = (metaString: string): Record<string, string> => {
  const metaAttributes: Record<string, string> = {}
  const pattern = new RegExp(META_STRING_PATTERN.source, META_STRING_PATTERN.flags)

  let match: RegExpExecArray | null

  while ((match = pattern.exec(metaString)) !== null) {
    const key = match[1]
    const value = match[2] || match[3] || match[4] || "true"

    if (key) {
      metaAttributes[key] = value
    }
  }

  return metaAttributes
}

interface CodeElementData {
  meta?: string
}

const rehypeMetaAttributes = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const meta = (node.data as CodeElementData | undefined)?.meta
      if (node.tagName === "code" && meta) {
        if (!node.properties) {
          node.properties = {}
        }

        node.properties["data-meta"] = meta

        const metaObject = parseMetaString(meta)

        Object.entries(metaObject).forEach(([key, value]) => {
          node.properties[`data-${key}`] = value
        })
      }
    })
  }
}
