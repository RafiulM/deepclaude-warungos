import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server bundle at .next/standalone for Docker.
  output: "standalone",
  // Pin the file-tracing root to this project.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
