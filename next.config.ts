import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Configuração para resolver módulos
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/modules': path.resolve(__dirname, 'src/modules'),
    };
    
    return config;
  },
};

export default nextConfig;
