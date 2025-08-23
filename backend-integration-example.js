// Example of how the backend should send image messages to the frontend

// Backend should emit 'messageIncoming' event with this structure:

// For text messages (existing format):
socket.emit('messageIncoming', {
  filtered: "Hello, this is a text message"
});

// For image messages (new format with Twilio fields):
socket.emit('messageIncoming', {
  filtered: {
    sid: "SM1234567890",                    // Twilio message SID
    from: "+1234567890",                    // Sender phone number
    body: "Generate a beautiful sunset",    // Original message text
    imageUrl: "https://replicate.com/generated-image.jpg", // Generated image URL
    imageGenerationStatus: "success",       // Status: success, failed, skipped, error
    displayMode: "image",                   // Current display mode: text or image
    timestamp: 1234567890                   // Message timestamp
  }
});

// For failed image generation:
socket.emit('messageIncoming', {
  filtered: {
    sid: "SM1234567890",
    from: "+1234567890",
    body: "Generate a beautiful sunset",
    imageUrl: null,                         // No image generated
    imageGenerationStatus: "failed",        // Generation failed
    displayMode: "image",                   // Still in image mode
    timestamp: 1234567890
  }
});

// For text mode messages:
socket.emit('messageIncoming', {
  filtered: {
    sid: "SM1234567890",
    from: "+1234567890",
    body: "Hello, this is a text message",
    imageUrl: null,                         // No image in text mode
    imageGenerationStatus: "skipped",       // Image generation skipped
    displayMode: "text",                    // Currently in text mode
    timestamp: 1234567890
  }
});

// Alternative: Direct image URL (legacy support)
socket.emit('messageIncoming', {
  filtered: 'https://replicate.com/generated-image.jpg'
});

// Display mode change notification:
socket.emit('displayModeChanged', {
  mode: 'image'  // or 'text'
});

// The frontend will automatically detect the message type and render accordingly
// based on the imageUrl and imageGenerationStatus fields
