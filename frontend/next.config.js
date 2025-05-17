/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable Turbopack if causing issues
    // Remove --turbo from dev script in package.json if this persists
    experimental: {
        turbo: {
            // Potential Turbopack configuration
            resolveAlias: {
                // Resolve any package conflicts
                '@supabase/supabase-js': '@supabase/supabase-js'
            }
        }
    },
    typescript: {
        ignoreBuildErrors: true, // ✅ Ignore TypeScript errors during build
    },
    eslint: {
        ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
    },
    // Configure output for static site generation
    output: 'export',
    
    // Configure base path if not being served from the root
    // basePath: '',
    
    // Configure asset prefix for serving static assets
    // assetPrefix: '',
    
    // Disable image optimization for static exports
    images: {
        unoptimized: true
    },
    
    // Set production API URL
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app-url.railway.app/api'
    }
};

module.exports = nextConfig;
