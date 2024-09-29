//
// import React, { useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import Character from './Character';
//
// const Text3D = ({
//   text,
//   position = [0, 0, 0],
//   scale = [0.9, 1, 0.5], // Reduced scale
//   color = '#2f24c1', // Change to string format
//
// }) => {
//   const groupRef = useRef();
//   const positionRef = useRef({
//     x: position[0],
//     y: position[1],
//     z: position[2],
//   });
//  const velocityRef = useRef({
//   x: (Math.random() - 0.5) * 0.3, // Increased speed
//   y: (Math.random() - 0.5) * 0.3,
//   z: 0,
// });
//
//
//   useFrame(() => {
//     positionRef.current.x += velocityRef.current.x;
//     positionRef.current.y += velocityRef.current.y;
//
//     // Implement wrap-around boundaries
//     const limit = 20;
//     if (positionRef.current.x > limit) {
//       positionRef.current.x = -limit;
//     }
//     if (positionRef.current.x < -limit) {
//       positionRef.current.x = limit;
//     }
//     if (positionRef.current.y > limit) {
//       positionRef.current.y = -limit;
//     }
//     if (positionRef.current.y < -limit) {
//       positionRef.current.y = limit;
//     }
//
//     groupRef.current.position.set(
//       positionRef.current.x,
//       positionRef.current.y,
//       positionRef.current.z
//     );
//   });
//
//   const lines = text.split('\n');
//
//   return (
//     <group ref={groupRef} position={position} scale={scale}>
//       {lines.map((line, lineIndex) => {
//         const chars = line.split('');
//         let offsetX = 0;
//         return (
//           <group key={lineIndex} position={[0, -6 * lineIndex * scale[1], 0]}>
//             {chars.map((char, index) => {
//               const charWidth = 4 * scale[0];
//               let charComponent;
//               const delay = (lineIndex * chars.length + index) * 0.1;
//
//                 charComponent = (
//                   <Character
//                     key={`${lineIndex}-${index}`}
//                     char={char}
//                     position={[offsetX, 0, 0]}
//                     color={color}
//                     delay={delay}
//                   />
//                 );
//                 offsetX += charWidth + 1 * scale[0];
//
//
//               return charComponent;
//             })}
//           </group>
//         );
//       })}
//     </group>
//   );
// };
//
// export default Text3D;
// import React, { useRef, useEffect } from 'react';
// import { useFrame } from '@react-three/fiber';
// import Character from './Character';
//
// const Text3D = ({
//   text,
//   position = [0, 0, 0],
//   scale = [0.9, 1, 0.5],
//   color = '#2f24c1',
// }) => {
//   const groupRef = useRef();
//
//   // Random initial values for movement
//   const initialPosition = useRef({
//     x: (Math.random() - 0.5) * 40,
//     y: (Math.random() - 0.5) * 40,
//     z: (Math.random() - 0.5) * 40,
//   });
//
//   const speed = useRef({
//     x: Math.random() * 0.5 + 0.5, // Speed between 0.5 and 1
//     y: Math.random() * 0.5 + 0.5,
//     z: Math.random() * 0.5 + 0.5,
//   });
//
//   const amplitude = useRef({
//     x: Math.random() * 20 + 10, // Amplitude between 10 and 30
//     y: Math.random() * 20 + 10,
//     z: Math.random() * 20 + 10,
//   });
//
//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime();
//
//     // Smooth movement using sine functions
//     groupRef.current.position.set(
//       initialPosition.current.x + Math.sin(t * speed.current.x) * amplitude.current.x,
//       initialPosition.current.y + Math.sin(t * speed.current.y) * amplitude.current.y,
//       initialPosition.current.z + Math.sin(t * speed.current.z) * amplitude.current.z
//     );
//   });
//
//   const lines = text.split('\n');
//
//   return (
//     <group ref={groupRef} scale={scale}>
//       {lines.map((line, lineIndex) => {
//         const chars = [...line];
//         let offsetX = 0;
//         return (
//           <group key={lineIndex} position={[0, -6 * lineIndex * scale[1], 0]}>
//             {chars.map((char, index) => {
//               const delay = (lineIndex * chars.length + index) * 0.1;
//
//               // You may need to import 'characters' if you use it here
//               // const charPixels = characters[char] || characters[char.toUpperCase()] || [];
//               // const charPixelWidth = Math.max(0, ...charPixels.map(pixel => pixel[0])) + 1;
//               // For simplicity, use a fixed charWidth or adjust as needed
//               const charWidth = 4 * scale[0];
//
//               const charComponent = (
//                 <Character
//                   key={`${lineIndex}-${index}`}
//                   char={char}
//                   position={[offsetX, 0, 0]}
//                   color={color}
//                   delay={delay}
//                 />
//               );
//
//               offsetX += charWidth + 1 * scale[0];
//
//               return charComponent;
//             })}
//           </group>
//         );
//       })}
//     </group>
//   );
// };
//
// export default Text3D;
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
