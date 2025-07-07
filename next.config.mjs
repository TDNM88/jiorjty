/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Important: return the modified config
    return config;
  },
  // Moved to root level as per Next.js 15.2.4
  serverExternalPackages: ['sharp', 'onnxruntime-node'],
  // Add this to handle module resolution
  transpilePackages: [],
  // Enable React strict mode
  reactStrictMode: true,
}

export default nextConfig
