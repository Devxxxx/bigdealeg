const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        '@supabase/supabase-js': '@supabase/supabase-js'
      }
    }
  },
  // Remove this line ↓
  // output: 'export',
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app-url.railway.app/api'
  }
};
