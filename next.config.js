/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Temporalmente comentado para permitir rutas dinámicas
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
