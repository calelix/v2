import { type Moment } from "../model/moment"

const IMAGE_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i

export function isImage(path: string) {
  return IMAGE_REGEX.test(path)
}

export function r2ObjectToMoment(key: string): Moment {
  const [country, city] = key.split("/")

  return {
    src: `${process.env.R2_WORKER_IMAGE_BASE_URL}/${key}`,
    country,
    city,
  }
}
