# Render Deployment Guide for Pixisphere

This guide provides detailed instructions for deploying the Pixisphere application to Render and troubleshooting common issues.

## Deployment Steps

### 1. Repository Setup

1. Push your Pixisphere code to a GitHub repository
2. Ensure your repository includes:
   - `backend/` directory with all backend code
   - `frontend/` directory with all frontend code
   - `render.yaml` blueprint file
   - `DEPLOYMENT.md` documentation

### 2. Render Dashboard Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Review the services that will be created:
   - Web service: `pixisphere-backend`
   - Database: `pixisphere-db`

### 3. Environment Variables

After the services are created, configure these environment variables in the Render dashboard:

**Web Service Environment Variables:**
- `JWT_SECRET` - Your JWT secret key
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `RESEND_API_KEY` - Your Resend API key

Note: These are marked as `sync: false` in render.yaml, meaning you must manually set them in the Render dashboard.

### 4. Database Migration

After deployment completes:

1. Go to your web service in the Render dashboard
2. Click "Connect" → "Shell"
3. Run the migration command:
   ```bash
   npm run db:migrate
   ```

## Monitoring Deployment

### Health Check Endpoint

Use the health check endpoint to monitor your deployment status:

```
https://your-service-name.onrender.com/health
```

A successful response looks like:
```json
{
  "success": true,
  "message": "Pixisphere API is running",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

### Log Monitoring

1. In the Render dashboard, go to your web service
2. Click "Logs" tab to view real-time logs
3. Look for these key log messages:
   - `🚀 Pixisphere API server running on port 10000`
   - `✅ Database connection successful`
   - `📚 API Documentation: https://your-service-name.onrender.com/api-docs`

## Troubleshooting Common Issues

### Database Connection Issues

**Error:** "Database connection refused ::5432"

**Solutions:**
1. Check that your database service is running in Render
2. Verify the database name in render.yaml matches your actual database
3. Ensure DATABASE_URL environment variable is correctly set
4. Check that ipAllowList in render.yaml allows connections (empty list allows all)

### Service Not Starting

**Check logs for:**
- Missing environment variables
- Database connection failures
- Port binding issues

**Solutions:**
1. Verify all required environment variables are set
2. Check that your start command in render.yaml is correct
3. Ensure your application listens on the PORT environment variable provided by Render

### Free Tier Limitations

**Known issues with free tier:**
- Services spin down after 15 minutes of inactivity
- May take longer to start up after sleeping
- Database may have performance limitations

**Solutions:**
- Upgrade to a paid plan for production use
- Implement retry logic in your frontend for API calls
- Use the health check endpoint to verify service status before making API calls

## Post-Deployment Checklist

- [ ] Verify health check endpoint returns success
- [ ] Test user signup and login flows
- [ ] Test partner profile and portfolio management
- [ ] Test client inquiry submission
- [ ] Verify admin dashboard functionality
- [ ] Check that all environment variables are properly set
- [ ] Run database migrations
- [ ] Test file uploads (Cloudinary integration)
- [ ] Test email functionality (Resend integration)

## Useful Render Commands

After connecting to your service via shell:

```bash
# Check current environment
printenv | grep -E "(NODE_ENV|DATABASE_URL)"

# Test database connection
npm run db:test

# Run database migrations
npm run db:migrate

# Check application logs
cat /var/log/render/*.log
```

## Support

If you continue to experience issues:

1. Check the Render status page: https://status.render.com/
2. Review the detailed deployment documentation in `DEPLOYMENT.md`
3. Open an issue in your repository with:
   - Error messages from logs
   - Health check endpoint response
   - Environment variable configuration (without sensitive values)
   - Steps you've already tried
