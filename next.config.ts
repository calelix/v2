import type { NextConfig } from "next"

const isDevelopment = process.env.NODE_ENV === "development"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "gz0bl3nb3hcuttnc.public.blob.vercel-storage.com",
    }],
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
