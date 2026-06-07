import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server bundle at .next/standalone for Docker.
  // Traces only the files needed at runtime (incl. the better-sqlite3 native
  // binding) so the production image does not reinstall node_modules.
  output: "standalone",
  // Pin the file-tracing root to this project. Without it, a lockfile in a
  // parent dir makes Next infer a higher root and nest server.js one level
  // deeper in .next/standalone, breaking the Docker COPY paths.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
