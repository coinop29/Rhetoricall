# 🚂 Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **Environment Variables**: Prepare your API keys and database connections

## 🚀 Step-by-Step Deployment

### 1. Connect Your Repository

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo" (or your preferred Git provider)
4. Choose your repository: `rhetorical_backend`
5. Select the branch you want to deploy (usually `main` or `master`)

### 2. Configure Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add these environment variables:

```bash
# Database Configuration
DB_URL=your_mongodb_connection_string_here

# Twilio Configuration  
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here

# Replicate Configuration
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Server Configuration
PORT=5000
NODE_ENV=production
```

**Important Notes:**
- Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string
- Replace `your_twilio_account_sid_here` and `your_twilio_auth_token_here` with your Twilio credentials
- Replace `your_replicate_api_token_here` with your Replicate API token
- Railway will automatically set `PORT` and `NODE_ENV`, but you can override them

### 3. Deploy

1. Railway will automatically detect your Node.js project
2. It will install dependencies and build your project
3. The deployment will start automatically
4. You can monitor the build logs in real-time

### 4. Configure Custom Domain (Optional)

1. Go to the "Settings" tab in your Railway project
2. Click "Custom Domains"
3. Add your domain and configure DNS settings

## 🔧 Configuration Files

### railway.json
This file tells Railway how to build and deploy your app:
- Uses NIXPACKS builder for automatic dependency detection
- Sets health check endpoint to `/`
- Configures restart policies

### .railwayignore
Excludes unnecessary files from deployment:
- Development dependencies
- Test files
- Log files
- Environment files

## 📊 Monitoring & Logs

### View Logs
1. Go to your project dashboard
2. Click on the deployment
3. View real-time logs

### Health Checks
- Railway automatically checks your `/` endpoint
- If it returns a 200 status, your app is healthy
- Failed health checks trigger automatic restarts

## 🔄 Updating Your App

### Automatic Deployments
- Every push to your connected branch triggers a new deployment
- Railway automatically builds and deploys changes
- Zero-downtime deployments

### Manual Deployments
1. Go to your project dashboard
2. Click "Deploy" button
3. Select the commit you want to deploy

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- Check that all dependencies are in `package.json`
- Ensure `start` script exists and works
- Verify Node.js version compatibility

#### Runtime Errors
- Check environment variables are set correctly
- Review application logs in Railway dashboard
- Verify database connections

#### Port Issues
- Railway automatically sets the `PORT` environment variable
- Your app should use `process.env.PORT` (which it already does)

### Debug Commands

Add these to your package.json for debugging:
```json
{
  "scripts": {
    "debug": "node --inspect index.js",
    "logs": "railway logs"
  }
}
```

## 🌐 Post-Deployment

### Update Twilio Webhooks
1. Go to your Twilio console
2. Update webhook URLs to point to your Railway domain:
   - SMS: `https://your-app.railway.app/api/messageIncoming`
   - WhatsApp: `https://your-app.railway.app/api/whatsAppMessageIncoming`

### Test Your Endpoints
```bash
# Test display mode
curl https://your-app.railway.app/api/display-mode

# Test image generation
curl -X POST https://your-app.railway.app/api/test-image-generation \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A beautiful sunset"}'
```

### Monitor Performance
- Use Railway's built-in metrics
- Monitor response times and error rates
- Set up alerts for critical issues

## 💰 Cost Optimization

### Railway Pricing
- **Hobby Plan**: $5/month for basic usage
- **Pro Plan**: $20/month for production apps
- **Enterprise**: Custom pricing for large deployments

### Optimization Tips
- Use text mode during low-traffic periods
- Monitor Replicate API usage
- Set up cost alerts

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Configure CORS properly for production
3. **Rate Limiting**: Consider adding rate limiting for public endpoints
4. **HTTPS**: Railway automatically provides HTTPS

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Community**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: Check your project's issue tracker

## 🎉 Success!

Once deployed, your app will be available at:
`https://your-app-name.railway.app`

Your backend now supports:
- ✅ Text-to-image generation with Replicate
- ✅ Toggle between text and image modes
- ✅ Real-time updates via Socket.IO
- ✅ Twilio webhook integration
- ✅ MongoDB data persistence
- ✅ Production-ready deployment
