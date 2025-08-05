# Pixisphere Marketplace Deployment Guide

This guide provides instructions for deploying the Pixisphere Marketplace application on both Renderer (for the backend) and Vercel (for the frontend).

## Project Structure

The project consists of two main parts:

1. **Frontend** (React + Vite) - Located in the `/frontend` directory
2. **Backend** (Node.js + Express) - Located in the `/backend` directory

## Prerequisites

Before deploying, ensure you have:

1. Accounts on both Renderer and Vercel
2. A PostgreSQL database (can be hosted on Render, Supabase, or any other provider)
3. Environment variables ready for both frontend and backend

## Backend Deployment on Renderer

### 1. Prepare Environment Variables

Create a `.env` file in the `/backend` directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT Configuration
JWT_SECRET=your-very-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend Configuration (for OTP emails)
RESEND_API_KEY=your_resend_api_key

# Mock Services (set to false for production)
MOCK_OTP_ENABLED=false
MOCK_FILE_UPLOAD=false
```

### 2. Create a Render Blueprint (render.yaml)

Create a `render.yaml` file in the root directory of your project:

```yaml
services:
  - type: web
    name: pixisphere-backend
    env: node
    plan: starter
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: pixisphere-db
          property: connectionString
      - key: JWT_SECRET
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
      - key: RESEND_API_KEY
        sync: false

databases:
  - name: pixisphere-db
    plan: starter
    ipAllowList: []
```

### 3. Deploy to Renderer

1. Push your code to a GitHub repository
2. Go to [Renderer Dashboard](https://dashboard.render.com/)
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - Name: `pixisphere-backend`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
   - Plan: Choose based on your needs (starter is fine for development)
6. Add environment variables in the Renderer dashboard
7. Click "Create Web Service"

### 4. Database Migration

After deployment, you'll need to run database migrations:

1. Install the Render CLI: `npm install -g render-cli`
2. Login to Render: `render login`
3. Run migrations: `render run -s pixisphere-backend npm run db:migrate`

## Frontend Deployment on Vercel

### 1. Prepare Environment Variables

Create a `.env.production` file in the `/frontend` directory:

```
VITE_API_URL=https://your-renderer-backend-url.onrender.com/api
```

Replace `your-renderer-backend-url.onrender.com` with your actual Renderer backend URL.

### 2. Deploy to Vercel

1. Push your code to a GitHub repository (if not already done)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Add environment variables in the Vercel dashboard
7. Click "Deploy"

### 3. Environment Variables in Vercel

In the Vercel dashboard, go to your project settings and add the environment variable:

- Key: `VITE_API_URL`
- Value: `https://your-renderer-backend-url.onrender.com/api`

## Post-Deployment Steps

1. Verify both services are running correctly
2. Test the API endpoints using a tool like Postman
3. Test the frontend by visiting your Vercel deployment URL
4. Check the browser console for any errors
5. Verify that the frontend can communicate with the backend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend is configured to accept requests from your Vercel frontend domain
2. **Environment Variables Not Set**: Double-check all environment variables in both Renderer and Vercel dashboards
3. **Database Connection**: Verify your database URL and credentials
4. **Build Failures**: Check the build logs in both platforms for specific error messages

### Database Connection Refused Error

If you're getting a "Database connection refused ::5432" error, this typically means your application cannot connect to the PostgreSQL database. Here's how to resolve it:

1. **Check Database URL Format**: Ensure your DATABASE_URL follows the correct format:
   ```
   postgresql://username:password@host:port/database_name
   ```

2. **Verify Database Service**: Make sure your PostgreSQL database is running and accessible from your Render web service.

3. **Check Database Credentials**: Confirm that the username, password, and database name are correct.

4. **Network Access**: Ensure your database allows connections from Render's IP addresses.

5. **Using Render's Database**: If you're using Render's built-in PostgreSQL database, make sure:
   - The database service is created and running
   - The database name in your render.yaml matches the actual database name
   - You're using the correct connection string from the Render dashboard

6. **Environment Variables**: Double-check that DATABASE_URL is properly set in your Render environment variables.

7. **Test Connection Locally**: Try connecting to your database using the same credentials from your local machine to verify they're correct.

8. **Render Free Tier Limitations**: If you're using Render's free tier:
   - Web services spin down after 15 minutes of inactivity
   - Database services may also have limitations
   - Consider upgrading to a paid plan for production use
   - Use the health check endpoint to monitor service status

### Useful Commands

```bash
# Test backend locally
cd backend
npm install
npm run dev

# Test frontend locally
cd frontend
npm install
npm run dev

# Build frontend
npm run build

# Preview build locally
npm run preview

# Check backend health (useful for debugging deployment issues)
curl http://localhost:3000/health
```

### Monitoring Deployment Issues

After deploying to Render, use the health check endpoint to monitor your application status:

1. Visit your backend health check endpoint:
   `https://your-renderer-backend-url.onrender.com/health`

2. The response will show:
   - Application status
   - Database connection status
   - Environment information

3. If the database shows as "disconnected" or "error", check:
   - DATABASE_URL environment variable
   - Database credentials
   - Network connectivity between Render services
   - Database service status in Render dashboard

## Scaling Considerations

For production deployment, consider:

1. Upgrading from starter plans on Renderer for better performance
2. Setting up custom domains
3. Configuring SSL certificates
4. Setting up monitoring and logging
5. Implementing proper backup strategies for your database

## Additional Resources

- [Renderer Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Pixisphere API Documentation](http://localhost:3000/api-docs) (available when backend is running)
