/* eslint-disable */

import React, { useState } from 'react';
import { Box, Button, Stack, Typography, Paper, Divider } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Message3D } from '../../commonComponents';

const Demo = () => {
  const [messages, setMessages] = useState([
    // Text message
    {
      sid: 'SM1234567890',
      from: '+1234567890',
      body: 'Hello World! This is a text message.',
      imageUrl: null,
      imageGenerationStatus: 'skipped',
      displayMode: 'text',
      timestamp: Date.now()
    },
    // Successful image generation
    {
      sid: 'SM1234567891',
      from: '+1234567890',
      body: 'Generate a beautiful sunset over mountains',
      imageUrl: 'https://picsum.photos/400/400?random=1',
      imageGenerationStatus: 'success',
      displayMode: 'image',
      timestamp: Date.now() + 1000
    },
    // Failed image generation (falls back to text)
    {
      sid: 'SM1234567892',
      from: '+1234567890',
      body: 'Generate a futuristic cityscape',
      imageUrl: null,
      imageGenerationStatus: 'failed',
      displayMode: 'image',
      timestamp: Date.now() + 2000
    },
    // Another successful image
    {
      sid: 'SM1234567893',
      from: '+1234567890',
      body: 'Create an abstract art piece',
      imageUrl: 'https://picsum.photos/400/400?random=2',
      imageGenerationStatus: 'success',
      displayMode: 'image',
      timestamp: Date.now() + 3000
    }
  ]);

  const [currentMode, setCurrentMode] = useState('image');

  const addTextMessage = () => {
    const newMessage = {
      sid: `SM${Date.now()}`,
      from: '+1234567890',
      body: `Text message ${messages.length + 1}`,
      imageUrl: null,
      imageGenerationStatus: 'skipped',
      displayMode: 'text',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addImageMessage = () => {
    const newMessage = {
      sid: `SM${Date.now()}`,
      from: '+1234567890',
      body: `Generate image ${messages.length + 1}`,
      imageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
      imageGenerationStatus: 'success',
      displayMode: 'image',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addFailedImageMessage = () => {
    const newMessage = {
      sid: `SM${Date.now()}`,
      from: '+1234567890',
      body: `Failed image ${messages.length + 1}`,
      imageUrl: null,
      imageGenerationStatus: 'failed',
      displayMode: 'image',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'text' ? 'image' : 'text');
  };

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        🖼️ Image Integration Demo
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Display Mode: <span style={{ color: currentMode === 'image' ? '#4caf50' : '#757575' }}>
            {currentMode.toUpperCase()}
          </span>
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" onClick={addTextMessage}>
            Add Text Message
          </Button>
          <Button variant="contained" color="success" onClick={addImageMessage}>
            Add Image Message
          </Button>
          <Button variant="contained" color="warning" onClick={addFailedImageMessage}>
            Add Failed Image
          </Button>
          <Button variant="outlined" onClick={toggleMode}>
            Toggle Mode
          </Button>
          <Button variant="outlined" color="error" onClick={clearMessages}>
            Clear All
          </Button>
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          This demo shows how the frontend handles different message types from your backend.
          <br />
          • <strong>Text messages</strong> are displayed using Text3D component
          <br />
          • <strong>Successful image generation</strong> displays the generated image
          <br />
          • <strong>Failed image generation</strong> falls back to text display
          <br />
          • <strong>Display mode</strong> can be toggled between text and image modes
        </Typography>
      </Paper>

      <Box sx={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0, 30], fov: 60 }}
          style={{ background: '#000', borderRadius: '8px' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          <OrbitControls enableDamping dampingFactor={0.05} />
          
          {messages.map((msg, index) => (
            <Message3D
              key={msg.sid}
              message={msg}
              position={[0, index * -4, 0]}
              scale={msg.imageGenerationStatus === 'success' ? [1, 1, 1] : [0.9, 1, 0.5]}
              color="#2f24c1"
            />
          ))}
        </Canvas>
      </Box>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Message Log
        </Typography>
        <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
          {messages.map((msg, index) => (
            <Box key={msg.sid} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: '4px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Message {index + 1} - {msg.displayMode.toUpperCase()} Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SID: {msg.sid} | From: {msg.from}
              </Typography>
              <Typography variant="body2">
                Body: {msg.body}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {msg.imageGenerationStatus} | 
                Image: {msg.imageUrl ? 'Yes' : 'No'}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Demo;
