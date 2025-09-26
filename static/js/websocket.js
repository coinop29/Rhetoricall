// WebSocket connection management
class WebSocketManager {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnected = false;
        this.messageHandlers = new Map();
        this.connectionHandlers = new Map();
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;
        
        console.log('🔌 Connecting to WebSocket:', wsUrl);
        
        try {
            this.socket = new WebSocket(wsUrl);
            
            this.socket.onopen = (event) => {
                console.log('✅ WebSocket connected successfully');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.triggerConnectionHandlers('connect', event);
            };
            
            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 WebSocket message received:', data);
                    console.log('📨 Message type:', data.type);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('❌ Error parsing WebSocket message:', error);
                }
            };
            
            this.socket.onclose = (event) => {
                console.log('🔌 WebSocket disconnected:', event.code, event.reason);
                this.isConnected = false;
                this.triggerConnectionHandlers('disconnect', event);
                
                if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.scheduleReconnect();
                }
            };
            
            this.socket.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.triggerConnectionHandlers('error', error);
            };
            
        } catch (error) {
            console.error('❌ Failed to create WebSocket connection:', error);
            this.scheduleReconnect();
        }
    }

    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            if (!this.isConnected) {
                this.connect();
            }
        }, delay);
    }

    handleMessage(data) {
        const { type } = data;
        
        if (this.messageHandlers.has(type)) {
            const handlers = this.messageHandlers.get(type);
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`❌ Error in message handler for ${type}:`, error);
                }
            });
        } else {
            console.warn(`⚠️ No handler registered for message type: ${type}`);
        }
    }

    onMessage(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type).push(handler);
    }

    onConnection(event, handler) {
        if (!this.connectionHandlers.has(event)) {
            this.connectionHandlers.set(event, []);
        }
        this.connectionHandlers.get(event).push(handler);
    }

    triggerConnectionHandlers(event, data) {
        if (this.connectionHandlers.has(event)) {
            const handlers = this.connectionHandlers.get(event);
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`❌ Error in connection handler for ${event}:`, error);
                }
            });
        }
    }

    send(data) {
        if (this.isConnected && this.socket) {
            try {
                this.socket.send(JSON.stringify(data));
                console.log('📤 WebSocket message sent:', data);
            } catch (error) {
                console.error('❌ Error sending WebSocket message:', error);
            }
        } else {
            console.warn('⚠️ WebSocket not connected, cannot send message');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close(1000, 'Client disconnect');
            this.socket = null;
            this.isConnected = false;
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts
        };
    }
}

// Global WebSocket manager instance
window.wsManager = new WebSocketManager();

// Initialize connection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wsManager.connect();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    window.wsManager.disconnect();
});
