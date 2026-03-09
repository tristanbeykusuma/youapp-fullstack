import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "172.27.32.1"
  ],
};

export default nextConfig;
