import fs from "fs"
import path from "path"
import matter from "gray-matter"

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { type CategoryMetadata } from "../model/category"
import { type PostFrontmatter } from "../model/post"
import {
  getCategories,
  getAllPosts,
  getCategoryMetadata,
  getPostsByCategory,
  getAdjacentPost,
} from "./posts"

const createDefaultFrontmatter = (overrides?: Partial<PostFrontmatter>): PostFrontmatter => ({
  title: "Default Title",
  description: "Default Description",
  publishedAt: "2026-01-01",
  status: "published",
  formattedPublishedAt: "2026-01-01",
  author: {
    name: "John Doe",
  },
  ...overrides,
})

const createTestCategory = (basePath: string, category: string, metadata: CategoryMetadata) => {
  const directory = path.join(basePath, category)

  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, "metadata.json"), JSON.stringify(metadata))

  return directory
}

const createTestPost = (basePath: string, category: string, slug: string, frontmatter: PostFrontmatter) => {
  const directory = path.join(basePath, category)
  fs.mkdirSync(directory, { recursive: true })

  const fileContent = matter.stringify("Test content", frontmatter)
  fs.writeFileSync(path.join(directory, `${slug}.mdx`), fileContent)
}

describe("posts", () => {
  const CONTENT_DIRECTORY_NAME = "test-blog"
  const NON_EXISTENT_CONTENT_DIRECTORY_NAME = "non-existent-directory"
  const contentDirectory = path.join(process.cwd(), "content", CONTENT_DIRECTORY_NAME)
  const metadata: CategoryMetadata = {
    name: "Category Name",
    description: "Category Description",
  }

  beforeEach(() => {
    if (!fs.existsSync(contentDirectory)) {
      fs.mkdirSync(contentDirectory, { recursive: true })
    }
  })

  afterEach(() => {
    if (fs.existsSync(contentDirectory)) {
      fs.rmSync(contentDirectory, { recursive: true, force: true })
    }
  })

  describe("getCategories", () => {
    it("컨텐츠 디렉토리가 존재하지 않으면 빈 배열을 반환한다", () => {
      const categories = getCategories(NON_EXISTENT_CONTENT_DIRECTORY_NAME)

      expect(categories).toEqual([])
    })

    it("컨텐츠 디렉토리는 존재하지만 카테고리가 없으면 빈 배열을 반환한다", () => {
      const categories = getCategories(CONTENT_DIRECTORY_NAME)

      expect(categories).toEqual([])
    })

    it("카테고리가 하나 존재하면 해당 카테고리명을 배열로 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      const categories = getCategories(CONTENT_DIRECTORY_NAME)

      expect(categories).toEqual(["category1"])
    })

    it("여러 카테고리가 존재하면 모든 카테고리명을 배열로 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestCategory(contentDirectory, "category2", metadata)
      const categories = getCategories(CONTENT_DIRECTORY_NAME)

      expect(categories).toEqual(["category1", "category2"])
    })
  })

  describe("getAllPosts", () => {
    it("컨텐츠 디렉토리가 존재하지 않으면 빈 배열을 반환한다", () => {
      const posts = getAllPosts(NON_EXISTENT_CONTENT_DIRECTORY_NAME)

      expect(posts).toEqual([])
    })

    it("컨텐츠 디렉토리는 존재하지만 카테고리가 없으면 빈 배열을 반환한다", () => {
      const posts = getAllPosts(CONTENT_DIRECTORY_NAME)

      expect(posts).toEqual([])
    })

    it("카테고리는 존재하지만 포스트가 없으면 빈 배열을 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      const posts = getAllPosts(CONTENT_DIRECTORY_NAME)

      expect(posts).toEqual([])
    })

    it("한 카테고리에 포스트가 존재하면 해당 포스트들을 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ title: "Post 1" }))
      createTestPost(contentDirectory, "category1", "post2", createDefaultFrontmatter({ title: "Post 2", publishedAt: "2026-01-02" }))

      const posts = getAllPosts(CONTENT_DIRECTORY_NAME)

      expect(posts).toEqual([
        { category: "category1", slug: "post1" },
        { category: "category1", slug: "post2" },
      ])
    })

    it("여러 카테고리에 포스트가 존재하면 모든 포스트를 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestCategory(contentDirectory, "category2", metadata)

      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ title: "Post 1" }))
      createTestPost(contentDirectory, "category2", "post2", createDefaultFrontmatter({ title: "Post 2", publishedAt: "2026-01-02" }))

      const posts = getAllPosts(CONTENT_DIRECTORY_NAME)

      expect(posts).toEqual([
        { category: "category1", slug: "post1" },
        { category: "category2", slug: "post2" },
      ])
    })
  })

  describe("getCategoryMetadata", () => {
    it("카테고리가 존재하지 않으면 에러를 발생시킨다", () => {
      expect(() => getCategoryMetadata(CONTENT_DIRECTORY_NAME, "non-existent")).toThrow("Category non-existent not found.")
    })

    it("카테고리가 존재하면 메타데이터를 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      const result = getCategoryMetadata(CONTENT_DIRECTORY_NAME, "category1")

      expect(result).toEqual(metadata)
    })
  })

  describe("getPostsByCategory", () => {
    it("카테고리가 존재하지 않으면 에러를 발생시킨다", () => {
      expect(() => getPostsByCategory(CONTENT_DIRECTORY_NAME, "non-existent")).toThrow("Category non-existent not found.")
    })

    it("카테고리는 존재하지만 포스트가 없으면 빈 배열을 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      const result = getPostsByCategory(CONTENT_DIRECTORY_NAME, "category1")

      expect(result).toEqual({
        category: "category1",
        metadata,
        posts: [],
      })
    })

    it("published 상태의 포스트만 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ status: "published", title: "Published Post" }))
      createTestPost(contentDirectory, "category1", "post2", createDefaultFrontmatter({ status: "draft", title: "Draft Post" }))
      createTestPost(contentDirectory, "category1", "post3", createDefaultFrontmatter({ status: "archived", title: "Archived Post" }))

      const result = getPostsByCategory(CONTENT_DIRECTORY_NAME, "category1")

      expect(result.posts).toHaveLength(1)
      expect(result.posts[0].slug).toBe("post1")
      expect(result.posts[0].frontmatter.title).toBe("Published Post")
    })

    it("포스트를 최신순(publishedAt 기준)으로 정렬하여 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ publishedAt: "2026-01-01", title: "Old Post" }))
      createTestPost(contentDirectory, "category1", "post2", createDefaultFrontmatter({ publishedAt: "2026-01-03", title: "New Post" }))
      createTestPost(contentDirectory, "category1", "post3", createDefaultFrontmatter({ publishedAt: "2026-01-02", title: "Middle Post" }))

      const result = getPostsByCategory(CONTENT_DIRECTORY_NAME, "category1")

      expect(result.posts).toHaveLength(3)
      expect(result.posts[0].slug).toBe("post2") // 2026-01-03
      expect(result.posts[1].slug).toBe("post3") // 2026-01-02
      expect(result.posts[2].slug).toBe("post1") // 2026-01-01
    })

    it("frontmatter에 formattedPublishedAt를 추가하여 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ publishedAt: "2026-01-15" }))

      const result = getPostsByCategory(CONTENT_DIRECTORY_NAME, "category1")

      expect(result.posts[0].frontmatter.formattedPublishedAt).toBeDefined()
      expect(typeof result.posts[0].frontmatter.formattedPublishedAt).toBe("string")
    })
  })

  describe("getAdjacentPost", () => {
    it("포스트를 찾을 수 없으면 prev와 next를 null로 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter())

      const result = getAdjacentPost(CONTENT_DIRECTORY_NAME, "category1", "non-existent")

      expect(result).toEqual({
        prev: null,
        next: null,
      })
    })

    it("포스트가 하나만 있으면 prev와 next를 null로 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter())

      const result = getAdjacentPost(CONTENT_DIRECTORY_NAME, "category1", "post1")

      expect(result).toEqual({
        prev: null,
        next: null,
      })
    })

    it("첫 번째 포스트는 next만 있고 prev는 null이다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ publishedAt: "2026-01-03" })) // newest
      createTestPost(contentDirectory, "category1", "post2", createDefaultFrontmatter({ publishedAt: "2026-01-01" })) // oldest

      const result = getAdjacentPost(CONTENT_DIRECTORY_NAME, "category1", "post1")

      expect(result.prev).not.toBeNull()
      expect(result.prev?.slug).toBe("post2")
      expect(result.next).toBeNull()
    })

    it("마지막 포스트는 prev만 있고 next는 null이다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ publishedAt: "2026-01-03" })) // newest
      createTestPost(contentDirectory, "category1", "post2", createDefaultFrontmatter({ publishedAt: "2026-01-01" })) // oldest

      const result = getAdjacentPost(CONTENT_DIRECTORY_NAME, "category1", "post2")

      expect(result.prev).toBeNull()
      expect(result.next).not.toBeNull()
      expect(result.next?.slug).toBe("post1")
    })

    it("중간 포스트는 prev와 next를 모두 반환한다", () => {
      createTestCategory(contentDirectory, "category1", metadata)
      createTestPost(contentDirectory, "category1", "post1", createDefaultFrontmatter({ publishedAt: "2026-01-03" })) // newest
      createTestPost(contentDirectory, "category1", "post2", createDefaultFrontmatter({ publishedAt: "2026-01-02" })) // middle
      createTestPost(contentDirectory, "category1", "post3", createDefaultFrontmatter({ publishedAt: "2026-01-01" })) // oldest

      const result = getAdjacentPost(CONTENT_DIRECTORY_NAME, "category1", "post2")

      expect(result.prev).not.toBeNull()
      expect(result.prev?.slug).toBe("post3") // older post
      expect(result.next).not.toBeNull()
      expect(result.next?.slug).toBe("post1") // newer post
    })
  })

})
