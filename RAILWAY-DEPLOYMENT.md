# Deploying BigDealEgy on Railway

This guide explains how to deploy the full-stack BigDealEgy application (Next.js frontend + Express backend) on Railway.app.

## Prerequisites

1. Create a [Railway.app](https://railway.app/) account
2. Install the [Railway CLI](https://docs.railway.app/develop/cli) (optional but recommended)
3. Make sure you have Git installed

## Step 1: Prepare Your Project

Your project is already set up to be deployed as a single service with:

- Root package.json for unified management
- Backend configuration to serve frontend files
- Next.js configured to output static files
- Railway configuration files

## Step 2: Set Up Your Railway Project

### Option 1: Deploy via Railway CLI

1. Login to the Railway CLI:
   ```
   railway login
   ```

2. Initialize a new Railway project within your project directory:
   ```
   cd E:\bigdealegy\bigdealegy
   railway init
   ```

3. Link to your project:
   ```
   railway link
   ```

4. Set up environment variables:
   ```
   railway vars set DATABASE_URL=your_supabase_url
   railway vars set DATABASE_KEY=your_supabase_key
   railway vars set JWT_SECRET=your_jwt_secret
   railway vars set FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account
   ```

5. Deploy your project:
   ```
   railway up
   ```

### Option 2: Deploy via Railway Dashboard

1. Push your code to a GitHub repository
2. Log in to [Railway Dashboard](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub Repo"
4. Select your repository
5. In the Settings tab, add the following environment variables:
   - DATABASE_URL=your_supabase_url
   - DATABASE_KEY=your_supabase_key
   - JWT_SECRET=your_jwt_secret
   - FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account
   - Other environment variables as needed

## Step 3: Configure API URLs

After deployment, Railway will provide a deployment URL. Update your frontend configuration:

1. Update .env file in your local project:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app/api
   ```

2. Set this as an environment variable in Railway:
   ```
   railway vars set NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app/api
   ```

## Step 4: Set Up Custom Domain (Optional)

1. Go to your Railway project
2. Navigate to Settings → Domains
3. Add your custom domain
4. Configure DNS settings as instructed by Railway

## Troubleshooting

### Common Issues

1. **Build failures**:
   - Check build logs in Railway dashboard
   - Verify your package.json build scripts are correct
   - Make sure all dependencies are listed in package.json

2. **Next.js Static Site Generation issues**:
   - If you see 404 errors for pages, make sure Next.js is correctly configured for static export
   - Check that the correct backend paths are configured to serve Next.js pages

3. **API connection issues**:
   - Verify that your frontend is using the correct API URL
   - Check CORS settings in your backend

### Viewing Logs

```
railway logs
```

Or view logs in the Railway dashboard under the "Deployments" tab.

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Next.js Static Export Documentation](https://nextjs.org/docs/advanced-features/static-html-export)
- [Express.js Documentation](https://expressjs.com/)

## Support

If you encounter issues with the deployment, please check the Railway documentation or contact Railway support for assistance with platform-specific issues.
