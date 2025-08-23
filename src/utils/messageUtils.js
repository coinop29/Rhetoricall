// Utility functions for handling different message types

/**
 * Check if a message is an image message
 * @param {any} message - The message to check
 * @returns {boolean} - True if the message is an image
 */
export const isImageMessage = (message) => {
  if (typeof message === 'object') {
    // Check for new backend structure
    if (message.imageUrl && message.imageGenerationStatus === 'success') {
      return true;
    }
    // Check for legacy structure
    if (message.type === 'image' && message.imageUrl) {
      return true;
    }
    // Check for direct image URL
    if (message.imageUrl && typeof message.imageUrl === 'string') {
      return true;
    }
  }
  if (typeof message === 'string') {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => message.toLowerCase().includes(ext));
  }
  return false;
};

/**
 * Extract image URL from a message
 * @param {any} message - The message to extract from
 * @returns {string|null} - The image URL or null if not an image
 */
export const getImageUrl = (message) => {
  if (typeof message === 'object') {
    // New backend structure
    if (message.imageUrl && message.imageGenerationStatus === 'success') {
      return message.imageUrl;
    }
    // Legacy structure
    if (message.type === 'image' && message.imageUrl) {
      return message.imageUrl;
    }
    // Direct imageUrl field
    if (message.imageUrl && typeof message.imageUrl === 'string') {
      return message.imageUrl;
    }
  }
  if (typeof message === 'string' && isImageMessage(message)) {
    return message;
  }
  return null;
};

/**
 * Extract text content from a message
 * @param {any} message - The message to extract from
 * @returns {string} - The text content
 */
export const getTextContent = (message) => {
  if (typeof message === 'object') {
    // New backend structure
    if (message.body) {
      return message.body;
    }
    // Legacy structure
    if (message.text) {
      return message.text;
    }
    // Fallback
    if (message.message) {
      return message.message;
    }
  }
  if (typeof message === 'string' && !isImageMessage(message)) {
    return message;
  }
  return 'Image Message';
};

/**
 * Get display text for notifications
 * @param {any} message - The message to get display text for
 * @returns {string} - The display text
 */
export const getDisplayText = (message) => {
  if (isImageMessage(message)) {
    return 'New image generated!';
  }
  return getTextContent(message);
};

/**
 * Get the display mode from a message
 * @param {any} message - The message to extract from
 * @returns {string} - The display mode ('text' or 'image')
 */
export const getDisplayMode = (message) => {
  if (typeof message === 'object' && message.displayMode) {
    return message.displayMode;
  }
  return isImageMessage(message) ? 'image' : 'text';
};

/**
 * Get image generation status
 * @param {any} message - The message to extract from
 * @returns {string} - The generation status
 */
export const getImageGenerationStatus = (message) => {
  if (typeof message === 'object' && message.imageGenerationStatus) {
    return message.imageGenerationStatus;
  }
  return null;
};

/**
 * Process incoming message data from backend
 * @param {any} data - Raw message data from backend
 * @returns {object} - Processed message object
 */
export const processIncomingMessage = (data) => {
  // Handle different backend response formats
  if (typeof data === 'object') {
    // New backend structure with Twilio fields
    if (data.body || data.sid) {
      return {
        type: isImageMessage(data) ? 'image' : 'text',
        text: getTextContent(data),
        imageUrl: getImageUrl(data),
        imageGenerationStatus: getImageGenerationStatus(data),
        displayMode: getDisplayMode(data),
        sid: data.sid,
        from: data.from,
        timestamp: data.timestamp || Date.now()
      };
    }
    
    // Legacy structured data
    if (data.imageUrl) {
      return {
        type: 'image',
        imageUrl: data.imageUrl,
        text: data.text || data.prompt || 'Generated Image',
        timestamp: data.timestamp || Date.now()
      };
    } else if (data.text) {
      return {
        type: 'text',
        text: data.text,
        timestamp: data.timestamp || Date.now()
      };
    }
  }
  
  // Fallback to string handling
  if (typeof data === 'string') {
    if (isImageMessage(data)) {
      return {
        type: 'image',
        imageUrl: data,
        text: 'Generated Image',
        timestamp: Date.now()
      };
    } else {
      return {
        type: 'text',
        text: data,
        timestamp: Date.now()
      };
    }
  }
  
  // Default fallback
  return {
    type: 'text',
    text: 'Unknown message type',
    timestamp: Date.now()
  };
};
