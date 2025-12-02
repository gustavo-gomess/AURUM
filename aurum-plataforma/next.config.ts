import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removendo output: 'export' para permitir API Routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Desabilitar ESLint durante o build para evitar erros no deploy
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desabilitar TypeScript type checking durante o build (opcional, se necessário)
  typescript: {
    ignoreBuildErrors: false, // Mantém verificação de tipos, apenas desabilita ESLint
  },
};

export default nextConfig;

