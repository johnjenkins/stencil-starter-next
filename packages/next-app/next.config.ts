import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../..'),
  allowedDevOrigins: ['*.csb.app'],
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        // just a nicety - don't ignore our local packages during dev
        ignored: [
          "**/node_modules/**",
          "!**/node_modules/@example/stencil-lib-react/**",
          "!**/node_modules/@example/stencil-lib/**",
        ],
      };
    }

    return config;
  },
};

export default nextConfig;
