/* eslint-disable */

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Message3D from './Message3D';

const MessageDemo = () => {
  const [messages] = useState([
    // Text message
    {
      type: 'text',
      text: 'Hello World!',
      timestamp: Date.now()
    },
    // Image message
    {
      type: 'image',
      imageUrl: 'https://picsum.photos/400/400?random=1',
      text: 'Random Image 1',
      timestamp: Date.now() + 1000
    },
    // Another text message
    {
      type: 'text',
      text: 'This is a test message',
      timestamp: Date.now() + 2000
    },
    // Another image message
    {
      type: 'image',
      imageUrl: 'https://picsum.photos/400/400?random=2',
      text: 'Random Image 2',
      timestamp: Date.now() + 3000
    }
  ]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        style={{ background: '#000' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        
        {messages.map((msg, index) => (
          <Message3D
            key={index}
            message={msg}
            position={[0, index * -4, 0]}
            scale={msg.type === 'image' ? [1, 1, 1] : [0.9, 1, 0.5]}
            color="#2f24c1"
          />
        ))}
      </Canvas>
    </div>
  );
};

export default MessageDemo;
