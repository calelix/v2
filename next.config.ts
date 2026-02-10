import type { NextConfig } from "next"

const isDevelopment = process.env.NODE_ENV === "development"
const r2WorkerImageHost = process.env.R2_WORKER_IMAGE_HOST

const remotePatterns = r2WorkerImageHost
  ?
  [
    {
      protocol: "https" as const,
      hostname: r2WorkerImageHost,
    }
  ]
  : []

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  /**
   * @see {@link https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler}
   */
  reactCompiler: {
    panicThreshold: isDevelopment ? "all_errors" : "none",
    compilationMode: "infer",
  }
}

export default nextConfig
