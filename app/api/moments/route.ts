import { list } from "@vercel/blob"
import { NextRequest } from "next/server"

import {
  blobToMoment,
  isImage,
} from "@/entities/moment"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get("cursor") ?? undefined

  const result = await list({
    limit: 10,
    cursor,
  })

  const images = result.blobs
    .filter((blob) => isImage(blob.pathname))
    .map(blobToMoment)

  return Response.json({
    images,
    nextCursor: result.cursor,
  })
}
