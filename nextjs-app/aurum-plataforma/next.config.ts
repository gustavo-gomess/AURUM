import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removendo output: 'export' para permitir API Routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

