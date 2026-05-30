import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "pomojikan-next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages ではサブパスになるので basePath を設定
  // ローカル dev では空文字（影響なし）
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}` : "",
  images: { unoptimized: true },
};

export default nextConfig;
