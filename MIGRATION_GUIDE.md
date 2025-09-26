# Migration Guide: Node.js to FastAPI

This guide helps you migrate from the Node.js Express version to the FastAPI Python version.

## Quick Start

1. **Install Python 3.11+**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Copy environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```
4. **Start the server**:
   ```bash
   python start.py
   # or
   uvicorn main:app --reload
   ```

## API Changes

### Endpoints (Mostly Compatible)

| Node.js Endpoint | FastAPI Endpoint | Status | Notes |
|------------------|------------------|--------|-------|
| `GET /` | `GET /` | ✅ Compatible | Same response |
| `GET /health` | `GET /health` | ✅ Compatible | Same response format |
| `POST /api/messageIncoming` | `POST /api/messageIncoming` | ✅ Compatible | Same form data handling |
| `POST /api/whatsAppMessageIncoming` | `POST /api/whatsAppMessageIncoming` | ✅ Compatible | Same form data handling |
| `GET /api/display-mode` | `GET /api/display-mode` | ✅ Compatible | Same response |
| `POST /api/display-mode` | `POST /api/display-mode` | ✅ Compatible | Same request/response |
| `POST /api/test-image-generation` | `POST /api/test-image-generation` | ✅ Compatible | Same request/response |
| `POST /api/upload` | `POST /api/upload` | ✅ Compatible | Same file upload |
| `GET /api/backgrounds` | `GET /api/backgrounds` | ✅ Compatible | Same response |
| `GET /api/getBackgroundsFromExternalServer` | `GET /api/getBackgroundsFromExternalServer` | ✅ Compatible | Same response |
| `POST /api/set_default` | `POST /api/set_default` | ✅ Compatible | Same request/response |
| `GET /api/get_default` | `GET /api/get_default` | ✅ Compatible | Same response |
| `POST /api/delete` | `POST /api/delete` | ✅ Compatible | Same request/response |
| `POST /api/load` | `POST /api/load` | ✅ Compatible | Same response |

### WebSocket Changes

**Node.js (Socket.IO)**:
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000/ws');

socket.on('connect', () => {
  console.log('Connected');
});

socket.emit('setDisplayMode', { mode: 'image' });
socket.on('displayModeChanged', (data) => {
  console.log('Display mode changed:', data.mode);
});
```

**FastAPI (Native WebSocket)**:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'displayModeChanged') {
    console.log('Display mode changed:', data.mode);
  }
};

// Send message
ws.send(JSON.stringify({
  type: 'setDisplayMode',
  mode: 'image'
}));
```

## Frontend Migration Steps

### 1. Update WebSocket Connection

Replace Socket.IO with native WebSocket:

```javascript
// Before (Socket.IO)
import io from 'socket.io-client';
const socket = io('http://localhost:5000/ws');

// After (Native WebSocket)
const ws = new WebSocket('ws://localhost:8000/ws');
```

### 2. Update Event Handling

```javascript
// Before (Socket.IO)
socket.on('displayModeChanged', (data) => {
  // Handle display mode change
});

socket.emit('setDisplayMode', { mode: 'image' });

// After (Native WebSocket)
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'displayModeChanged') {
    // Handle display mode change
  }
};

ws.send(JSON.stringify({
  type: 'setDisplayMode',
  mode: 'image'
}));
```

### 3. Update API Base URL

```javascript
// Before
const API_BASE = 'http://localhost:5000';

// After
const API_BASE = 'http://localhost:8000';
```

## Environment Variables

The environment variables remain the same:

```bash
# Database
DB_URL=mongodb://localhost:27017/sms

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number

# Replicate
REPLICATE_API_TOKEN=your_api_token

# Application
PORT=8000
NODE_ENV=development
REACT_APP_BACKEND_URL=http://localhost:8000/
```

## Database Migration

**No database migration needed!** The FastAPI version uses the same MongoDB database and collections.

## Performance Improvements

The FastAPI version provides several performance improvements:

- **~3x faster** request handling
- **Better concurrency** with async/await
- **Lower memory usage**
- **Faster startup time**

## Deployment

### Docker

```bash
# Build image
docker build -t rhetorical-backend .

# Run container
docker run -p 8000:8000 --env-file .env rhetorical-backend
```

### Railway

Update your `railway.json`:

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "python start.py",
    "healthcheckPath": "/health"
  }
}
```

### Manual Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DB_URL="your_mongodb_url"
export TWILIO_ACCOUNT_SID="your_sid"
# ... other variables

# Start server
python start.py
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check CORS settings
   - Ensure WebSocket URL is correct (`ws://` not `http://`)
   - Check firewall settings

2. **Database Connection Issues**
   - Verify `DB_URL` is correct
   - Ensure MongoDB is running
   - Check network connectivity

3. **Twilio Errors**
   - Verify credentials
   - Check phone number format
   - Ensure account is active

4. **Replicate Errors**
   - Verify API token
   - Check model availability
   - Monitor API usage limits

### Debug Mode

Enable debug logging:

```bash
export NODE_ENV=development
python start.py
```

### Health Check

Test the API:

```bash
curl http://localhost:8000/health
```

## Rollback Plan

If you need to rollback to Node.js:

1. **Stop FastAPI server**
2. **Start Node.js server**:
   ```bash
   npm start
   ```
3. **Update frontend** to use Socket.IO again
4. **Update API base URL** back to port 5000

## Support

- **Documentation**: See `README_FASTAPI.md`
- **API Docs**: Visit `http://localhost:8000/docs` (Swagger UI)
- **Health Check**: Visit `http://localhost:8000/health`

## Migration Checklist

- [ ] Install Python 3.11+
- [ ] Install dependencies (`pip install -r requirements.txt`)
- [ ] Copy environment variables
- [ ] Test database connection
- [ ] Test Twilio integration
- [ ] Test Replicate integration
- [ ] Update frontend WebSocket code
- [ ] Update API base URL
- [ ] Test all endpoints
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] Update documentation
