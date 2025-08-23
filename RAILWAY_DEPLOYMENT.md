# Railway Deployment Guide

## 🚂 **Required Environment Variables**

Set these in your Railway project dashboard:

### **Required Variables**
```bash
REACT_APP_BACKEND_URL=https://your-backend-domain.com/
REACT_APP_APP_URL=https://your-frontend-domain.com/
REACT_APP_WEBSOCKET_PATH=/ws
```

### **Example Values for Railway**
```bash
# If your backend is on Railway
REACT_APP_BACKEND_URL=https://your-backend-app.up.railway.app/

# If your frontend is on Railway  
REACT_APP_APP_URL=https://your-frontend-app.up.railway.app/

# WebSocket path (usually /ws)
REACT_APP_WEBSOCKET_PATH=/ws
```

### **Important: URL Structure**
- **Frontend**: `https://rhetoricall-production-e792.up.railway.app/`
- **Backend**: `https://rhetoricall-production.up.railway.app/`
- **Static Files**: Served from frontend domain (background videos, models, etc.)
- **WebSocket**: Connects to backend domain

## 🔧 **Railway Configuration**

### **1. Build Command**
```bash
npm run build
```

### **2. Start Command**
```bash
npm start
```

### **3. Port Configuration**
Railway automatically sets `PORT` environment variable.

## 🌐 **Domain Configuration**

### **Frontend Domain**
- Railway will provide: `https://your-app-name.up.railway.app`
- Set this as `REACT_APP_APP_URL`
- This serves your React app and static files

### **Backend Domain**
- Your backend server domain
- Set this as `REACT_APP_BACKEND_URL`
- This handles WebSocket connections and API calls

## 🔌 **WebSocket Configuration**

### **Backend WebSocket Endpoint**
Your backend should serve WebSocket connections at:
```
wss://your-backend-domain.com/ws
```

### **Frontend Connection**
The frontend will automatically connect to:
```
wss://your-backend-domain.com/ws
```

## 📱 **Static Files**

### **Public Assets**
- `favicon.ico` - Should be served from `/public/`
- `manifest.json` - Should be served from `/public/`
- Background videos - Should be served from `/public/backgroundvideos/`

### **File Structure**
```
public/
├── favicon.ico
├── manifest.json
├── backgroundvideos/
│   ├── grid2.mp4
│   └── other-videos.mp4
└── models/
    └── *.glb files
```

## 🚨 **Common Issues & Solutions**

### **1. WebSocket Connection Failed**
- Check `REACT_APP_BACKEND_URL` is correct
- Verify backend is running and accessible
- Check WebSocket path configuration
- Ensure backend serves WebSocket at `/ws` endpoint

### **2. 502 Errors on Static Files**
- Ensure files exist in `/public/` directory
- Check Railway static file serving configuration
- Verify file paths in your code
- Static files should be served from frontend domain

### **3. Environment Variables Not Working**
- Variables must start with `REACT_APP_`
- Redeploy after changing environment variables
- Check Railway logs for errors

### **4. Background Video Loading Issues**
- Videos should load from frontend domain (`REACT_APP_APP_URL`)
- Check that video files exist in `/public/backgroundvideos/`
- Verify `generateVideoURL` function is working correctly

### **5. npm ci Build Failures**
If you encounter `npm ci` failures during build:

#### **Solution A: Use .npmrc Configuration**
The project includes a `.npmrc` file with:
```bash
legacy-peer-deps=true
strict-peer-dependencies=false
auto-install-peers=true
```

#### **Solution B: Use package-docker.json**
For Railway builds, you can temporarily rename:
```bash
mv package.json package.json.backup
mv package-docker.json package.json
```

#### **Solution C: Clear npm Cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📋 **Deployment Checklist**

- [ ] Set all required environment variables
- [ ] Verify backend is accessible
- [ ] Check WebSocket endpoint is working
- [ ] Ensure static files are in `/public/`
- [ ] Deploy and test functionality
- [ ] Check Railway logs for errors
- [ ] If build fails, try npm ci solutions above
- [ ] Verify background videos load correctly
- [ ] Test WebSocket connection

## 🔍 **Debugging**

### **Check Environment Variables**
```javascript
// In browser console
console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
console.log('App URL:', process.env.REACT_APP_APP_URL);
```

### **Check WebSocket Connection**
```javascript
// In browser console
// Look for connection logs in console
```

### **Check Railway Logs**
- Go to Railway dashboard
- Check deployment logs
- Look for build errors

### **npm ci Troubleshooting**
If build continues to fail:
1. Check Railway logs for specific error messages
2. Try using `package-docker.json` temporarily
3. Verify all dependencies are compatible
4. Consider using `npm install` instead of `npm ci` in Railway

### **URL Debugging**
```javascript
// Check current configuration
console.log('Current config:', config);
console.log('Background URI:', backgroundUri);
console.log('Generated video URL:', generateVideoURL(backgroundUri));
```
