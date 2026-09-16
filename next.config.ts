import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project: without these, a stray lockfile
  // in a parent directory (e.g. ~/Downloads/pnpm-lock.yaml) wins Next's
  // root inference and file tracing resolves against the wrong directory.
  outputFileTracingRoot: import.meta.dirname,
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
