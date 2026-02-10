import {
  NextRequest,
  NextResponse,
} from "next/server"

import { ListObjectsV2Command } from "@aws-sdk/client-s3"

import {
  isImage,
  r2ObjectToMoment,
} from "@/entities/moment"
import { r2 } from "@/shared/lib/r2/client"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get("cursor") ?? undefined
  const pageSize = Number(searchParams.get("pageSize") ?? "10")

  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME!,
    MaxKeys: pageSize,
    ContinuationToken: cursor,
  })

  const result = await r2.send(command)

  const images = result.Contents
    ?.filter((content) => content.Key && isImage(content.Key))
    .map((content) => r2ObjectToMoment(content.Key!)) ?? []

  return NextResponse.json({
    images,
    nextCursor: result.IsTruncated
      ? result.NextContinuationToken
      : null,
  })
}
