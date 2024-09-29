// import React, { useRef, useEffect } from 'react';
// import { Box } from '@react-three/drei';
// import { gsap } from 'gsap';
// import { Color } from 'three';
//
// const Poxel = ({ position, color }) => {
//   const meshRef = useRef();
//
//   useEffect(() => {
//     console.log('Poxel color:', color);
//     // Initial animation when the component mounts
//     gsap.from(meshRef.current.position, {
//       z: 80,
//       duration: 0.6 + Math.random() * 0.4,
//       ease: 'bounce.out',
//     });
//     gsap.from(meshRef.current.material, {
//       opacity: 0,
//       duration: 0.6,
//       ease: 'linear',
//     });
//   }, []);
//
//   const materialColor = new Color(color);
//
//   return (
//     <mesh ref={meshRef} position={position} castShadow receiveShadow>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshPhongMaterial
//         color={materialColor}
//         transparent
//         opacity={0.95}
//         shininess={60}
//         emissive={materialColor}
//         emissiveIntensity={0.6}
//       />
//     </mesh>
//   );
// };
//
// export default Poxel;
// src/commonComponents/Poxel.js
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Color } from 'three';

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

  const materialColor = new Color(color);

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial
        color={materialColor}
        transparent
        opacity={0.95}
        shininess={60}
        emissive={materialColor}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};

export default Poxel;
