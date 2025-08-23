/* eslint-disable */

import React from 'react';
import Text3D from './Text3D';
import Image3D from './Image3D';

const Message3D = ({
  message,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#2f24c1',
  selected = false,
  onClick = null,
}) => {
  // Check if the message is an image
  const isImage = (msg) => {
    if (typeof msg === 'object') {
      // New backend structure - check for successful image generation
      if (msg.imageUrl && msg.imageGenerationStatus === 'success') {
        return true;
      }
      // Legacy structure
      if (msg.type === 'image' && msg.imageUrl) {
        return true;
      }
      // Direct imageUrl field
      if (msg.imageUrl && typeof msg.imageUrl === 'string') {
        return true;
      }
    }
    if (typeof msg === 'string') {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      return imageExtensions.some(ext => msg.toLowerCase().includes(ext));
    }
    return false;
  };

  // Extract image URL from message
  const getImageUrl = (msg) => {
    if (typeof msg === 'object') {
      // New backend structure
      if (msg.imageUrl && msg.imageGenerationStatus === 'success') {
        return msg.imageUrl;
      }
      // Legacy structure
      if (msg.type === 'image' && msg.imageUrl) {
        return msg.imageUrl;
      }
      // Direct imageUrl field
      if (msg.imageUrl && typeof msg.imageUrl === 'string') {
        return msg.imageUrl;
      }
    }
    if (typeof msg === 'string' && isImage(msg)) {
      return msg;
    }
    return null;
  };

  // Extract text from message
  const getText = (msg) => {
    if (typeof msg === 'object') {
      // New backend structure
      if (msg.body) {
        return msg.body;
      }
      // Legacy structure
      if (msg.text) {
        return msg.text;
      }
      // Fallback
      if (msg.message) {
        return msg.message;
      }
    }
    if (typeof msg === 'string' && !isImage(msg)) {
      return msg;
    }
    return 'Image Message';
  };

  const messageIsImage = isImage(message);
  const imageUrl = getImageUrl(message);
  const textContent = getText(message);

  if (messageIsImage && imageUrl) {
    return (
      <Image3D
        imageUrl={imageUrl}
        position={position}
        scale={scale}
        width={6}
        height={6}
      />
    );
  }

  return (
    <Text3D
      text={textContent}
      position={position}
      scale={scale}
      color={color}
    />
  );
};

export default Message3D;
