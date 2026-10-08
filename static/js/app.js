class App {
    constructor() {
        this.currentDisplayMode = 'image';
        this.messageHistory = [];
        this.scene3D = null;
        this.currentTextColor = '#2F24C1';
        this.randomizeColors = false;
        this.defaultBannerFontFamily = 'Orbitron';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupWebSocketHandlers();
        this.renderChatQR();
        await Promise.allSettled([this.loadBannerSettings(), this.loadMessageHistory(), this.init3DScene()]);
        this.updateDisplayModeUI();
    }

    async init3DScene() {
        if (typeof Scene3DManager === 'undefined') return;
        try {
            this.scene3D = new Scene3DManager('app');
        } catch (error) {
            console.error('Could not initialize 3D scene:', error);
        }
    }

    renderChatQR() {
        const container = document.getElementById('banner-qr-code');
        if (!container || typeof QRCode === 'undefined') return;
        container.innerHTML = '';
        const chatUrl = new URL('/chat', window.location.origin).href;
        new QRCode(container, { text: chatUrl, width: 104, height: 104, correctLevel: QRCode.CorrectLevel.M });
        container.title = chatUrl;
    }

    setupEventListeners() {
        document.getElementById('toggle-mode')?.addEventListener('click', () => this.toggleDisplayMode());
        document.getElementById('show-history')?.addEventListener('click', () => this.showMessageHistory());
        document.getElementById('close-history')?.addEventListener('click', () => this.hideMessageHistory());
        document.getElementById('banner-settings')?.addEventListener('click', () => this.showBannerSettings());
        document.getElementById('close-banner-settings')?.addEventListener('click', () => this.hideBannerSettings());
        document.getElementById('preview-banner')?.addEventListener('click', () => this.previewBanner());
        document.getElementById('save-banner')?.addEventListener('click', () => this.saveBannerSettings());
        document.getElementById('close-notification')?.addEventListener('click', () => this.hideNotification());

        document.getElementById('text-color')?.addEventListener('input', (event) => {
            this.currentTextColor = event.target.value;
        });
        document.getElementById('randomize-colors')?.addEventListener('change', (event) => {
            this.randomizeColors = event.target.checked;
        });

        document.addEventListener('keydown', (event) => {
            if ((event.key === 'h' || event.key === 'H') && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
                const controls = document.getElementById('controls');
                const chip = document.getElementById('display-mode-chip');
                const shouldShow = controls?.style.display === 'none';
                if (controls) controls.style.display = shouldShow ? 'flex' : 'none';
                if (chip) chip.style.display = shouldShow ? 'block' : 'none';
            }
        });
    }

    setupWebSocketHandlers() {
        if (!window.wsManager) return;
        window.wsManager.onMessage('messageIncoming', (data) => this.handleIncomingMessage(data.filtered));
        window.wsManager.onMessage('displayModeChanged', (data) => {
            this.currentDisplayMode = data.mode;
            this.updateDisplayModeUI();
        });
        window.wsManager.onMessage('messageRemoved', (data) => this.applyMessageRemoval(data));
        window.wsManager.onMessage('bannerSettingsChanged', (data) => this.applyBannerSettings(data));
        window.wsManager.onConnection('connect', () => this.showNotification('Display connected', 'success'));
        window.wsManager.onConnection('disconnect', () => this.showNotification('Display reconnecting…', 'error'));
    }

    async loadMessageHistory() {
        try {
            const response = await fetch('/api/messages?limit=100');
            if (!response.ok) return;
            const data = await response.json();
            this.messageHistory = (data.messages || []).reverse();
        } catch (error) {
            console.warn('Could not load message history:', error);
        }
    }

    handleIncomingMessage(message) {
        if (!message) return;
        this.messageHistory.push(message);
        this.addFloatingMessage(message);
        this.showNotification('New idea received', 'success');
    }

    addFloatingMessage(message) {
        const color = this.randomizeColors ? this.generateRandomColor() : this.currentTextColor;
        if (this.scene3D?.font) {
            this.scene3D.addFloatingMessage({ ...message, textColor: color });
            return;
        }

        const container = document.getElementById('floating-messages');
        const bubble = document.createElement('div');
        bubble.className = 'floating-message text';
        bubble.textContent = this.truncateToWords(message.filtered || message.body || '', 8);
        bubble.style.left = `${Math.random() * Math.max(20, window.innerWidth - 320)}px`;
        container?.appendChild(bubble);
    }

    async toggleDisplayMode() {
        const mode = this.currentDisplayMode === 'text' ? 'image' : 'text';
        try {
            const response = await fetch('/api/display-mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
            });
            if (!response.ok) throw new Error('Mode update failed');
            this.currentDisplayMode = mode;
            this.updateDisplayModeUI();
        } catch (error) {
            this.showNotification('Could not change display mode', 'error');
        }
    }

    updateDisplayModeUI() {
        const chip = document.getElementById('display-mode-chip');
        const modeText = document.getElementById('mode-text');
        const button = document.getElementById('toggle-mode');
        if (modeText) modeText.textContent = `Mode: ${this.currentDisplayMode.toUpperCase()}`;
        if (chip) chip.className = `mode-chip ${this.currentDisplayMode}-mode`;
        if (button) button.textContent = `Switch to ${this.currentDisplayMode === 'text' ? 'Image' : 'Text'} Mode`;
    }

    showMessageHistory() {
        const panel = document.getElementById('message-history');
        const content = document.getElementById('history-content');
        if (!panel || !content) return;
        content.innerHTML = '';
        if (!this.messageHistory.length) {
            content.textContent = 'No messages yet.';
        } else {
            this.messageHistory.slice(-25).reverse().forEach((message) => content.appendChild(this.createHistoryItem(message)));
        }
        panel.classList.remove('hidden');
    }

    hideMessageHistory() {
        document.getElementById('message-history')?.classList.add('hidden');
    }

    createHistoryItem(message) {
        const item = document.createElement('article');
        item.className = 'message-item';
        const header = document.createElement('div');
        header.className = 'message-item-header';
        const meta = document.createElement('span');
        meta.className = 'message-meta';
        const date = message.created_at ? new Date(message.created_at) : null;
        meta.textContent = date && !Number.isNaN(date.valueOf()) ? date.toLocaleTimeString() : 'Saved message';
        const remove = document.createElement('button');
        remove.className = 'history-delete-btn';
        remove.type = 'button';
        remove.textContent = '×';
        remove.setAttribute('aria-label', 'Remove message');
        remove.addEventListener('click', () => this.deleteMessage(message));
        const body = document.createElement('p');
        body.className = 'message-content';
        body.textContent = message.body || message.filtered || '';
        header.append(meta, remove);
        item.append(header, body);
        return item;
    }

    async deleteMessage(message) {
        const response = await fetch('/api/delete-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: message._id, sid: message.sid }),
        });
        if (response.ok) this.applyMessageRemoval(message);
        else this.showNotification('Could not remove message', 'error');
    }

    applyMessageRemoval(message) {
        this.messageHistory = this.messageHistory.filter((item) =>
            !(message._id && String(item._id) === String(message._id)) &&
            !(message.sid && String(item.sid) === String(message.sid))
        );
        this.showMessageHistory();
    }

    async loadBannerSettings() {
        try {
            const response = await fetch('/api/banner-message');
            if (response.ok) this.applyBannerSettings(await response.json());
        } catch (error) {
            console.warn('Could not load banner settings:', error);
        }
    }

    showBannerSettings() {
        const settings = this.currentBanner || {};
        document.getElementById('banner-message-input').value = settings.message || 'WHAT IS YOUR CRITICAL IDEA?';
        document.getElementById('banner-enabled-checkbox').checked = settings.enabled !== false;
        document.getElementById('banner-font-size').value = settings.fontSize || 24;
        document.getElementById('banner-text-color').value = settings.textColor || '#ffffff';
        document.getElementById('banner-font-family').value = settings.fontFamily || 'Orbitron';
        document.getElementById('banner-settings-modal')?.classList.remove('hidden');
    }

    hideBannerSettings() {
        document.getElementById('banner-settings-modal')?.classList.add('hidden');
    }

    readBannerForm() {
        return {
            message: document.getElementById('banner-message-input').value.trim(),
            enabled: document.getElementById('banner-enabled-checkbox').checked,
            fontSize: Number(document.getElementById('banner-font-size').value),
            textColor: document.getElementById('banner-text-color').value,
            fontFamily: document.getElementById('banner-font-family').value,
        };
    }

    previewBanner() {
        this.applyBannerSettings(this.readBannerForm());
    }

    async saveBannerSettings() {
        const settings = this.readBannerForm();
        const response = await fetch('/api/banner-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        if (!response.ok) {
            this.showNotification('Could not save banner settings', 'error');
            return;
        }
        this.applyBannerSettings(await response.json());
        this.hideBannerSettings();
        this.showNotification('Banner settings saved', 'success');
    }

    applyBannerSettings(settings) {
        this.currentBanner = settings;
        const banner = document.getElementById('message-banner');
        const text = document.getElementById('banner-text');
        if (!banner || !text) return;
        text.textContent = settings.message || '';
        text.style.fontSize = `${settings.fontSize || 24}px`;
        text.style.color = settings.textColor || '#ffffff';
        text.style.fontFamily = `'${settings.fontFamily || 'Orbitron'}', sans-serif`;
        banner.classList.toggle('show', settings.enabled !== false && Boolean(settings.message?.trim()));
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notification-text');
        if (!notification || !text) return;
        text.textContent = message;
        notification.className = `notification ${type}`;
        clearTimeout(this.notificationTimer);
        this.notificationTimer = setTimeout(() => this.hideNotification(), 3200);
    }

    hideNotification() {
        document.getElementById('notification')?.classList.add('hidden');
    }

    generateRandomColor() {
        return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
    }

    truncateToWords(text, maximum) {
        const words = String(text).trim().split(/\s+/);
        return words.length > maximum ? `${words.slice(0, maximum).join(' ')}…` : words.join(' ');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
