import { type Moment } from "@/entities/moment"
import { APP_URL } from "@/shared/config/env"

interface GetMomentsRequest {
  cursor?: string
  pageSize?: number
}

interface GetMomentsResult {
  images: Moment[]
  nextCursor?: string
}

export async function getMoments(params: GetMomentsRequest): Promise<GetMomentsResult> {
  const { cursor, pageSize } = params

  const url = new URL("/api/moments", APP_URL)

  if (cursor) {
    url.searchParams.set("cursor", cursor)
  }

  if (pageSize) {
    url.searchParams.set("pageSize", String(pageSize))
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    throw new Error("Failed to fetch moments")
  }

  return res.json()
}
