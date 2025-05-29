/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential error-ignoring settings
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors
  },
  
  // Dynamic route handling
  experimental: {
    turbo: {
      resolveAlias: {
        '@supabase/supabase-js': '@supabase/supabase-js'
      }
    },
    missingSuspenseWithCSRBailout: false, // Prevents CSR bailout warnings
    bypassDynamicRouteWarnings: true, // Suppresses dynamic route warnings
  },

  // Static export configuration (remove if using Vercel/Netlify)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  skipTrailingSlashRedirect: true, // Fixes static export redirect issues

  // Image optimization
  images: {
    unoptimized: true, // Required for static exports
    dangerouslyAllowSVG: true, // Allows SVG imports
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Bypasses image security warnings
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app-url.railway.app/api'
  },

  // Advanced error suppression (Next.js 14+)
  logging: {
    fetches: {
      fullUrl: false
    },
    level: 'error'
  },
  staticPageGenerationTimeout: 1000, // Prevents timeout errors
};

module.exports = nextConfig;
