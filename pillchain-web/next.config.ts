import type { NextConfig } from "next";

import "reflect-metadata";
const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;