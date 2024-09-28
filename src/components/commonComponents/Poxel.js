// src/components/Poxel.js
import React, { useRef, useEffect } from 'react';
import { Box } from '@react-three/drei';
import { gsap } from 'gsap';

const Poxel = ({ position, color }) => {
  const meshRef = useRef();

  useEffect(() => {
    // Initial animation when the component mounts
    gsap.from(meshRef.current.position, {
      z: 80,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'bounce.out',
    });
    gsap.from(meshRef.current.material, {
      opacity: 0,
      duration: 0.6,
      ease: 'linear',
    });
  }, []);

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial
        color={color}
        transparent
        opacity={0.95}
        shininess={60}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};

export default Poxel;
