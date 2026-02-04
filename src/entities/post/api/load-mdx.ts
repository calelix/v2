import { promises } from "fs"
import path from "path"
import matter from "gray-matter"
import { bundleMDX } from "mdx-bundler"
import rehypePrettyCode from "rehype-pretty-code"
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import { visit } from "unist-util-visit"
import { ko } from "date-fns/locale"
import {
  format,
  parseISO,
} from "date-fns"

import { PostFrontmatter } from "../model/post"

export const DATA_PATH = path.join(process.cwd(), "content/blog")

export const getPostFrontmatter = async (category: string, slug: string) => {
  const source = await getMarkdownContent(category, slug)

  if (!source) {
    return undefined
  }

  return source.frontmatter as PostFrontmatter
}

export const getBundleMDX = async (category: string, slug: string) => {
  const source = await getMarkdownContent(category, slug)

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
}

const getMarkdownContent = async (category: string, slug: string) => {
  const filePath = path.join(DATA_PATH, category, `${slug}.mdx`)

  const fileContents = await promises.readFile(filePath, "utf8").catch(() => undefined)

  if (!fileContents) {
    return undefined
  }

  const { data, content } = matter(fileContents)

  return {
    frontmatter: data,
    content,
  }
}

const parseMetaString = (metaString: string): Record<string, string> => {
  const metaAttributes: Record<string, string> = {}

  const pattern = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g

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

const rehypeMetaAttributes = () => {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName === "code" && node.data?.meta) {
        if (!node.properties) {
          node.properties = {}
        }

        node.properties["data-meta"] = node.data.meta

        const metaObject = parseMetaString(node.data.meta)

        Object.entries(metaObject).forEach(([key, value]) => {
          node.properties[`data-${key}`] = value
        })
      }
    })
  }
}
