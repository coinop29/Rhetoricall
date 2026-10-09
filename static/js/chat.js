(() => {
    const form = document.getElementById('message-form');
    const input = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const characterCount = document.getElementById('character-count');
    const status = document.getElementById('form-status');
    const conversation = document.getElementById('conversation');
    const question = document.getElementById('chat-question');

    const applyQuestion = (settings) => {
        if (question && settings?.message?.trim()) question.textContent = settings.message.trim();
    };

    fetch('/api/banner-message')
        .then((response) => response.ok ? response.json() : null)
        .then(applyQuestion)
        .catch(() => {});

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    socket.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'bannerSettingsChanged') applyQuestion(data);
        } catch (_) {}
    });

    const sessionKey = 'rhetorical-chat-session';
    let sessionId = localStorage.getItem(sessionKey);
    if (!sessionId) {
        sessionId = self.crypto?.randomUUID?.() || `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(sessionKey, sessionId);
    }

    const setBusy = (busy) => {
        input.disabled = busy;
        sendButton.disabled = busy;
        sendButton.querySelector('span').textContent = busy ? 'Sending…' : 'Send';
    };

    const appendMessage = (body) => {
        const row = document.createElement('div');
        row.className = 'message-row';
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = body;
        const receipt = document.createElement('span');
        receipt.className = 'message-receipt';
        receipt.textContent = 'Added to the live display ✓';
        row.append(bubble, receipt);
        conversation.appendChild(row);
        row.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    input.addEventListener('input', () => {
        characterCount.textContent = `${input.value.length} / 500`;
        status.textContent = '';
        status.className = 'form-status';
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const body = input.value.trim();
        if (!body) {
            status.textContent = 'Write a message before sending.';
            status.className = 'form-status error';
            input.focus();
            return;
        }

        setBusy(true);
        status.textContent = 'Sending your idea to the display…';
        status.className = 'form-status';

        try {
            const response = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body, session_id: sessionId }),
            });
            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.detail || 'Could not send your message.');
            }

            appendMessage(body);
            input.value = '';
            characterCount.textContent = '0 / 500';
            status.textContent = 'Message sent.';
            status.className = 'form-status success';
        } catch (error) {
            status.textContent = error.message || 'Could not send your message. Please try again.';
            status.className = 'form-status error';
        } finally {
            setBusy(false);
            input.focus();
        }
    });
})();
