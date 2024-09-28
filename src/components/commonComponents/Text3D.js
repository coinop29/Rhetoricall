
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Character from './Character';

const Text3D = ({
  text,
  position = [0, 0, 0],
  scale = [0.9, 1, 0.5], // Reduced scale
  color = '#2f24c1',
}) => {
  const groupRef = useRef();
  const positionRef = useRef({
    x: position[0],
    y: position[1],
    z: position[2],
  });
 const velocityRef = useRef({
  x: (Math.random() - 0.5) * 0.3, // Increased speed
  y: (Math.random() - 0.5) * 0.3,
  z: 0,
});


  useFrame(() => {
    positionRef.current.x += velocityRef.current.x;
    positionRef.current.y += velocityRef.current.y;

    // Implement wrap-around boundaries
    const limit = 20;
    if (positionRef.current.x > limit) {
      positionRef.current.x = -limit;
    }
    if (positionRef.current.x < -limit) {
      positionRef.current.x = limit;
    }
    if (positionRef.current.y > limit) {
      positionRef.current.y = -limit;
    }
    if (positionRef.current.y < -limit) {
      positionRef.current.y = limit;
    }

    groupRef.current.position.set(
      positionRef.current.x,
      positionRef.current.y,
      positionRef.current.z
    );
  });

  const lines = text.split('\n');

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {lines.map((line, lineIndex) => {
        const chars = line.split('');
        let offsetX = 0;
        return (
          <group key={lineIndex} position={[0, -6 * lineIndex * scale[1], 0]}>
            {chars.map((char, index) => {
              const charWidth = 4 * scale[0];
              let charComponent;
              const delay = (lineIndex * chars.length + index) * 0.1;

                charComponent = (
                  <Character
                    key={`${lineIndex}-${index}`}
                    char={char}
                    position={[offsetX, 0, 0]}
                    color={color}
                    delay={delay}
                  />
                );
                offsetX += charWidth + 1 * scale[0];


              return charComponent;
            })}
          </group>
        );
      })}
    </group>
  );
};

export default Text3D;
