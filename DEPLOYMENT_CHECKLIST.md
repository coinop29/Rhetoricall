# 🚀 Railway Deployment Checklist

## ✅ Pre-Deployment

- [ ] **Git Repository**: Code is committed and pushed to GitHub/GitLab
- [ ] **Railway Account**: Created and verified at [railway.app](https://railway.app)
- [ ] **API Keys Ready**: 
  - [ ] Replicate API token
  - [ ] Twilio Account SID and Auth Token
  - [ ] MongoDB connection string
- [ ] **Local Testing**: App runs successfully with `npm start`

## 🚂 Railway Setup

- [ ] **New Project**: Created new Railway project
- [ ] **Repository Connected**: Linked to your Git repository
- [ ] **Branch Selected**: Chose correct branch (main/master)
- [ ] **Environment Variables Set**:
  - [ ] `DB_URL`
  - [ ] `TWILIO_ACCOUNT_SID`
  - [ ] `TWILIO_AUTH_TOKEN`
  - [ ] `REPLICATE_API_TOKEN`
  - [ ] `NODE_ENV=production`

## 🔧 Configuration Files

- [ ] **railway.json**: Created with proper configuration
- [ ] **.railwayignore**: Excludes unnecessary files
- [ ] **package.json**: Has correct `start` script
- [ ] **Port Configuration**: Uses `process.env.PORT`

## 🚀 Deploy

- [ ] **Build Success**: Railway successfully builds the project
- [ ] **Deployment Complete**: App is running and healthy
- [ ] **Health Check**: `/` endpoint returns 200 status
- [ ] **Domain**: Note your Railway app URL

## 🌐 Post-Deployment

- [ ] **Test Endpoints**:
  - [ ] `GET /api/display-mode`
  - [ ] `POST /api/display-mode`
  - [ ] `POST /api/test-image-generation`
- [ ] **Update Twilio Webhooks**:
  - [ ] SMS: `https://your-app.railway.app/api/messageIncoming`
  - [ ] WhatsApp: `https://your-app.railway.app/api/whatsAppMessageIncoming`
- [ ] **Test Twilio Integration**: Send test message
- [ ] **Monitor Logs**: Check Railway dashboard for errors

## 🔍 Testing

- [ ] **Display Mode Toggle**: Switch between text and image modes
- [ ] **Image Generation**: Test with Replicate API
- [ ] **Socket.IO**: Real-time updates working
- [ ] **Database**: Messages being stored correctly
- [ ] **Error Handling**: Fallback images working

## 📊 Monitoring

- [ ] **Health Checks**: App responding to Railway health checks
- [ ] **Performance**: Response times acceptable
- [ ] **Error Rates**: Low error rates in logs
- [ ] **Cost Monitoring**: Track Replicate API usage

## 🎯 Success Criteria

- [ ] App accessible via Railway URL
- [ ] All API endpoints responding
- [ ] Twilio webhooks working
- [ ] Image generation functional
- [ ] Mode toggle working
- [ ] Real-time updates via Socket.IO
- [ ] Database persistence working

## 🚨 Troubleshooting

If deployment fails:
1. Check Railway build logs
2. Verify environment variables
3. Test locally with production env vars
4. Check package.json scripts
5. Verify Node.js version compatibility

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Project Issues**: Check your repository's issue tracker

---

**🎉 Ready to Deploy!** 

Your backend is now production-ready with:
- Text-to-image generation
- Toggle functionality
- Real-time updates
- Twilio integration
- MongoDB persistence
