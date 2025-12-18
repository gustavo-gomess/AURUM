import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removendo output: 'export' para permitir API Routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Desabilitar TypeScript type checking durante o build (opcional, se necessário)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

