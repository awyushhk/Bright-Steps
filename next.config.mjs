/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '52mb',
    },
  },
  serverExternalPackages: ['cloudinary'],
  middlewareClientMaxBodySize: '52mb',
};

export default nextConfig;