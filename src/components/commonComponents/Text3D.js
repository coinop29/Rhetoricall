/* eslint-disable */

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import Character from './Character';

const Text3D = ({
  text,
  position = [0, 0, 0], // Start at the center
  scale = [0.9, 1, 0.5],
  color = '#2f24c1',
}) => {
  const groupRef = useRef();

  // Initial position at the center
  const initialPosition = new Vector3(position[0], position[1], position[2]);

  // Current position of the text
  const currentPosition = useRef(initialPosition.clone());

  // Random target position within bounds
  const targetPosition = useRef(getRandomPosition());

  // Movement speed
  const speed = 0.5; // Adjust speed as needed

  // Function to get a random position within specified bounds
  function getRandomPosition() {
    // Define the bounds of movement
    const rangeX = 100; // Adjust range as needed
    const rangeY = 100;
    const rangeZ = 100;

    return new Vector3(
      (Math.random() - 0.5) * rangeX,
      (Math.random() - 0.5) * rangeY,
      (Math.random() - 0.5) * rangeZ
    );
  }

  useFrame(() => {
    // Calculate direction vector towards target
    const direction = targetPosition.current.clone().sub(currentPosition.current);
    const distance = direction.length();

    // Normalize direction vector and scale by speed
    const movement = direction.normalize().multiplyScalar(speed);

    // Move current position towards target
    currentPosition.current.add(movement);

    // Update group position
    groupRef.current.position.copy(currentPosition.current);

    // If the text is very close to the target, pick a new target
    if (distance < 1) {
      targetPosition.current = getRandomPosition();
    }
  });

  const lines = text.split('\n');

  return (
    <group ref={groupRef} scale={scale}>
      {lines.map((line, lineIndex) => {
        const chars = [...line];
        let offsetX = 0;
        return (
          <group key={lineIndex} position={[0, -6 * lineIndex * scale[1], 0]}>
            {chars.map((char, index) => {
              const delay = (lineIndex * chars.length + index) * 0.1;

              // For simplicity, use a fixed charWidth or adjust as needed
              const charWidth = 4 * scale[0];

              const charComponent = (
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

