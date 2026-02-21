// Main Application Logic
class App {
    constructor() {
        this.currentDisplayMode = 'text';
        this.messageHistory = [];
        this.isLoading = false;
        this.scene3D = null;
        this.currentTextColor = '#2F24C1';
        this.randomizeColors = false;
        this.uiVisible = true;
        this.defaultBannerPhone = '+1 (516) 874-0789';
        this.defaultBannerFontFamily = 'Orbitron';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupWebSocketHandlers();
        this.loadDefaultBackground();
        this.updateDisplayModeUI();
        this.loadBannerMessage();
        
        // Initialize 3D scene
        await this.init3DScene();
        
        // Test banner visibility
        setTimeout(() => {
            const banner = document.getElementById('message-banner');
            if (banner) {
                console.log('Banner element found:', banner);
                console.log('Banner classes:', banner.className);
                console.log('Banner computed style:', window.getComputedStyle(banner).transform);
            }
        }, 1000);
        
        console.log('✅ App initialized successfully');
    }
    
    async init3DScene() {
        try {
            if (typeof Scene3DManager === 'undefined') {
                console.error('❌ Scene3DManager not loaded');
                return;
            }
            
            this.scene3D = new Scene3DManager('app');
            console.log('✅ 3D Scene manager initialized');
        } catch (error) {
            console.error('❌ Error initializing 3D scene:', error);
        }
    }

    setupEventListeners() {
        // Toggle display mode
        const toggleModeBtn = document.getElementById('toggle-mode');
        if (toggleModeBtn) {
            toggleModeBtn.addEventListener('click', () => this.toggleDisplayMode());
        }

        // Show message history
        const showHistoryBtn = document.getElementById('show-history');
        if (showHistoryBtn) {
            showHistoryBtn.addEventListener('click', () => this.showMessageHistory());
        }

        // Close message history
        const closeHistoryBtn = document.getElementById('close-history');
        if (closeHistoryBtn) {
            closeHistoryBtn.addEventListener('click', () => this.hideMessageHistory());
        }

        // Background settings
        const backgroundSettingsBtn = document.getElementById('background-settings');
        if (backgroundSettingsBtn) {
            backgroundSettingsBtn.addEventListener('click', () => this.showBackgroundSettings());
        }

        // Send test message (local Twilio simulator)
        const sendTestBtn = document.getElementById('send-test');
        if (sendTestBtn) {
            sendTestBtn.addEventListener('click', () => this.openSendTestPrompt());
        }

        // Text color picker
        const colorInput = document.getElementById('text-color');
        if (colorInput) {
            colorInput.value = this.currentTextColor;
            colorInput.addEventListener('input', (e) => {
                this.currentTextColor = e.target.value || '#2F24C1';
                this.showNotification(`Text color set to ${this.currentTextColor}`, 'success');
            });
        }

        // Randomize colors checkbox
        const randomizeColorsCheckbox = document.getElementById('randomize-colors');
        if (randomizeColorsCheckbox) {
            randomizeColorsCheckbox.addEventListener('change', (e) => {
                this.randomizeColors = e.target.checked;
                const status = this.randomizeColors ? 'enabled' : 'disabled';
                this.showNotification(`Color randomization ${status}`, 'success');
            });
        }

        // Close notification
        const closeNotificationBtn = document.getElementById('close-notification');
        if (closeNotificationBtn) {
            closeNotificationBtn.addEventListener('click', () => this.hideNotification());
        }

        // Close background settings modal
        const closeBackgroundSettingsBtn = document.getElementById('close-background-settings');
        if (closeBackgroundSettingsBtn) {
            closeBackgroundSettingsBtn.addEventListener('click', () => this.hideBackgroundSettings());
        }

        // Close banner button disabled (banner can be hidden via settings only)

        // Banner settings
        const bannerSettingsBtn = document.getElementById('banner-settings');
        if (bannerSettingsBtn) {
            bannerSettingsBtn.addEventListener('click', () => this.showBannerSettings());
        }

        // Close banner settings modal
        const closeBannerSettingsBtn = document.getElementById('close-banner-settings');
        if (closeBannerSettingsBtn) {
            closeBannerSettingsBtn.addEventListener('click', () => this.hideBannerSettings());
        }

        // Close history on outside click
        document.addEventListener('click', (e) => {
            const history = document.getElementById('message-history');
            if (history && !history.contains(e.target) && !e.target.closest('#show-history')) {
                this.hideMessageHistory();
            }
        });

        // Close background settings modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('background-settings-modal');
            if (modal && !modal.contains(e.target) && !e.target.closest('#background-settings')) {
                this.hideBackgroundSettings();
            }
        });

        // Close banner settings modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('banner-settings-modal');
            if (modal && !modal.contains(e.target) && !e.target.closest('#banner-settings')) {
                this.hideBannerSettings();
            }
        });

        // Setup background upload functionality
        this.setupBackgroundUpload();
        
        // Setup banner controls
        this.setupBannerControls();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Press 'H' to hide/show UI controls
            if (e.key === 'h' || e.key === 'H') {
                // Don't trigger if user is typing in an input/textarea
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                this.toggleUIVisibility();
            }
        });
    }

    toggleUIVisibility() {
        this.uiVisible = !this.uiVisible;
        const controls = document.getElementById('controls');
        const modeChip = document.getElementById('display-mode-chip');
        
        if (controls) {
            if (this.uiVisible) {
                controls.style.display = 'flex';
            } else {
                controls.style.display = 'none';
            }
        }
        
        if (modeChip) {
            if (this.uiVisible) {
                modeChip.style.display = 'block';
            } else {
                modeChip.style.display = 'none';
            }
        }
        
        const status = this.uiVisible ? 'visible' : 'hidden';
        this.showNotification(`UI controls ${status} (Press 'H' to toggle)`, 'info');
    }

    async openSendTestPrompt() {
        const defaultBody = this.currentDisplayMode === 'image' ? 'A neon skyline with flying cars' : 'Hello from local dev!';
        const body = window.prompt('Enter test message text:', defaultBody);
        if (!body || !body.trim()) return;

        try {
            const response = await fetch('/api/dev/messageIncoming', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: body.trim(),
                    from: '+15555550123',
                    to: '+15555550124'
                })
            });
            if (response.ok) {
                this.showNotification('Test message sent', 'success');
            } else {
                const err = await response.text();
                this.showNotification('Failed to send test message: ' + err, 'error');
            }
        } catch (e) {
            console.error(e);
            this.showNotification('Error sending test message', 'error');
        }
    }

    setupWebSocketHandlers() {
        if (!window.wsManager) {
            console.error('❌ WebSocket manager not available');
            return;
        }

        // Handle incoming messages
        window.wsManager.onMessage('messageIncoming', (data) => {
            console.log('📨 New message received:', data);
            console.log('📨 Filtered data:', data.filtered);
            this.handleIncomingMessage(data.filtered);
        });

        // Handle display mode changes
        window.wsManager.onMessage('displayModeChanged', (data) => {
            console.log('🔄 Display mode changed:', data.mode);
            this.currentDisplayMode = data.mode;
            this.updateDisplayModeUI();
        });

        // Handle connection events
        window.wsManager.onConnection('connect', () => {
            this.showNotification('Connected to server', 'success');
        });

        window.wsManager.onConnection('disconnect', () => {
            this.showNotification('Disconnected from server', 'error');
        });

        window.wsManager.onConnection('error', () => {
            this.showNotification('Connection error', 'error');
        });
    }

    handleIncomingMessage(messageData) {
        console.log('📨 Handling incoming message:', messageData);
        this.showLoading(true);
        
        // Add to history
        this.messageHistory.push({
            ...messageData,
            timestamp: new Date().toISOString()
        });

        // Add floating message
        this.addFloatingMessage(messageData);

        // Show notification
        const imageUrl = messageData.imageUrl || messageData.image_url;
        const imageStatus = messageData.imageGenerationStatus || messageData.image_generation_status;
        const messageType = imageUrl && imageStatus === 'success' ? 'image' : 'text';
        this.showNotification(`New ${messageType} message received`, 'info');

        // Hide loading
        setTimeout(() => {
            this.showLoading(false);
        }, 1000);
    }

    toggleDisplayMode() {
        const newMode = this.currentDisplayMode === 'text' ? 'image' : 'text';
        
        if (window.wsManager && window.wsManager.isConnected) {
            window.wsManager.send({
                type: 'setDisplayMode',
                mode: newMode
            });
        } else {
            // Fallback: update locally
            this.currentDisplayMode = newMode;
            this.updateDisplayModeUI();
            this.showNotification('Display mode updated (offline)', 'warning');
        }
    }

    updateDisplayModeUI() {
        const modeChip = document.getElementById('display-mode-chip');
        const modeText = document.getElementById('mode-text');
        const toggleBtn = document.getElementById('toggle-mode');

        if (modeChip && modeText) {
            modeText.textContent = `Mode: ${this.currentDisplayMode.toUpperCase()}`;
            
            // Update chip styling
            modeChip.className = 'mode-chip';
            if (this.currentDisplayMode === 'image') {
                modeChip.classList.add('image-mode');
            } else {
                modeChip.classList.add('text-mode');
            }
        }

        if (toggleBtn) {
            const newMode = this.currentDisplayMode === 'text' ? 'image' : 'text';
            toggleBtn.textContent = `Switch to ${newMode.charAt(0).toUpperCase() + newMode.slice(1)} Mode`;
        }
    }

    showMessageHistory() {
        const history = document.getElementById('message-history');
        const historyContent = document.getElementById('history-content');
        
        if (history && historyContent) {
            // Populate history content
            historyContent.innerHTML = '';
            
            if (this.messageHistory.length === 0) {
                historyContent.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">No messages yet</p>';
            } else {
                this.messageHistory.slice(-10).reverse().forEach((message, index) => {
                    const messageElement = this.createHistoryMessageElement(message);
                    historyContent.appendChild(messageElement);
                });
            }
            
            history.classList.remove('hidden');
            history.classList.add('fade-in');
        }
    }

    hideMessageHistory() {
        const history = document.getElementById('message-history');
        if (history) {
            history.classList.add('hidden');
        }
    }

    createHistoryMessageElement(message) {
        const div = document.createElement('div');
        div.className = 'message-item';
        
        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.innerHTML = `
            <span>${message.from || 'Unknown'}</span>
            <span>${new Date(message.timestamp).toLocaleTimeString()}</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        if (message.imageUrl && message.imageGenerationStatus === 'success') {
            content.innerHTML = `
                <p>${message.body || message.text || 'Image message'}</p>
                <img src="${message.imageUrl}" alt="Generated image" class="message-image" onerror="this.style.display='none'">
            `;
        } else {
            content.textContent = message.body || message.text || 'Unknown message';
        }
        
        div.appendChild(meta);
        div.appendChild(content);
        
        return div;
    }

    showBackgroundSettings() {
        const modal = document.getElementById('background-settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.loadBackgrounds();
            this.updateCurrentBackgroundInfo();
        }
    }

    hideBackgroundSettings() {
        const modal = document.getElementById('background-settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async loadBackgrounds() {
        try {
            const response = await fetch('/api/backgrounds');
            if (response.ok) {
                const backgrounds = await response.json();
                this.renderBackgrounds(backgrounds);
            } else {
                // Fallback to default backgrounds if API fails
                this.renderDefaultBackgrounds();
            }
        } catch (error) {
            console.warn('Could not load backgrounds from API, using defaults:', error);
            this.renderDefaultBackgrounds();
        }
    }

    renderDefaultBackgrounds() {
        const defaultBackgrounds = [
            { url: 'spiral.mp4', filename: 'spiral.mp4', isDefault: true },
            { url: 'grid2.mp4', filename: 'grid2.mp4', isDefault: false },
            { url: 'scifi1.mp4', filename: 'scifi1.mp4', isDefault: false },
            { url: 'scifi2.mp4', filename: 'scifi2.mp4', isDefault: false },
            { url: 'scifi3.mp4', filename: 'scifi3.mp4', isDefault: false },
            { url: 'tunnel.mp4', filename: 'tunnel.mp4', isDefault: false },
            { url: 'triangles.mp4', filename: 'triangles.mp4', isDefault: false },
            { url: 'yellowvoid.mp4', filename: 'yellowvoid.mp4', isDefault: false }
        ];
        this.renderBackgrounds(defaultBackgrounds);
    }

    renderBackgrounds(backgrounds) {
        const backgroundList = document.getElementById('background-list');
        if (!backgroundList) return;

        backgroundList.innerHTML = '';

        backgrounds.forEach((background, index) => {
            const backgroundItem = this.createBackgroundItem(background, index);
            backgroundList.appendChild(backgroundItem);
        });
    }

    createBackgroundItem(background, index) {
        const div = document.createElement('div');
        div.className = 'background-item';
        div.dataset.index = index;
        div.dataset.filename = background.filename;
        div.dataset.url = background.url || '';
        div.dataset.backgroundId = background._id || background.filename;

        // Use url from API (local: /static/media/... or Cloudinary: full https URL)
        const videoUrl = background.url || `/static/media/${background.filename}`;
        const currentVideo = document.getElementById('background-video');
        const isCurrent = currentVideo && currentVideo.src.includes(background.filename);

        if (isCurrent) {
            div.classList.add('active');
        }

        div.innerHTML = `
            <video preload="metadata" muted>
                <source src="${videoUrl}" type="video/mp4">
            </video>
            <p class="background-name">${background.filename}</p>
            <div class="background-actions">
                <button class="action-btn set-btn" onclick="event.stopPropagation(); var p=this.closest('.background-item'); window.app.setBackground(p.dataset.filename, p.dataset.url||'', p.dataset.backgroundId)">
                    ${isCurrent ? 'Current' : 'Set'}
                </button>
                <button class="action-btn delete-btn" onclick="event.stopPropagation(); window.app.deleteBackground('${background._id || background.filename}')">
                    Delete
                </button>
            </div>
        `;

        // Add click handler to set background
        div.addEventListener('click', () => {
            this.setBackground(background.filename, background.url, background._id || background.filename);
        });

        return div;
    }

    async setBackground(filename, url, backgroundId) {
        try {
            // Use url when available (Cloudinary), else build local path
            const videoUrl = url || `/static/media/${filename}`;
            const video = document.getElementById('background-video');
            if (video) {
                video.src = videoUrl;
                video.load();
            }

            // Update current background info (pass url for Cloudinary)
            this.updateCurrentBackgroundInfo(filename, videoUrl);

            // Update active state in grid
            this.updateActiveBackground(filename);

            // Try to set as default via API (_id is MongoDB id for DB records, filename for local)
            try {
                const response = await fetch('/api/set_default', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ _id: backgroundId })
                });
                
                if (response.ok) {
                    this.showNotification(`Background set to ${filename}`, 'success');
                }
            } catch (error) {
                console.warn('Could not set default background via API:', error);
                this.showNotification(`Background set to ${filename} (offline)`, 'success');
            }

        } catch (error) {
            console.error('Error setting background:', error);
            this.showNotification('Error setting background', 'error');
        }
    }

    updateCurrentBackgroundInfo(filename = null, videoUrl = null) {
        const currentVideo = document.getElementById('current-background-preview');
        const currentName = document.getElementById('current-background-name');
        
        if (currentVideo && currentName) {
            if (filename) {
                const url = videoUrl || `/static/media/${filename}`;
                currentVideo.src = url;
                currentVideo.load();
                currentName.textContent = filename;
            } else {
                const mainVideo = document.getElementById('background-video');
                if (mainVideo && mainVideo.src) {
                    const urlParts = mainVideo.src.split('/');
                    const currentFilename = urlParts[urlParts.length - 1];
                    currentVideo.src = mainVideo.src;
                    currentName.textContent = currentFilename;
                }
            }
        }
    }

    updateActiveBackground(filename) {
        const backgroundItems = document.querySelectorAll('.background-item');
        backgroundItems.forEach(item => {
            item.classList.remove('active');
            const setBtn = item.querySelector('.set-btn');
            if (setBtn) {
                setBtn.textContent = 'Set';
            }
        });

        const activeItem = document.querySelector(`[data-filename="${filename}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            const setBtn = activeItem.querySelector('.set-btn');
            if (setBtn) {
                setBtn.textContent = 'Current';
            }
        }
    }

    async deleteBackground(backgroundId) {
        if (!confirm('Are you sure you want to delete this background?')) {
            return;
        }

        try {
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: backgroundId })
            });

            if (response.ok) {
                this.showNotification('Background deleted successfully', 'success');
                this.loadBackgrounds(); // Reload the list
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting background:', error);
            this.showNotification('Error deleting background', 'error');
        }
    }

    setupBackgroundUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('background-file-input');
        const uploadBtn = document.getElementById('upload-background-btn');
        let selectedFile = null;

        if (!uploadArea || !fileInput || !uploadBtn) return;

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelection(file);
                selectedFile = file;
                uploadBtn.classList.remove('hidden');
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileSelection(file);
                selectedFile = file;
                uploadBtn.classList.remove('hidden');
            }
        });

        // Upload button
        uploadBtn.addEventListener('click', async () => {
            if (selectedFile) {
                await this.uploadBackground(selectedFile);
            }
        });
    }

    handleFileSelection(file) {
        const uploadArea = document.getElementById('upload-area');
        if (!uploadArea) return;

        // Validate file type
        const validTypes = ['video/mp4', 'video/webm', 'video/avi'];
        if (!validTypes.includes(file.type)) {
            this.showNotification('Please select a valid video file (MP4, WebM, AVI)', 'error');
            return;
        }

        // Validate file size (max 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            this.showNotification('File size must be less than 50MB', 'error');
            return;
        }

        // Update upload area
        uploadArea.innerHTML = `
            <div style="text-align: center;">
                <p style="color: #4caf50; font-weight: 500;">${file.name}</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.6);">
                    ${(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>
        `;
    }

    async uploadBackground(file) {
        const uploadBtn = document.getElementById('upload-background-btn');
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Uploading...';
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.showNotification(`Background uploaded successfully: ${result.filename}`, 'success');
                this.loadBackgrounds(); // Reload the list
                this.resetUploadArea();
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading background:', error);
            this.showNotification('Error uploading background', 'error');
        } finally {
            if (uploadBtn) {
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Upload Background';
            }
        }
    }

    resetUploadArea() {
        const uploadArea = document.getElementById('upload-area');
        const uploadBtn = document.getElementById('upload-background-btn');
        
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-placeholder">
                    <p>Click to upload or drag & drop</p>
                    <p class="upload-hint">Supports MP4, WebM, AVI files</p>
                </div>
            `;
        }
        
        if (uploadBtn) {
            uploadBtn.classList.add('hidden');
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            if (show) {
                loading.classList.remove('hidden');
            } else {
                loading.classList.add('hidden');
            }
        }
        this.isLoading = show;
    }

    generateRandomColor() {
        // Generate vibrant random colors
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
        const lightness = 50 + Math.floor(Math.random() * 20); // 50-70%
        
        // Convert HSL to hex
        const h = hue / 360;
        const s = saturation / 100;
        const l = lightness / 100;
        
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    addFloatingMessage(messageData) {
        console.log('📨 Adding floating message:', messageData);
        
        // Use 3D scene if available, otherwise fallback to 2D
        if (this.scene3D && this.scene3D.font) {
            console.log('📨 Using 3D scene rendering');
            // Use random color if enabled, otherwise use current color
            const textColor = this.randomizeColors ? this.generateRandomColor() : this.currentTextColor;
            const payload = { ...messageData, textColor: textColor };
            this.scene3D.addFloatingMessage(payload);
            console.log(`✅ Added 3D floating message with color ${textColor}`);
        } else {
            console.log('📨 Using fallback 2D rendering');
            this.addFloatingMessage2D(messageData);
        }
    }
    
    addFloatingMessage2D(messageData) {
        const container = document.getElementById('floating-messages');
        if (!container) {
            console.error('❌ Floating messages container not found');
            return;
        }

        const imageUrl = messageData.imageUrl || messageData.image_url;
        const imageStatus = messageData.imageGenerationStatus || messageData.image_generation_status;
        const isImage = imageUrl && imageStatus === 'success';
        
        console.log('📨 Image URL:', imageUrl);
        console.log('📨 Image Status:', imageStatus);
        console.log('📨 Is Image:', isImage);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `floating-message ${isImage ? 'image' : 'text'}`;
        
        // Random horizontal position
        const randomX = Math.random() * (window.innerWidth - 300);
        messageDiv.style.left = `${randomX}px`;
        
        if (isImage) {
            messageDiv.innerHTML = `
                <img src="${imageUrl}" alt="Generated image" onerror="this.style.display='none'">
            `;
        } else {
            const messageText = messageData.body || messageData.filtered || 'No message content';
            // Truncate to 5 words
            const truncatedText = this.truncateToWords(messageText, 5);
            messageDiv.textContent = truncatedText;
            messageDiv.setAttribute('data-text', truncatedText);
        }
        
        container.appendChild(messageDiv);
        console.log('📨 Message div added to container');
        
        // Messages now stay for the duration of the session
        // No auto-deletion - they will persist until page refresh
        
        console.log(`✅ Added floating ${isImage ? 'image' : 'text'} message`);
    }
    
    truncateToWords(text, maxWords) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        const words = text.trim().split(/\s+/);
        if (words.length <= maxWords) {
            return text.trim();
        }
        
        return words.slice(0, maxWords).join(' ') + '...';
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            
            // Update styling based on type
            notification.className = 'notification';
            if (type === 'error') {
                notification.style.borderColor = 'rgba(244, 67, 54, 0.5)';
            } else if (type === 'success') {
                notification.style.borderColor = 'rgba(76, 175, 80, 0.5)';
            } else if (type === 'warning') {
                notification.style.borderColor = 'rgba(255, 152, 0, 0.5)';
            }
            
            notification.classList.remove('hidden');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                this.hideNotification();
            }, 3000);
        }
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.add('hidden');
        }
    }

    async loadDefaultBackground() {
        try {
            const response = await fetch('/api/get_default');
            if (response.ok) {
                const data = await response.json();
                const video = document.getElementById('background-video');
                if (video && data.url) {
                    // Use url directly (Cloudinary full URL or local /static/media/ path)
                    const videoUrl = (data.url.startsWith('http') || data.url.startsWith('/')) ? data.url : `/static/media/${data.filename || data.url.split('/').pop()}`;
                    video.src = videoUrl;
                    console.log('✅ Background video loaded:', videoUrl);
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not load default background:', error);
        }
    }

    // Banner management methods
    async loadBannerMessage() {
        try {
            const response = await fetch('/api/banner-message');
            if (response.ok) {
                const data = await response.json();
                if (data.enabled && data.message && data.message.trim() !== '') {
                    const fontSize = data.fontSize || 24;
                    const phoneNumber = data.phoneNumber && data.phoneNumber.trim() !== '' ? data.phoneNumber : this.defaultBannerPhone;
                    const phoneFontSize = data.phoneFontSize || 32;
                    const textColor = data.textColor || '#ffffff';
                    const phoneColor = data.phoneColor || '#ffffff';
                    const fontFamily = data.fontFamily || this.defaultBannerFontFamily;
                    this.showBanner(data.message, fontSize, phoneNumber, phoneFontSize, {
                        textColor,
                        phoneColor,
                        fontFamily
                    });
                } else {
                    // Hide banner if disabled or no message
                    this.hideBanner();
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not load banner message:', error);
            // Show default banner if API fails
            this.showBanner(
                'WHAT IS YOUR CRITICAL IDEA?',
                24,
                this.defaultBannerPhone || '845-524-9694',
                20,
                {
                    textColor: '#ffffff',
                    phoneColor: '#ffffff',
                    fontFamily: this.defaultBannerFontFamily
                }
            );
        }
    }

    showBanner(message, fontSize = 24, phoneNumber = '', phoneFontSize = 32, options = {}) {
        const banner = document.getElementById('message-banner');
        const bannerText = document.getElementById('banner-text');
        const bannerPhone = document.getElementById('banner-phone');
        const {
            textColor = '#ffffff',
            phoneColor = '#ffffff',
            fontFamily = this.defaultBannerFontFamily
        } = options;

        if (banner && bannerText) {
            // Remove existing style classes
            banner.classList.remove('banner-style-futuristic', 'banner-style-grungy', 'banner-style-outlined');
            
            // Apply style class based on font
            if (fontFamily === 'Russo One') {
                banner.classList.add('banner-style-outlined');
            } else if (fontFamily === 'Creepster' || fontFamily === 'Nosifer') {
                banner.classList.add('banner-style-grungy');
            } else if (fontFamily === 'Orbitron' || fontFamily === 'Rajdhani') {
                banner.classList.add('banner-style-futuristic');
            }
            
            bannerText.textContent = message;
            bannerText.style.fontSize = `${fontSize}px`;
            bannerText.style.color = textColor;
            bannerText.style.fontFamily = this.getFontStack(fontFamily);
            
            if (bannerPhone) {
                if (phoneNumber && phoneNumber.trim() !== '') {
                    bannerPhone.textContent = `SMS/ WhatsApp / iMessage your Answer to ${phoneNumber}`;
                    bannerPhone.style.fontSize = `${phoneFontSize}px`;
                    bannerPhone.style.color = phoneColor;
                    bannerPhone.style.fontFamily = this.getFontStack(fontFamily);
                    bannerPhone.style.display = 'block';
                } else {
                    bannerPhone.style.display = 'none';
                }
            }
            
            banner.classList.add('show');
            document.body.classList.add('banner-visible');
            
            console.log('✅ Banner shown:', message, 'Font size:', fontSize, 'Phone:', phoneNumber);
        }
    }

    hideBanner() {
        const banner = document.getElementById('message-banner');
        if (banner) {
            banner.classList.remove('show');
            document.body.classList.remove('banner-visible');
            console.log('✅ Banner hidden');
        }
    }

    // Banner settings management
    showBannerSettings() {
        const modal = document.getElementById('banner-settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.loadCurrentBannerSettings();
        }
    }

    hideBannerSettings() {
        const modal = document.getElementById('banner-settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async loadCurrentBannerSettings() {
        try {
            const response = await fetch('/api/banner-message');
            if (response.ok) {
                const data = await response.json();
                const messageInput = document.getElementById('banner-message-input');
                const phoneNumberInput = document.getElementById('banner-phone-number');
                const enabledCheckbox = document.getElementById('banner-enabled-checkbox');
                const fontSizeSelect = document.getElementById('banner-font-size');
                const phoneFontSizeSelect = document.getElementById('banner-phone-font-size');
                const textColorInput = document.getElementById('banner-text-color');
                const phoneColorInput = document.getElementById('banner-phone-color');
                const fontFamilySelect = document.getElementById('banner-font-family');
                const statusText = document.getElementById('banner-status-text');
                const statusDiv = document.querySelector('.banner-status');

                if (messageInput) {
                    messageInput.value = data.message || '';
                }
                if (phoneNumberInput) {
                    phoneNumberInput.value = data.phoneNumber || this.defaultBannerPhone;
                }
                if (enabledCheckbox) {
                    enabledCheckbox.checked = data.enabled !== false;
                }
                if (fontSizeSelect) {
                    fontSizeSelect.value = data.fontSize || 24;
                }
                if (phoneFontSizeSelect) {
                    phoneFontSizeSelect.value = data.phoneFontSize || 32;
                }
                if (textColorInput) {
                    textColorInput.value = (data.textColor || '#ffffff').toLowerCase();
                }
                if (phoneColorInput) {
                    phoneColorInput.value = (data.phoneColor || '#ffffff').toLowerCase();
                }
                if (fontFamilySelect) {
                    fontFamilySelect.value = data.fontFamily || this.defaultBannerFontFamily;
                    fontFamilySelect.style.fontFamily = this.getFontStack(fontFamilySelect.value);
                }
                if (statusText && statusDiv) {
                    if (data.enabled !== false && data.message && data.message.trim() !== '') {
                        statusText.textContent = 'Banner is currently enabled and visible';
                        statusDiv.classList.remove('disabled');
                    } else {
                        statusText.textContent = 'Banner is currently disabled';
                        statusDiv.classList.add('disabled');
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not load banner settings:', error);
        }
    }

    async saveBannerSettings() {
        const messageInput = document.getElementById('banner-message-input');
        const phoneNumberInput = document.getElementById('banner-phone-number');
        const enabledCheckbox = document.getElementById('banner-enabled-checkbox');
        const fontSizeSelect = document.getElementById('banner-font-size');
        const phoneFontSizeSelect = document.getElementById('banner-phone-font-size');
        const textColorInput = document.getElementById('banner-text-color');
        const phoneColorInput = document.getElementById('banner-phone-color');
        const fontFamilySelect = document.getElementById('banner-font-family');
        
        if (!messageInput || !enabledCheckbox || !fontSizeSelect || !phoneFontSizeSelect) return;

        const message = messageInput.value.trim();
        const phoneNumber = phoneNumberInput ? (phoneNumberInput.value.trim() || this.defaultBannerPhone) : this.defaultBannerPhone;
        const enabled = enabledCheckbox.checked;
        const fontSize = parseInt(fontSizeSelect.value);
        const phoneFontSize = parseInt(phoneFontSizeSelect.value);
        const textColor = textColorInput ? textColorInput.value : '#ffffff';
        const phoneColor = phoneColorInput ? phoneColorInput.value : '#ffffff';
        const fontFamily = fontFamilySelect ? fontFamilySelect.value : this.defaultBannerFontFamily;

        try {
            const response = await fetch('/api/banner-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    phoneNumber: phoneNumber,
                    enabled: enabled,
                    fontSize: fontSize,
                    phoneFontSize: phoneFontSize,
                    textColor: textColor,
                    phoneColor: phoneColor,
                    fontFamily: fontFamily
                })
            });

            if (response.ok) {
                this.showNotification('Banner settings saved successfully', 'success');
                this.updateBannerStatus();
                
                // If enabled and has message, show the banner
                if (enabled && message) {
                    this.showBanner(message, fontSize, phoneNumber, phoneFontSize, {
                        textColor,
                        phoneColor,
                        fontFamily
                    });
                } else {
                    this.hideBanner();
                }
            } else {
                throw new Error('Failed to save banner settings');
            }
        } catch (error) {
            console.error('Error saving banner settings:', error);
            this.showNotification('Error saving banner settings', 'error');
        }
    }

    previewBanner() {
        const messageInput = document.getElementById('banner-message-input');
        const phoneNumberInput = document.getElementById('banner-phone-number');
        const fontSizeSelect = document.getElementById('banner-font-size');
        const phoneFontSizeSelect = document.getElementById('banner-phone-font-size');
        const textColorInput = document.getElementById('banner-text-color');
        const phoneColorInput = document.getElementById('banner-phone-color');
        const fontFamilySelect = document.getElementById('banner-font-family');
        if (messageInput && messageInput.value.trim() && fontSizeSelect && phoneFontSizeSelect) {
            const fontSize = parseInt(fontSizeSelect.value);
            const phoneNumber = phoneNumberInput ? (phoneNumberInput.value.trim() || this.defaultBannerPhone) : this.defaultBannerPhone;
            const phoneFontSize = parseInt(phoneFontSizeSelect.value);
            const textColor = textColorInput ? textColorInput.value : '#ffffff';
            const phoneColor = phoneColorInput ? phoneColorInput.value : '#ffffff';
            const fontFamily = fontFamilySelect ? fontFamilySelect.value : this.defaultBannerFontFamily;
            this.showBanner(messageInput.value.trim(), fontSize, phoneNumber, phoneFontSize, {
                textColor,
                phoneColor,
                fontFamily
            });
        } else {
            this.showNotification('Please enter a message to preview', 'warning');
        }
    }

    hideBannerNow() {
        this.hideBanner();
        this.showNotification('Banner hidden', 'info');
    }

    updateBannerStatus() {
        const messageInput = document.getElementById('banner-message-input');
        const enabledCheckbox = document.getElementById('banner-enabled-checkbox');
        const statusText = document.getElementById('banner-status-text');
        const statusDiv = document.querySelector('.banner-status');

        if (statusText && statusDiv && messageInput && enabledCheckbox) {
            const message = messageInput.value.trim();
            const enabled = enabledCheckbox.checked;

            if (enabled && message) {
                statusText.textContent = 'Banner is currently enabled and visible';
                statusDiv.classList.remove('disabled');
            } else {
                statusText.textContent = 'Banner is currently disabled';
                statusDiv.classList.add('disabled');
            }
        }
    }

    setupBannerControls() {
        // Preview banner button
        const previewBtn = document.getElementById('preview-banner');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewBanner());
        }

        // Save banner button
        const saveBtn = document.getElementById('save-banner');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveBannerSettings());
        }

        // Hide banner now button
        const hideBtn = document.getElementById('hide-banner-now');
        if (hideBtn) {
            hideBtn.addEventListener('click', () => this.hideBannerNow());
        }

        // Update status when inputs change
        const messageInput = document.getElementById('banner-message-input');
        const enabledCheckbox = document.getElementById('banner-enabled-checkbox');
        
        if (messageInput) {
            messageInput.addEventListener('input', () => this.updateBannerStatus());
        }
        if (enabledCheckbox) {
            enabledCheckbox.addEventListener('change', () => this.updateBannerStatus());
        }

        const fontFamilySelect = document.getElementById('banner-font-family');
        if (fontFamilySelect) {
            fontFamilySelect.addEventListener('change', (event) => {
                fontFamilySelect.style.fontFamily = this.getFontStack(event.target.value);
            });
        }
    }

    // Utility methods
    getFontStack(fontName) {
        const fontStacks = {
            Inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
            Montserrat: "'Montserrat', 'Inter', 'Segoe UI', sans-serif",
            Poppins: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
            Roboto: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
            'Playfair Display': "'Playfair Display', 'Times New Roman', serif",
            Lora: "'Lora', 'Times New Roman', serif",
            Orbitron: "'Orbitron', 'Rajdhani', 'Russo One', sans-serif",
            Rajdhani: "'Rajdhani', 'Orbitron', 'Russo One', sans-serif",
            'Russo One': "'Russo One', 'Orbitron', 'Rajdhani', sans-serif",
            Creepster: "'Creepster', 'Nosifer', sans-serif",
            Nosifer: "'Nosifer', 'Creepster', sans-serif"
        };
        return fontStacks[fontName] || `'${fontName}', 'Orbitron', sans-serif`;
    }

    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations if needed
        console.log('📱 Page hidden');
    } else {
        // Page is visible, resume animations
        console.log('📱 Page visible');
    }
});
