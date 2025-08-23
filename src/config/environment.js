// Environment configuration with fallbacks for production
const config = {
  // Backend URL - with fallback for production
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 
                (window.location.hostname === 'localhost' ? 'http://localhost:3001/' : 
                 `https://${window.location.hostname}/`),
  
  // App URL - with fallback for production
  APP_URL: process.env.REACT_APP_APP_URL || 
           (window.location.hostname === 'localhost' ? 'http://localhost:3000/' : 
            `https://${window.location.hostname}/`),
  
  // Video Server URL - use the dedicated video server
  VIDEO_SERVER: process.env.REACT_APP_VIDEO_SERVER || 'https://rhetoricall.site/backgroundvideos',
  
  // WebSocket configuration - use the configured path
  WEBSOCKET_PATH: process.env.REACT_APP_WEBSOCKET_PATH || '/ws',
  
  // Environment detection - fix for Railway deployment
  IS_PRODUCTION: process.env.NODE_ENV === 'production' || window.location.hostname.includes('railway.app'),
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development' && !window.location.hostname.includes('railway.app')
};

// Log configuration in development
if (config.IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', config);
}

export default config;
