import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isGitHubPagesBuild
  ? {
      output: "export",
      trailingSlash: true,
      images: {
        unoptimized: true,
      },
      // The repository also contains Cloudflare Worker-only modules. They are
      // not part of this static site, so Next should not type-check them here.
      typescript: {
        ignoreBuildErrors: true,
      },
    }
  : {};

export default nextConfig;
