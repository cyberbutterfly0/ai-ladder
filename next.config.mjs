/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "1";

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isPages ? "/ai-ladder" : "",
  },
  ...(isPages
    ? {
        output: "export",
        basePath: "/ai-ladder",
        assetPrefix: "/ai-ladder/",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
