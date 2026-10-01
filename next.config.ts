import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /work was renamed: it read as a portfolio, and sat one nav item away from
  // /how-it-works describing what sounded like the same thing. Permanent
  // because the old path is published — it has been in the nav, the footer and
  // the home page, and is live on the deployed site.
  async redirects() {
    return [{ source: "/work", destination: "/inside-a-run", permanent: true }];
  },
};

export default nextConfig;
