/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: '/json',
  assetPrefix: '/json',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
