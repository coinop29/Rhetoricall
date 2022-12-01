import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useGLTF, useAnimations, Text } from "@react-three/drei";
import useAppStore from "../../store";

export function Cube(props) {
  const group = useRef(null);
  const { index, font } = props;
  const { nodes, materials, animations } = useGLTF(`/models/Cube${index % 5 + 1}.glb`);
  const { actions } = useAnimations(animations, group);
  const { cube } = useAppStore();

  const positions = [[6.26, -0.22, -5.72], [-4.92, 0.37, 0], [-11.97, -5.39, 0], [0, 7.91, 0], [-2.46, 6.49, -7.08]];
  const rotations = [[0, 0, 0.01], [0.64, 0.19, -0.14], [0, 0, 0.08], [0, 0, 0], [0, 0, -0.05]];
  const scales = [0.79, 1.87, 1, 1, 0.86];

  useEffect(() => {
    console.log('cube index=>', index)
    if(actions["Animation"] ) actions["Animation"].play();
    if(materials['']) materials[''].color.set('black');
  }, [actions]);
  
  useEffect(() => {
    console.log('index =====>', index, 'actions ======>', actions, 'materials ======>', materials)
  }, [])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name={index % 5 + 1}
          castShadow
          receiveShadow
          geometry={nodes[index % 5 + 1]?nodes[index % 5 + 1].geometry:THREE.Mesh.geometry}
          material={nodes[index % 5 + 1]?nodes[index % 5 + 1].material:THREE.Mesh.material}
          position={positions[index % 5]}
          rotation={rotations[index % 5]}
          scale={scales[index % 5]}
          userData={{ name: (index % 5 + 1) }}
        >
          <Text font={font} color={'yellow'} maxWidth={7.5} textAlign={'center'} whiteSpace={'overflowWrap'} overflowWrap={'break-word'}  fontSize={0.75} anchorX={'center'} anchorY={'middle'} position={[0, 0, 0.36]} >
           {cube[index]}
          </Text>
        </mesh>
      </group>
    </group>
  );
}
