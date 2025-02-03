let userConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
//   images: {
//     unoptimized: true, // Disable Next.js image optimization if using external CDN
//   },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  swcMinify: true, // Minify JS for smaller bundle sizes
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 1,
        maxAsyncRequests: 1,
      };
      config.optimization.runtimeChunk = false; // Ensure one JS bundle
    }
    return config;
  },
};

/**
 * Merge user config into Next.js config
 */
function mergeConfig(defaultConfig, userConfig) {
  if (!userConfig) return defaultConfig;

  Object.keys(userConfig).forEach((key) => {
    if (
      typeof defaultConfig[key] === "object" &&
      !Array.isArray(defaultConfig[key])
    ) {
      defaultConfig[key] = {
        ...defaultConfig[key],
        ...userConfig[key],
      };
    } else {
      defaultConfig[key] = userConfig[key];
    }
  });

  return defaultConfig;
}

export default mergeConfig(nextConfig, userConfig);
