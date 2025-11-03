import {withSentryConfig} from '@sentry/nextjs';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack selects this app as the root
  turbopack: {
    root: __dirname,
  },
  eslint: {
    // Completely disable ESLint during builds - use editor for linting
    ignoreDuringBuilds: true,
    dirs: [], // Don't run ESLint on any directories during build
  },
  typescript: {
    // Speed up dev by not type-checking during build (use editor for type errors)
    ignoreBuildErrors: true,
  },
  // Disable source maps in development for faster compilation
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
    ],
  },
  // Fix for server-side modules in production build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      // Externalize these packages for server-side, but NOT axe-core
      config.externals.push('@react-email/render');
      
      // Ensure axe-core is bundled (not externalized)
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.map((external: any) => {
          if (typeof external === 'function') {
            return (context: any, request: string, callback: any) => {
              if (request === 'axe-core' || request.startsWith('axe-core/')) {
                return callback();
              }
              return external(context, request, callback);
            };
          }
          return external;
        });
      }
    }
    if (!isServer) {
      // Prevent winston from being bundled on client-side
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback.fs = false;
      config.resolve.fallback.path = false;
      config.resolve.fallback.stream = false;
    }
    return config;
  },
};

// Only wrap with Sentry in production - it slows down development significantly
// DISABLED TEMPORARILY - causing ESLint issues during build
// const config = process.env.NODE_ENV === 'production' 
const config = false 
  ? withSentryConfig(nextConfig, {
      // ...existing config...
    })
  : nextConfig;

export default config;