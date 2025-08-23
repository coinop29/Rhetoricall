/* eslint-disable */

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useTexture } from '@react-three/drei';

const Image3D = ({
  imageUrl,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  width = 5,
  height = 5,
}) => {
  const groupRef = useRef();
  const meshRef = useRef();
  
  // Load the texture
  const texture = useTexture(imageUrl);

  // Initial position at the center
  const initialPosition = new Vector3(position[0], position[1], position[2]);

  // Current position of the image
  const currentPosition = useRef(initialPosition.clone());

  // Random target position within bounds
  const targetPosition = useRef(getRandomPosition());

  // Movement speed
  const speed = 0.3; // Slightly slower than text for better visual effect

  // Function to get a random position within specified bounds
  function getRandomPosition() {
    // Define the bounds of movement
    const rangeX = 80; // Slightly smaller range for images
    const rangeY = 80;
    const rangeZ = 80;

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

    // If the image is very close to the target, pick a new target
    if (distance < 1) {
      targetPosition.current = getRandomPosition();
    }
  });

  useEffect(() => {
    // Initial animation when the component mounts
    if (groupRef.current) {
      groupRef.current.position.z = 80;
      groupRef.current.scale.set(0, 0, 0);
      
      // Animate in
      const animateIn = () => {
        if (groupRef.current) {
          groupRef.current.position.z = position[2];
          groupRef.current.scale.set(scale[0], scale[1], scale[2]);
        }
      };
      
      // Delay the animation slightly for a staggered effect
      setTimeout(animateIn, Math.random() * 1000);
    }
  }, [position, scale]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          opacity={0.9}
          side={2} // Double-sided
        />
      </mesh>
      
      {/* Add a subtle glow effect */}
      <mesh position={[0, 0, -0.1]} scale={[1.1, 1.1, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
};

export default Image3D;
