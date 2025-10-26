# Rhetoricall Backend

FastAPI backend application for SMS and WebSocket messaging with AI image generation.

## Features

- FastAPI REST API
- WebSocket support for real-time messaging
- SMS integration via Twilio
- AI image generation via Replicate API
- Background video/image management
- Profanity filtering
- Static file serving

## Environment Setup

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Required environment variables:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `REPLICATE_API_TOKEN`
- Database configuration

## Running Locally

```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Deployment

### Docker

```bash
docker build -t rhetoricall-backend .
docker run -p 8000:8000 rhetoricall-backend
```

### Railway

This project can be deployed on Railway or similar platforms using the provided Dockerfile.

## API Endpoints

- `POST /messages` - Send SMS message
- `POST /upload` - Upload media files
- `POST /display-mode` - Set display mode
- `GET /health` - Health check
- WebSocket at `/ws` - Real-time messaging

## Project Structure

- `main.py` - FastAPI application and routes
- `database.py` - Database operations
- `models.py` - Pydantic models
- `twilio_service.py` - Twilio SMS integration
- `replicate_service.py` - AI image generation
- `background_service.py` - Background management
- `profanity_filter.py` - Content filtering
- `templates/` - HTML templates
- `static/` - Static assets
- `public/` - User uploads
