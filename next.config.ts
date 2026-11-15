import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 60 is used for large, low-contrast background textures (the street map).
    qualities: [60, 75, 88],
  },
};

export default nextConfig;
