// Main Application Logic
class App {
    constructor() {
        this.currentDisplayMode = 'text';
        this.messageHistory = [];
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupWebSocketHandlers();
        this.loadDefaultBackground();
        this.updateDisplayModeUI();
        console.log('✅ App initialized successfully');
        
        // Test floating message after 3 seconds
        setTimeout(() => {
            console.log('🧪 Testing floating message...');
            this.addFloatingMessage({
                body: 'Test floating message',
                image_url: null,
                image_generation_status: 'skipped'
            });
        }, 3000);
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

        // Setup background upload functionality
        this.setupBackgroundUpload();
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

        const videoUrl = `https://rhetoricall.site/backgroundvideos/${background.filename}`;
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
                <button class="action-btn set-btn" onclick="event.stopPropagation(); window.app.setBackground('${background.filename}')">
                    ${isCurrent ? 'Current' : 'Set'}
                </button>
                <button class="action-btn delete-btn" onclick="event.stopPropagation(); window.app.deleteBackground('${background._id || background.filename}')">
                    Delete
                </button>
            </div>
        `;

        // Add click handler to set background
        div.addEventListener('click', () => {
            this.setBackground(background.filename);
        });

        return div;
    }

    async setBackground(filename) {
        try {
            // Update the main background video
            const video = document.getElementById('background-video');
            if (video) {
                const videoUrl = `https://rhetoricall.site/backgroundvideos/${filename}`;
                video.src = videoUrl;
                video.load();
            }

            // Update current background info
            this.updateCurrentBackgroundInfo(filename);

            // Update active state in grid
            this.updateActiveBackground(filename);

            // Try to set as default via API
            try {
                const response = await fetch('/api/set_default', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ _id: filename })
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

    updateCurrentBackgroundInfo(filename = null) {
        const currentVideo = document.getElementById('current-background-preview');
        const currentName = document.getElementById('current-background-name');
        
        if (currentVideo && currentName) {
            if (filename) {
                const videoUrl = `https://rhetoricall.site/backgroundvideos/${filename}`;
                currentVideo.src = videoUrl;
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

    addFloatingMessage(messageData) {
        console.log('📨 Adding floating message:', messageData);
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
            const messageText = messageData.body || 'No message content';
            messageDiv.textContent = messageText;
            messageDiv.setAttribute('data-text', messageText);
        }
        
        container.appendChild(messageDiv);
        console.log('📨 Message div added to container');
        
        // Remove after animation completes (30 seconds max)
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 30000);
        
        console.log(`✅ Added floating ${isImage ? 'image' : 'text'} message`);
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
                    // Extract filename from URL and construct video server URL
                    const filename = data.url.split('/').pop();
                    const videoUrl = `https://rhetoricall.site/backgroundvideos/${filename}`;
                    video.src = videoUrl;
                    console.log('✅ Background video loaded:', videoUrl);
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not load default background:', error);
        }
    }

    // Utility methods
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
