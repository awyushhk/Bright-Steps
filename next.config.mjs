/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '52mb',
    },
  },
  //  This is the correct key for API routes in Next.js 15/16
  serverExternalPackages: ['cloudinary'],
  middlewareClientMaxBodySize: '52mb',
};

export default nextConfig;