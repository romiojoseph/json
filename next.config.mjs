/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  basePath: '/json',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
