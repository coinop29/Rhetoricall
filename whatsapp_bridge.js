import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

async function post(path, body) {
    try {
        await fetch(`${FASTAPI_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch (err) {
        console.error(`POST ${path} failed:`, err.message);
    }
}

async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');

    const sock = makeWASocket({ auth: state });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('QR received — check the app UI to scan');
            await post('/api/whatsapp/qr', { qr });
        }

        if (connection === 'open') {
            console.log('WhatsApp bridge ready');
            await post('/api/whatsapp/status', { status: 'connected' });
        } else if (connection === 'close') {
            await post('/api/whatsapp/status', { status: 'disconnected' });
            const code = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode
                : 0;
            if (code !== DisconnectReason.loggedOut) {
                console.log('Reconnecting...');
                connect();
            } else {
                console.error('Logged out — delete baileys_auth_info/ and restart');
                await post('/api/whatsapp/status', { status: 'logged_out' });
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;
            if (msg.key.remoteJid?.endsWith('@g.us')) continue;

            const body =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                '';
            if (!body) continue;

            const params = new URLSearchParams({
                Body: body,
                From: msg.key.remoteJid,
                To: 'whatsapp-bridge',
                SmsSid: msg.key.id,
            });

            try {
                const res = await fetch(`${FASTAPI_URL}/api/whatsAppMessageIncoming`, {
                    method: 'POST',
                    body: params,
                });
                const xml = await res.text();
                const match = xml.match(/<Message>([\s\S]*?)<\/Message>/);
                if (match) {
                    await sock.sendMessage(msg.key.remoteJid, { text: match[1].trim() });
                }
            } catch (err) {
                console.error('Failed to forward message:', err.message);
            }
        }
    });
}

connect();
