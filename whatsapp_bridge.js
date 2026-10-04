import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { pathToFileURL } from 'node:url';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

async function post(path, body) {
    try {
        const response = await fetch(`${FASTAPI_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.error(`POST ${path} failed:`, err.message);
    }
}

export function phoneNumberFromJid(jid = '') {
    const account = String(jid).split('@')[0].split(':')[0];
    const digits = account.replace(/\D/g, '');
    return digits ? `+${digits}` : '';
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
            const phoneNumber = phoneNumberFromJid(sock.user?.id);
            const displayName = sock.user?.name || '';
            console.log(`WhatsApp bridge ready${phoneNumber ? ` for ${phoneNumber}` : ''}`);
            await post('/api/whatsapp/status', {
                status: 'connected',
                phoneNumber,
                displayName,
            });
        } else if (connection === 'close') {
            const code = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode
                : 0;
            if (code !== DisconnectReason.loggedOut) {
                console.log('Reconnecting...');
                await post('/api/whatsapp/status', { status: 'reconnecting' });
                connect();
            } else {
                console.error('Logged out — delete baileys_auth_info/ and restart');
                await post('/api/whatsapp/status', {
                    status: 'logged_out',
                    phoneNumber: '',
                    displayName: '',
                });
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    connect();
}
