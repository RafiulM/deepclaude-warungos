import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server bundle at .next/standalone for Docker.
  output: "standalone",
  // Pin the file-tracing root to this project.
  outputFileTracingRoot: path.resolve(__dirname),

  // Memory: low-RAM build hosts (e.g. Coolify on a small VPS) OOM-kill the
  // build (exit 137) during the Turbopack compile + in-process TypeScript pass.
  // Drop the heaviest passes from the production build to keep peak RAM low.
  // Types and lint should be enforced locally / in CI instead.
  productionBrowserSourceMaps: false,
  typescript: { ignoreBuildErrors: true },
  // Cap the static-generation worker pool so a many-core / low-RAM host does
  // not spawn one worker per CPU and OOM during "Generating static pages".
  experimental: { cpus: 2 },
};

export default nextConfig;
