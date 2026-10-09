# Rhetorical

Rhetorical is a QR-powered audience chat and live 3D message visualization. A display shows a QR code, guests scan it to open the mobile chat, and submitted ideas are stored in MongoDB and broadcast to the display over WebSockets.

## User flow

1. Open `/` on the shared display.
2. Scan the banner QR code with a phone.
3. The QR opens `/chat` on the same deployment.
4. Submit an idea from the chat composer.
5. The API saves it to the existing `sms.items` Mongo collection and broadcasts it to connected displays.

Banner Settings updates the question on both the display and open mobile chat screens. Background Video lets the display operator choose a bundled video, enter a direct HTTPS video URL, or upload a video to Cloudinary.

## Setup

Copy `.env.example` to `.env` and set `DB_URL` plus the credentials for the selected image provider.

```bash
cp .env.example .env
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Open `http://localhost:8000` for the display or `http://localhost:8000/chat` for the chat.

## Render

- App: https://rhetoricall.onrender.com
- Dashboard: https://dashboard.render.com/web/srv-d6a5huvpm1nc739rjs8g
- Build command: `pip install -r requirements.txt`
- Start command: `sh start.sh`
- Health check: `/health`

## API

- `POST /api/chat/messages` saves and broadcasts a web chat message.
- `GET /api/messages` returns recent saved messages.
- `GET|POST /api/display-mode` reads or changes text/image mode.
- `GET|POST /api/banner-message` reads or changes banner settings.
- `GET|POST /api/background-video` reads or changes the selected background.
- `GET /api/background-videos` lists uploaded and bundled videos.
- `POST /api/background-video/upload` uploads a background video.
- `POST /api/delete-message` removes a moderated message.
- `GET /health` reports service health.
- `WS /ws` delivers live display updates.
