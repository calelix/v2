import { type ListBlobResultBlob } from "@vercel/blob"

import { type Moment } from "./moment"

const IMAGE_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i

export function isImage(path: string) {
  return IMAGE_REGEX.test(path)
}

export function blobToMoment(blob: ListBlobResultBlob): Moment {
  const [country, city] = blob.pathname.split("/")

  return {
    src: blob.url,
    country,
    city,
  }
}
