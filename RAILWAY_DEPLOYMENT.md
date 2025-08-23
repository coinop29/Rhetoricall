# Railway Deployment Guide

## 🚂 **Required Environment Variables**

Set these in your Railway project dashboard:

### **Required Variables**
```bash
REACT_APP_BACKEND_URL=https://your-backend-domain.com/
REACT_APP_APP_URL=https://your-frontend-domain.com/
REACT_APP_WEBSOCKET_PATH=/ws
```

### **Example Values**
```bash
# If your backend is on Railway
REACT_APP_BACKEND_URL=https://your-backend-app.up.railway.app/

# If your frontend is on Railway  
REACT_APP_APP_URL=https://your-frontend-app.up.railway.app/

# WebSocket path (usually /ws)
REACT_APP_WEBSOCKET_PATH=/ws
```

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

### **Backend Domain**
- Your backend server domain
- Set this as `REACT_APP_BACKEND_URL`

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

### **2. 502 Errors on Static Files**
- Ensure files exist in `/public/` directory
- Check Railway static file serving configuration
- Verify file paths in your code

### **3. Environment Variables Not Working**
- Variables must start with `REACT_APP_`
- Redeploy after changing environment variables
- Check Railway logs for errors

## 📋 **Deployment Checklist**

- [ ] Set all required environment variables
- [ ] Verify backend is accessible
- [ ] Check WebSocket endpoint is working
- [ ] Ensure static files are in `/public/`
- [ ] Deploy and test functionality
- [ ] Check Railway logs for errors

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
