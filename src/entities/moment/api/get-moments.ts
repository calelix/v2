import { type Moment } from "@/entities/moment"
import { APP_URL } from "@/shared/config/env"

interface GetMomentsRequest {
  cursor?: string
}

interface GetMomentsResult {
  images: Moment[]
  nextCursor?: string
}

export async function getMoments(params: GetMomentsRequest): Promise<GetMomentsResult> {
  const { cursor } = params

  const url = cursor
    ? `${APP_URL}/api/moments?cursor=${encodeURIComponent(cursor)}`
    : `${APP_URL}/api/moments`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Failed to fetch moments")
  }

  return res.json()
}
