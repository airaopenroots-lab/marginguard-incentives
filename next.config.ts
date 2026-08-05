import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - allowedDevOrigins is needed for Tailscale access
  allowedDevOrigins: ["100.100.21.74", "localhost:3000", "209.145.50.251", "airaopenroots.com"],
};

export default nextConfig;
