# Rhetorical Backend - FastAPI Version

This is the FastAPI conversion of the original Node.js Express application for the Rhetorical SMS visualization server.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs with Python
- **Async/Await**: Full async support for better performance
- **WebSocket Support**: Real-time communication for live updates
- **MongoDB Integration**: Using Motor (async MongoDB driver)
- **Twilio Integration**: SMS and WhatsApp message handling
- **Replicate Integration**: AI image generation from text
- **File Upload**: Background video upload functionality
- **Profanity Filtering**: Text cleaning and filtering
- **CORS Support**: Cross-origin resource sharing
- **Static File Serving**: Serve uploaded files and assets

## Installation

1. **Clone the repository** (if not already done)
2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

4. **Run the application**:
   ```bash
   # Development
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Production
   python main.py
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_URL` | MongoDB connection string | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Yes |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | Yes |
| `REPLICATE_API_TOKEN` | Replicate API token | Yes |
| `PORT` | Server port (default: 8000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `REACT_APP_BACKEND_URL` | Backend URL for frontend | No |

## API Endpoints

### Core Endpoints
- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /ws` - WebSocket endpoint info

### Message Handling
- `POST /api/messageIncoming` - Handle incoming SMS messages
- `POST /api/whatsAppMessageIncoming` - Handle incoming WhatsApp messages

### Display Mode
- `GET /api/display-mode` - Get current display mode
- `POST /api/display-mode` - Set display mode (text/image)

### Image Generation
- `POST /api/test-image-generation` - Test image generation

### Background Management
- `POST /api/upload` - Upload background video
- `GET /api/backgrounds` - Get all backgrounds
- `GET /api/getBackgroundsFromExternalServer` - Fetch external backgrounds
- `POST /api/set_default` - Set default background
- `GET /api/get_default` - Get default background
- `POST /api/delete` - Delete background

### Twilio Integration
- `POST /api/load` - Load Twilio data

## WebSocket Events

### Client to Server
- `setDisplayMode` - Change display mode
- `history` - Update history

### Server to Client
- `displayModeChanged` - Display mode changed
- `historyChanged` - History updated
- `messageIncoming` - New message received

## Docker Deployment

1. **Build the image**:
   ```bash
   docker build -t rhetorical-backend .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8000:8000 --env-file .env rhetorical-backend
   ```

## Differences from Node.js Version

### Improvements
- **Better Performance**: FastAPI is generally faster than Express
- **Type Safety**: Pydantic models provide runtime type checking
- **Auto Documentation**: Automatic OpenAPI/Swagger documentation
- **Async by Default**: Better handling of concurrent requests
- **Modern Python**: Uses Python 3.11+ features

### Key Changes
- **Database**: Motor instead of Mongoose
- **WebSocket**: Native FastAPI WebSocket instead of Socket.IO
- **Validation**: Pydantic instead of Joi
- **File Upload**: FastAPI's built-in file upload
- **Error Handling**: FastAPI's exception handling

## Development

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Structure
```
├── main.py                 # Main FastAPI application
├── models.py              # Pydantic models
├── database.py            # Database operations
├── twilio_service.py      # Twilio integration
├── replicate_service.py   # Replicate AI integration
├── profanity_filter.py    # Text filtering
├── background_service.py  # Background video management
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
└── README_FASTAPI.md     # This file
```

## Migration Notes

When migrating from the Node.js version:

1. **Environment Variables**: Same variables, but ensure Python compatibility
2. **Database**: Same MongoDB database, no migration needed
3. **Frontend**: Should work with minimal changes
4. **WebSocket**: Update frontend to use native WebSocket instead of Socket.IO
5. **File Uploads**: Update frontend to use standard multipart/form-data

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure `DB_URL` is correct and MongoDB is running
2. **Twilio Errors**: Verify credentials and phone number format
3. **Replicate Errors**: Check API token and model availability
4. **File Upload**: Ensure `public/` directory exists and is writable
5. **WebSocket**: Check CORS settings and WebSocket URL

### Logs
The application logs to stdout. For production, consider using a logging service or file-based logging.

## Performance

FastAPI provides significant performance improvements over Express:
- **Request Handling**: ~3x faster for JSON APIs
- **Concurrency**: Better async handling
- **Memory Usage**: More efficient memory management
- **Startup Time**: Faster application startup

## Security

- **Input Validation**: Pydantic models validate all inputs
- **CORS**: Configurable CORS settings
- **Environment Variables**: Sensitive data in environment variables
- **File Upload**: Secure file handling with validation

## Contributing

1. Follow Python PEP 8 style guidelines
2. Use type hints for all functions
3. Add docstrings for all public functions
4. Write tests for new features
5. Update documentation as needed
