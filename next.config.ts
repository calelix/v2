import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "gz0bl3nb3hcuttnc.public.blob.vercel-storage.com",
    }],
  },
}

export default nextConfig
