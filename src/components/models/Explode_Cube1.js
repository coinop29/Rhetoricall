import { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, Text, Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import useAppStore from "../../store";

export function ECube1(props) {
  const group1 = useRef();
  const { font } = props;
  const { nodes, materials, animations } = useGLTF("/models/Explode_Cube1.glb");
  const { actions } = useAnimations(animations, group1);

  const [showText, setShowText] = useState(false);

  const { explode, convertCube, clearExplode, reset, setReset } = useAppStore();

  useEffect(() => {
    actions["Animation"].play();
    materials.CUBE.color.set('black');
  }, [actions]);

  useFrame(() => {
    (actions["Animation"].time > 2 && actions["Animation"].time < 16)
      ? !showText && setShowText(true)
      : showText && setShowText(false);
    if (actions["Animation"].time > 16) {
      actions["Animation"].stop();
      convertCube();
      clearExplode();
    }
  });

  useEffect(() => {
    if(reset) {
      actions["Animation"].startAt(0);
      setReset(false);
    }
  }, [reset]);

  return (
    <group ref={group1} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Explode_Cube1"
          position={[0, -0.91, 0]}
          scale={[9.35, 10.02, 9.9]}
        >
          <mesh scale={0.2}>
            <planeBufferGeometry attach="geometry" args={[0.01, 0.01, 0.01]} />
            {showText && (
              <Text font={font} color={'yellow'} maxWidth={7.5} textAlign={'center'} whiteSpace={'overflowWrap'} overflowWrap={'break-word'} fontSize={0.75} anchorX={'center'} anchorY={'middle'} position={[0, 0, 0.36]} >
                {explode}
              </Text>
            )}
            <Edges renderOrder={1000}>
              <meshBasicMaterial color="yellow" depthTest={false} />
            </Edges>
          </mesh>
          <mesh
            name="Cube_cell"
            geometry={nodes.Cube_cell.geometry}
            material={materials.CUBE}
            position={[-7.25, 39.37, -9.46]}
            rotation={[2.8, 1.21, -1.21]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell001"
            geometry={nodes.Cube_cell001.geometry}
            material={materials.CUBE}
            position={[-19.57, -30.56, 26.15]}
            rotation={[-1.23, -0.06, 2.93]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell002"
            geometry={nodes.Cube_cell002.geometry}
            material={materials.CUBE}
            position={[0.59, -9.06, -6.85]}
            rotation={[2.58, -0.49, -0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell003"
            geometry={nodes.Cube_cell003.geometry}
            material={materials.CUBE}
            position={[9.67, -7.22, -54.58]}
            rotation={[-0.89, -0.1, -0.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell004"
            geometry={nodes.Cube_cell004.geometry}
            material={materials.CUBE}
            position={[-3.33, -22.77, -7.45]}
            rotation={[0.3, -0.59, -1.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell005"
            geometry={nodes.Cube_cell005.geometry}
            material={materials.CUBE}
            position={[2.85, 28.2, -46.53]}
            rotation={[-1.64, 0.75, -2.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell006"
            geometry={nodes.Cube_cell006.geometry}
            material={materials.CUBE}
            position={[-1.21, 33.09, -3.44]}
            rotation={[1.38, -0.29, -0.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell007"
            geometry={nodes.Cube_cell007.geometry}
            material={materials.CUBE}
            position={[-9.23, 19.4, -15.62]}
            rotation={[-2.59, -0.75, -2.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell008"
            geometry={nodes.Cube_cell008.geometry}
            material={materials.CUBE}
            position={[-4.61, -20.96, -7.83]}
            rotation={[1.88, 0.1, -2.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell009"
            geometry={nodes.Cube_cell009.geometry}
            material={materials.CUBE}
            position={[-6.26, -1.5, 19]}
            rotation={[2.33, -0.59, 2.7]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell010"
            geometry={nodes.Cube_cell010.geometry}
            material={materials.CUBE}
            position={[13.17, -46.81, 10.77]}
            rotation={[-2.03, 0.71, -2.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell011"
            geometry={nodes.Cube_cell011.geometry}
            material={materials.CUBE}
            position={[-0.93, 24.58, -21.85]}
            rotation={[2.15, -1.09, -1.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell012"
            geometry={nodes.Cube_cell012.geometry}
            material={materials.CUBE}
            position={[4.35, 5.57, 13.23]}
            rotation={[-0.54, 0.02, -0.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell013"
            geometry={nodes.Cube_cell013.geometry}
            material={materials.CUBE}
            position={[-0.58, -3.04, 19.31]}
            rotation={[1.05, -0.92, -0.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell014"
            geometry={nodes.Cube_cell014.geometry}
            material={materials.CUBE}
            position={[5.64, -25.7, -13]}
            rotation={[-2.09, -0.72, -1.72]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell015"
            geometry={nodes.Cube_cell015.geometry}
            material={materials.CUBE}
            position={[-14.87, 10.36, -34.6]}
            rotation={[-0.15, -0.44, -1.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell016"
            geometry={nodes.Cube_cell016.geometry}
            material={materials.CUBE}
            position={[12.81, -19.5, 15.11]}
            rotation={[-3.01, 0.27, -2.77]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell017"
            geometry={nodes.Cube_cell017.geometry}
            material={materials.CUBE}
            position={[13.19, -16.23, 63.18]}
            rotation={[0.11, -0.55, -2.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell018"
            geometry={nodes.Cube_cell018.geometry}
            material={materials.CUBE}
            position={[5.53, 60.98, -31.4]}
            rotation={[2.91, 0.18, 0.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell019"
            geometry={nodes.Cube_cell019.geometry}
            material={materials.CUBE}
            position={[-4.35, -7.14, 3.03]}
            rotation={[-3.03, -0.2, 1.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell020"
            geometry={nodes.Cube_cell020.geometry}
            material={materials.CUBE}
            position={[15.36, -14.59, 32.07]}
            rotation={[-2.59, 0.04, 0.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell021"
            geometry={nodes.Cube_cell021.geometry}
            material={materials.CUBE}
            position={[-0.32, 12.24, -28.72]}
            rotation={[0.03, 0.58, -0.31]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell022"
            geometry={nodes.Cube_cell022.geometry}
            material={materials.CUBE}
            position={[-32.57, -28.77, 1.12]}
            rotation={[-1.55, 0.52, 0.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell023"
            geometry={nodes.Cube_cell023.geometry}
            material={materials.CUBE}
            position={[1.95, -1.37, -17.99]}
            rotation={[-0.4, 0.59, -1.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell024"
            geometry={nodes.Cube_cell024.geometry}
            material={materials.CUBE}
            position={[-15.46, 13.52, 33.48]}
            rotation={[-0.19, 0.35, 0.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell025"
            geometry={nodes.Cube_cell025.geometry}
            material={materials.CUBE}
            position={[14.97, -32.57, 15.11]}
            rotation={[0.13, 1.3, 1.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell026"
            geometry={nodes.Cube_cell026.geometry}
            material={materials.CUBE}
            position={[37.18, -10.59, -36.24]}
            rotation={[0.2, 0, 0.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell027"
            geometry={nodes.Cube_cell027.geometry}
            material={materials.CUBE}
            position={[-27.66, -15.85, 0.9]}
            rotation={[0.94, 0.69, -0.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell028"
            geometry={nodes.Cube_cell028.geometry}
            material={materials.CUBE}
            position={[3.75, -31.28, 25.62]}
            rotation={[2.83, 0.11, -1.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell029"
            geometry={nodes.Cube_cell029.geometry}
            material={materials.CUBE}
            position={[-0.99, 6.22, -23.26]}
            rotation={[-0.88, 0.86, 0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell030"
            geometry={nodes.Cube_cell030.geometry}
            material={materials.CUBE}
            position={[-3.41, -1.42, -38.46]}
            rotation={[-2.35, 1.12, 2.79]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell031"
            geometry={nodes.Cube_cell031.geometry}
            material={materials.CUBE}
            position={[1.66, 30.18, -0.55]}
            rotation={[-0.84, 0.4, 0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell032"
            geometry={nodes.Cube_cell032.geometry}
            material={materials.CUBE}
            position={[-9.71, -46.66, -4.41]}
            rotation={[-0.08, 0.27, 1.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell033"
            geometry={nodes.Cube_cell033.geometry}
            material={materials.CUBE}
            position={[-3.08, 6.19, 13.88]}
            rotation={[0.7, 0.6, -0.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell034"
            geometry={nodes.Cube_cell034.geometry}
            material={materials.CUBE}
            position={[5.19, -37.13, 22.19]}
            rotation={[-1.05, -1.07, 1.73]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell035"
            geometry={nodes.Cube_cell035.geometry}
            material={materials.CUBE}
            position={[3.94, -40.46, 6.05]}
            rotation={[-2.56, -0.96, -2.77]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell036"
            geometry={nodes.Cube_cell036.geometry}
            material={materials.CUBE}
            position={[-0.65, 2.1, -2.89]}
            rotation={[0.7, -0.38, -1.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell037"
            geometry={nodes.Cube_cell037.geometry}
            material={materials.CUBE}
            position={[3.35, 34.05, 35.15]}
            rotation={[-0.69, 0.22, 2.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell038"
            geometry={nodes.Cube_cell038.geometry}
            material={materials.CUBE}
            position={[-36.05, -19.49, -39.44]}
            rotation={[0.85, 0.79, 1.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell039"
            geometry={nodes.Cube_cell039.geometry}
            material={materials.CUBE}
            position={[3.56, -2.71, 35.6]}
            rotation={[2.01, -0.82, -1.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell040"
            geometry={nodes.Cube_cell040.geometry}
            material={materials.CUBE}
            position={[7.58, 20.91, -28.61]}
            rotation={[1.14, -0.39, 1.22]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell041"
            geometry={nodes.Cube_cell041.geometry}
            material={materials.CUBE}
            position={[-9.29, 47.6, -64.48]}
            rotation={[1.16, 0.51, -1.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell042"
            geometry={nodes.Cube_cell042.geometry}
            material={materials.CUBE}
            position={[18.86, -17.33, -18.17]}
            rotation={[-1.33, 0.2, -0.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell043"
            geometry={nodes.Cube_cell043.geometry}
            material={materials.CUBE}
            position={[6.32, 4.52, 1.93]}
            rotation={[-0.5, 0.75, 0.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell044"
            geometry={nodes.Cube_cell044.geometry}
            material={materials.CUBE}
            position={[-4.18, 8.3, 5.85]}
            rotation={[0.19, -0.82, 1.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell045"
            geometry={nodes.Cube_cell045.geometry}
            material={materials.CUBE}
            position={[-12.74, 12.02, -55.37]}
            rotation={[-2.86, -0.13, -3.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell046"
            geometry={nodes.Cube_cell046.geometry}
            material={materials.CUBE}
            position={[5.86, -7.08, 30.94]}
            rotation={[0.46, -0.1, -0.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell047"
            geometry={nodes.Cube_cell047.geometry}
            material={materials.CUBE}
            position={[-7.08, -3.66, 2.27]}
            rotation={[-1.07, -0.21, 0.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell048"
            geometry={nodes.Cube_cell048.geometry}
            material={materials.CUBE}
            position={[-9.52, -8.3, -26.16]}
            rotation={[1.84, 0.72, -1.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell049"
            geometry={nodes.Cube_cell049.geometry}
            material={materials.CUBE}
            position={[0.84, -45.57, 18.94]}
            rotation={[-1, 1.3, -2.29]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell050"
            geometry={nodes.Cube_cell050.geometry}
            material={materials.CUBE}
            position={[7.12, -3.34, -35.21]}
            rotation={[2.92, 0.19, 2.87]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell051"
            geometry={nodes.Cube_cell051.geometry}
            material={materials.CUBE}
            position={[-4.55, -41.8, -42.67]}
            rotation={[-2.07, -0.28, 1.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell052"
            geometry={nodes.Cube_cell052.geometry}
            material={materials.CUBE}
            position={[-20.38, -62.26, -33.17]}
            rotation={[-0.43, 0.38, -0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell053"
            geometry={nodes.Cube_cell053.geometry}
            material={materials.CUBE}
            position={[-5.29, 43.96, 21.28]}
            rotation={[-2.24, -0.54, 2.31]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell054"
            geometry={nodes.Cube_cell054.geometry}
            material={materials.CUBE}
            position={[13.08, -13.78, -27.95]}
            rotation={[0.85, 0.64, 0]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell055"
            geometry={nodes.Cube_cell055.geometry}
            material={materials.CUBE}
            position={[-8.03, -47.67, -17.57]}
            rotation={[-2.39, 0.18, -0.81]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell056"
            geometry={nodes.Cube_cell056.geometry}
            material={materials.CUBE}
            position={[-12.6, 33.89, -25.26]}
            rotation={[-2.98, -0.49, 2.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell057"
            geometry={nodes.Cube_cell057.geometry}
            material={materials.CUBE}
            position={[-2.79, 6.21, 21.51]}
            rotation={[-0.46, -0.01, -1.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell058"
            geometry={nodes.Cube_cell058.geometry}
            material={materials.CUBE}
            position={[12.71, -4.38, 49.63]}
            rotation={[0.79, 0.31, -0.76]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell059"
            geometry={nodes.Cube_cell059.geometry}
            material={materials.CUBE}
            position={[10.96, 0.45, 44.47]}
            rotation={[0.18, -0.8, -1.63]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell060"
            geometry={nodes.Cube_cell060.geometry}
            material={materials.CUBE}
            position={[3.28, 3, -57.58]}
            rotation={[0.82, -0.94, 0.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell061"
            geometry={nodes.Cube_cell061.geometry}
            material={materials.CUBE}
            position={[3.68, -8.53, -7.89]}
            rotation={[-0.76, 1.2, -1.17]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell062"
            geometry={nodes.Cube_cell062.geometry}
            material={materials.CUBE}
            position={[-14.9, 10.19, 31.58]}
            rotation={[1.24, 0.01, 0.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell063"
            geometry={nodes.Cube_cell063.geometry}
            material={materials.CUBE}
            position={[7.71, -17.14, 32.11]}
            rotation={[-0.29, 0.23, 1.83]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell064"
            geometry={nodes.Cube_cell064.geometry}
            material={materials.CUBE}
            position={[-1.4, -2.28, 35.06]}
            rotation={[0.47, -1.06, -0.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell065"
            geometry={nodes.Cube_cell065.geometry}
            material={materials.CUBE}
            position={[5.62, -35.67, 3.3]}
            rotation={[2.21, 0.92, -2.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell066"
            geometry={nodes.Cube_cell066.geometry}
            material={materials.CUBE}
            position={[1.37, 2.62, -48.17]}
            rotation={[0.35, 0.59, -2.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell067"
            geometry={nodes.Cube_cell067.geometry}
            material={materials.CUBE}
            position={[4.07, 30.87, 48.03]}
            rotation={[2.49, -0.81, 2.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell068"
            geometry={nodes.Cube_cell068.geometry}
            material={materials.CUBE}
            position={[0.89, -43.95, 38.06]}
            rotation={[0.2, -0.39, 0.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell069"
            geometry={nodes.Cube_cell069.geometry}
            material={materials.CUBE}
            position={[-13.8, -22.89, 1.3]}
            rotation={[-1.33, -1.06, 0.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell070"
            geometry={nodes.Cube_cell070.geometry}
            material={materials.CUBE}
            position={[-0.24, 30.98, -31.83]}
            rotation={[0.34, 0.11, 0.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell071"
            geometry={nodes.Cube_cell071.geometry}
            material={materials.CUBE}
            position={[9.11, -16.09, -12.02]}
            rotation={[-1.93, -1.06, -2.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell072"
            geometry={nodes.Cube_cell072.geometry}
            material={materials.CUBE}
            position={[3.41, 28.23, 28.46]}
            rotation={[-2.06, 0.25, 0.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell073"
            geometry={nodes.Cube_cell073.geometry}
            material={materials.CUBE}
            position={[-41.39, 1.16, 20.07]}
            rotation={[-1.58, 0.19, 1.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell074"
            geometry={nodes.Cube_cell074.geometry}
            material={materials.CUBE}
            position={[10.39, -12.14, -20.73]}
            rotation={[1.8, -1.02, -0.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell075"
            geometry={nodes.Cube_cell075.geometry}
            material={materials.CUBE}
            position={[1.72, 22.15, -2.97]}
            rotation={[-0.66, 1, 0.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell076"
            geometry={nodes.Cube_cell076.geometry}
            material={materials.CUBE}
            position={[-13.87, 8.3, 4.69]}
            rotation={[3.09, -0.04, -1.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell077"
            geometry={nodes.Cube_cell077.geometry}
            material={materials.CUBE}
            position={[10.87, 52.35, -2.31]}
            rotation={[2.85, 0.68, -0.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell078"
            geometry={nodes.Cube_cell078.geometry}
            material={materials.CUBE}
            position={[-6.5, -23.8, -39.11]}
            rotation={[-0.57, 0.2, 2.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell079"
            geometry={nodes.Cube_cell079.geometry}
            material={materials.CUBE}
            position={[-5.4, 8.51, -0.85]}
            rotation={[-1.29, -0.53, -0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell080"
            geometry={nodes.Cube_cell080.geometry}
            material={materials.CUBE}
            position={[7.56, 18.49, 6.19]}
            rotation={[0.62, -0.73, 1.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell081"
            geometry={nodes.Cube_cell081.geometry}
            material={materials.CUBE}
            position={[-12.35, -28.35, -35.68]}
            rotation={[-1.92, -0.83, -1.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell082"
            geometry={nodes.Cube_cell082.geometry}
            material={materials.CUBE}
            position={[27.77, 6.9, -9.49]}
            rotation={[2.46, -0.23, 2.87]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell083"
            geometry={nodes.Cube_cell083.geometry}
            material={materials.CUBE}
            position={[35.56, 9.63, 35.01]}
            rotation={[0.61, 0.22, 2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell084"
            geometry={nodes.Cube_cell084.geometry}
            material={materials.CUBE}
            position={[8.35, 31.04, 13.34]}
            rotation={[3.01, -0.61, 2.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell085"
            geometry={nodes.Cube_cell085.geometry}
            material={materials.CUBE}
            position={[5.15, 38.43, 0.19]}
            rotation={[0.13, 1.47, 0.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell086"
            geometry={nodes.Cube_cell086.geometry}
            material={materials.CUBE}
            position={[4.44, -2.71, -20.42]}
            rotation={[3.09, 0.55, -0.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell087"
            geometry={nodes.Cube_cell087.geometry}
            material={materials.CUBE}
            position={[-2.65, -50.04, -15.62]}
            rotation={[1.62, 0.41, -0.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell088"
            geometry={nodes.Cube_cell088.geometry}
            material={materials.CUBE}
            position={[5.05, -38.43, 16.39]}
            rotation={[-0.53, -0.3, 0.59]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell089"
            geometry={nodes.Cube_cell089.geometry}
            material={materials.CUBE}
            position={[-28.55, -47.13, -18.48]}
            rotation={[-2.03, -0.24, -2.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell090"
            geometry={nodes.Cube_cell090.geometry}
            material={materials.CUBE}
            position={[-28, -23.08, 21.27]}
            rotation={[-0.45, -0.58, 2.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell091"
            geometry={nodes.Cube_cell091.geometry}
            material={materials.CUBE}
            position={[11.98, -62.42, -2.85]}
            rotation={[0.07, -1.31, -2.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell092"
            geometry={nodes.Cube_cell092.geometry}
            material={materials.CUBE}
            position={[21.82, 21.3, -19.42]}
            rotation={[-1.04, -1, -1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell093"
            geometry={nodes.Cube_cell093.geometry}
            material={materials.CUBE}
            position={[12.37, 18.24, -27.26]}
            rotation={[-2.24, -0.32, -1.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell094"
            geometry={nodes.Cube_cell094.geometry}
            material={materials.CUBE}
            position={[-6.44, -15.7, 22.25]}
            rotation={[2.66, -0.42, -3.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell095"
            geometry={nodes.Cube_cell095.geometry}
            material={materials.CUBE}
            position={[-4.89, 49.53, 16.63]}
            rotation={[-1.38, -0.36, -1.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell096"
            geometry={nodes.Cube_cell096.geometry}
            material={materials.CUBE}
            position={[4.73, 31.11, -16.75]}
            rotation={[3.09, 0.07, -2.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell097"
            geometry={nodes.Cube_cell097.geometry}
            material={materials.CUBE}
            position={[6.41, 32.71, 28.47]}
            rotation={[1.09, -0.42, 0.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell098"
            geometry={nodes.Cube_cell098.geometry}
            material={materials.CUBE}
            position={[-6.98, 7.77, 4.47]}
            rotation={[1.37, -0.44, 2.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell099"
            geometry={nodes.Cube_cell099.geometry}
            material={materials.CUBE}
            position={[-54.64, -2, 8.4]}
            rotation={[-3.06, 0, -2.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell100"
            geometry={nodes.Cube_cell100.geometry}
            material={materials.CUBE}
            position={[-4.25, 17.43, -12.12]}
            rotation={[2.68, 0.41, -0.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell101"
            geometry={nodes.Cube_cell101.geometry}
            material={materials.CUBE}
            position={[-10.59, -52.24, 7.81]}
            rotation={[-2.75, -0.05, -0.19]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell102"
            geometry={nodes.Cube_cell102.geometry}
            material={materials.CUBE}
            position={[2.73, 4.1, 47.18]}
            rotation={[1.3, -0.29, 0.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell103"
            geometry={nodes.Cube_cell103.geometry}
            material={materials.CUBE}
            position={[6.32, 8.53, -33.93]}
            rotation={[0.31, 1.34, 1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell104"
            geometry={nodes.Cube_cell104.geometry}
            material={materials.CUBE}
            position={[-6.64, 2.96, 34.24]}
            rotation={[0.54, -0.04, 2.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell105"
            geometry={nodes.Cube_cell105.geometry}
            material={materials.CUBE}
            position={[-1.14, 21.1, 16.65]}
            rotation={[2.79, 1.19, 0.81]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell106"
            geometry={nodes.Cube_cell106.geometry}
            material={materials.CUBE}
            position={[-6.52, -5.26, -10.24]}
            rotation={[1.22, -0.53, -1.6]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell107"
            geometry={nodes.Cube_cell107.geometry}
            material={materials.CUBE}
            position={[-1.5, -1.4, -3.19]}
            rotation={[-0.19, 0.04, 2.73]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell108"
            geometry={nodes.Cube_cell108.geometry}
            material={materials.CUBE}
            position={[6.08, -2.85, 18.86]}
            rotation={[-2.3, -1.24, 0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell109"
            geometry={nodes.Cube_cell109.geometry}
            material={materials.CUBE}
            position={[28.49, -11.76, -31.37]}
            rotation={[1.5, -0.01, -0.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell110"
            geometry={nodes.Cube_cell110.geometry}
            material={materials.CUBE}
            position={[-8.3, 37.69, -1.95]}
            rotation={[2.3, -0.3, -0.46]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell111"
            geometry={nodes.Cube_cell111.geometry}
            material={materials.CUBE}
            position={[5.84, 58.01, -4.44]}
            rotation={[-1.73, 1.24, 0.6]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell112"
            geometry={nodes.Cube_cell112.geometry}
            material={materials.CUBE}
            position={[7.13, 25.39, -8.12]}
            rotation={[-1.54, 0.63, 1.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell113"
            geometry={nodes.Cube_cell113.geometry}
            material={materials.CUBE}
            position={[-1.76, 33.47, 55.28]}
            rotation={[1.14, 1.14, -0.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell114"
            geometry={nodes.Cube_cell114.geometry}
            material={materials.CUBE}
            position={[-5.74, -24.92, 25.41]}
            rotation={[-2.7, 0.25, -3.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell115"
            geometry={nodes.Cube_cell115.geometry}
            material={materials.CUBE}
            position={[10.47, -26.53, 30.69]}
            rotation={[1.82, -0.32, 0.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell116"
            geometry={nodes.Cube_cell116.geometry}
            material={materials.CUBE}
            position={[4.65, 43.37, 7.84]}
            rotation={[2.89, -1.45, -0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell117"
            geometry={nodes.Cube_cell117.geometry}
            material={materials.CUBE}
            position={[-7.58, 21.45, 35.08]}
            rotation={[2.97, -0.25, -2.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell118"
            geometry={nodes.Cube_cell118.geometry}
            material={materials.CUBE}
            position={[-45.56, -12.89, -34.89]}
            rotation={[0.56, -0.85, 2.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell119"
            geometry={nodes.Cube_cell119.geometry}
            material={materials.CUBE}
            position={[-5.12, -10.43, 26.99]}
            rotation={[0.9, 0.9, 1.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell120"
            geometry={nodes.Cube_cell120.geometry}
            material={materials.CUBE}
            position={[-1.41, -31.72, -8.57]}
            rotation={[0.1, -0.44, 0.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell121"
            geometry={nodes.Cube_cell121.geometry}
            material={materials.CUBE}
            position={[-3.77, 19.55, 45.11]}
            rotation={[-2.91, -0.85, -2.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell122"
            geometry={nodes.Cube_cell122.geometry}
            material={materials.CUBE}
            position={[-6.99, 11.68, -3.35]}
            rotation={[-0.34, -0.19, 2.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell123"
            geometry={nodes.Cube_cell123.geometry}
            material={materials.CUBE}
            position={[-2.71, -19.43, -26.71]}
            rotation={[-1.45, -0.6, 0.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell124"
            geometry={nodes.Cube_cell124.geometry}
            material={materials.CUBE}
            position={[-10.6, -0.51, -39.77]}
            rotation={[-2.52, 0.57, 2.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell125"
            geometry={nodes.Cube_cell125.geometry}
            material={materials.CUBE}
            position={[-8.14, 9.44, -13.39]}
            rotation={[1.05, -0.85, -2.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell126"
            geometry={nodes.Cube_cell126.geometry}
            material={materials.CUBE}
            position={[-11.4, -20.38, 25.11]}
            rotation={[-0.05, 0.68, 0.62]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell127"
            geometry={nodes.Cube_cell127.geometry}
            material={materials.CUBE}
            position={[1.17, 15.49, -14.88]}
            rotation={[1.31, -1.03, 0.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell128"
            geometry={nodes.Cube_cell128.geometry}
            material={materials.CUBE}
            position={[2.82, -31.66, 39.24]}
            rotation={[-0.01, -0.19, 0.19]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell129"
            geometry={nodes.Cube_cell129.geometry}
            material={materials.CUBE}
            position={[-10.09, -27.56, 15.97]}
            rotation={[-2.22, 0.03, 1.21]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell130"
            geometry={nodes.Cube_cell130.geometry}
            material={materials.CUBE}
            position={[-0.06, -7.47, 2.68]}
            rotation={[-1.27, 0.46, 1.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell131"
            geometry={nodes.Cube_cell131.geometry}
            material={materials.CUBE}
            position={[5.82, -23.48, -2.81]}
            rotation={[1.07, -1.46, -1.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell132"
            geometry={nodes.Cube_cell132.geometry}
            material={materials.CUBE}
            position={[0.98, 29.97, -29.11]}
            rotation={[0.53, -0.58, 0.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell133"
            geometry={nodes.Cube_cell133.geometry}
            material={materials.CUBE}
            position={[8.92, 60.56, 36.89]}
            rotation={[-0.06, 1.23, 1.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell134"
            geometry={nodes.Cube_cell134.geometry}
            material={materials.CUBE}
            position={[5.39, -5.94, 20.94]}
            rotation={[0.49, -0.56, 2.62]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell135"
            geometry={nodes.Cube_cell135.geometry}
            material={materials.CUBE}
            position={[-1.35, 23.34, -9.61]}
            rotation={[1.07, 0.37, 1.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell136"
            geometry={nodes.Cube_cell136.geometry}
            material={materials.CUBE}
            position={[10.98, -56.07, -17.73]}
            rotation={[-0.23, 0.92, -0.89]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell137"
            geometry={nodes.Cube_cell137.geometry}
            material={materials.CUBE}
            position={[5.65, -4.18, 53.45]}
            rotation={[-0.27, -0.19, 1.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell138"
            geometry={nodes.Cube_cell138.geometry}
            material={materials.CUBE}
            position={[-1.5, 11.63, -38.42]}
            rotation={[-0.36, -0.24, 2.79]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell139"
            geometry={nodes.Cube_cell139.geometry}
            material={materials.CUBE}
            position={[6.93, 35.74, -14.19]}
            rotation={[-1, -0.3, 1.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell140"
            geometry={nodes.Cube_cell140.geometry}
            material={materials.CUBE}
            position={[-0.82, 24.12, 7.77]}
            rotation={[1.49, -0.14, 3.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell141"
            geometry={nodes.Cube_cell141.geometry}
            material={materials.CUBE}
            position={[-7.89, -19.44, 4.89]}
            rotation={[1.84, -0.39, -0.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell142"
            geometry={nodes.Cube_cell142.geometry}
            material={materials.CUBE}
            position={[6.6, -10.81, -75.54]}
            rotation={[-1.51, -1.13, -0.58]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell143"
            geometry={nodes.Cube_cell143.geometry}
            material={materials.CUBE}
            position={[6.35, -19.32, -35.26]}
            rotation={[-0.42, 0.58, 1.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell144"
            geometry={nodes.Cube_cell144.geometry}
            material={materials.CUBE}
            position={[-30.6, -21.22, -23.43]}
            rotation={[-0.87, 1.25, 0.22]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell145"
            geometry={nodes.Cube_cell145.geometry}
            material={materials.CUBE}
            position={[-5.19, -20.9, 26.25]}
            rotation={[2.58, 0.39, -2.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell146"
            geometry={nodes.Cube_cell146.geometry}
            material={materials.CUBE}
            position={[-2.32, -1.69, -39.91]}
            rotation={[-0.75, -0.87, 1.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell147"
            geometry={nodes.Cube_cell147.geometry}
            material={materials.CUBE}
            position={[-6.08, 55.7, 2.49]}
            rotation={[0.81, 0.73, -0.44]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell148"
            geometry={nodes.Cube_cell148.geometry}
            material={materials.CUBE}
            position={[-4.46, 20.99, -22.52]}
            rotation={[-2.62, 0.87, -2.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell149"
            geometry={nodes.Cube_cell149.geometry}
            material={materials.CUBE}
            position={[0.15, -3.12, -16.29]}
            rotation={[1.59, -0.15, -1.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell150"
            geometry={nodes.Cube_cell150.geometry}
            material={materials.CUBE}
            position={[-35.54, 3.25, -19.93]}
            rotation={[-0.15, -0.39, 0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell151"
            geometry={nodes.Cube_cell151.geometry}
            material={materials.CUBE}
            position={[-26.16, 9.57, -15.43]}
            rotation={[0.11, 0.2, -0.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell152"
            geometry={nodes.Cube_cell152.geometry}
            material={materials.CUBE}
            position={[-6.08, -10.63, 46.12]}
            rotation={[-0.93, -0.08, -0.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell153"
            geometry={nodes.Cube_cell153.geometry}
            material={materials.CUBE}
            position={[10.54, -52.6, 13.75]}
            rotation={[1.06, 0.43, -2.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell154"
            geometry={nodes.Cube_cell154.geometry}
            material={materials.CUBE}
            position={[4.94, -15.01, 1.69]}
            rotation={[0.06, 0.62, -0.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell155"
            geometry={nodes.Cube_cell155.geometry}
            material={materials.CUBE}
            position={[6.95, -35.25, 8.17]}
            rotation={[-1.93, -0.74, 1.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell156"
            geometry={nodes.Cube_cell156.geometry}
            material={materials.CUBE}
            position={[14.66, -35.07, -27.88]}
            rotation={[0.48, 0.26, -0.3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell157"
            geometry={nodes.Cube_cell157.geometry}
            material={materials.CUBE}
            position={[7.71, -3.72, -14.99]}
            rotation={[-0.73, -0.12, -0.74]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell158"
            geometry={nodes.Cube_cell158.geometry}
            material={materials.CUBE}
            position={[-13.6, -41.66, 7.38]}
            rotation={[-2.99, -0.97, -2.91]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell159"
            geometry={nodes.Cube_cell159.geometry}
            material={materials.CUBE}
            position={[8.27, -58.55, -22.67]}
            rotation={[-0.21, 0.91, 0.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell160"
            geometry={nodes.Cube_cell160.geometry}
            material={materials.CUBE}
            position={[-13.44, -0.94, -8.84]}
            rotation={[-0.6, 0.77, 0.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell161"
            geometry={nodes.Cube_cell161.geometry}
            material={materials.CUBE}
            position={[26.97, -14.93, 10.68]}
            rotation={[2.81, 0.28, 2.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell162"
            geometry={nodes.Cube_cell162.geometry}
            material={materials.CUBE}
            position={[2.79, -50.82, 26.02]}
            rotation={[-2.85, 0.85, -2.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell163"
            geometry={nodes.Cube_cell163.geometry}
            material={materials.CUBE}
            position={[0.25, -2.51, -4.42]}
            rotation={[2.86, -0.44, -1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell164"
            geometry={nodes.Cube_cell164.geometry}
            material={materials.CUBE}
            position={[-6.92, -9.74, -9.28]}
            rotation={[-0.96, 0.53, 1.39]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell165"
            geometry={nodes.Cube_cell165.geometry}
            material={materials.CUBE}
            position={[33.16, 14.4, -0.91]}
            rotation={[-0.87, -0.72, -1.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell166"
            geometry={nodes.Cube_cell166.geometry}
            material={materials.CUBE}
            position={[30.04, 6.23, -15.14]}
            rotation={[3.14, -0.04, 2.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell167"
            geometry={nodes.Cube_cell167.geometry}
            material={materials.CUBE}
            position={[7.52, 18.91, -41.13]}
            rotation={[-0.78, 0.57, -0.3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell168"
            geometry={nodes.Cube_cell168.geometry}
            material={materials.CUBE}
            position={[3.14, 12.72, -6.55]}
            rotation={[-0.52, -0.36, 0.73]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell169"
            geometry={nodes.Cube_cell169.geometry}
            material={materials.CUBE}
            position={[5.14, 47.72, -0.42]}
            rotation={[-0.14, -0.25, -0.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell170"
            geometry={nodes.Cube_cell170.geometry}
            material={materials.CUBE}
            position={[-6.59, -0.81, 6.29]}
            rotation={[-2.64, 0.51, -0.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell171"
            geometry={nodes.Cube_cell171.geometry}
            material={materials.CUBE}
            position={[8.07, 37.65, -32.92]}
            rotation={[1.17, -0.24, -0.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell172"
            geometry={nodes.Cube_cell172.geometry}
            material={materials.CUBE}
            position={[-3.35, -15.26, -49.49]}
            rotation={[2.64, -0.48, 2.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell173"
            geometry={nodes.Cube_cell173.geometry}
            material={materials.CUBE}
            position={[-32.04, -19.87, -11.39]}
            rotation={[-1.47, -0.28, -2.29]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell174"
            geometry={nodes.Cube_cell174.geometry}
            material={materials.CUBE}
            position={[-16.81, -50.54, -21.73]}
            rotation={[1.3, -0.47, 0.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell175"
            geometry={nodes.Cube_cell175.geometry}
            material={materials.CUBE}
            position={[-2.11, -7.91, 6.43]}
            rotation={[-0.56, 0.25, -0.39]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell176"
            geometry={nodes.Cube_cell176.geometry}
            material={materials.CUBE}
            position={[-5.5, -17.31, -39.08]}
            rotation={[0.84, -0.64, 0.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell177"
            geometry={nodes.Cube_cell177.geometry}
            material={materials.CUBE}
            position={[33.77, 13.95, -12.16]}
            rotation={[0.31, -0.81, 2.53]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell178"
            geometry={nodes.Cube_cell178.geometry}
            material={materials.CUBE}
            position={[3.3, -14.88, 16.94]}
            rotation={[-2.49, -0.59, 1.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell179"
            geometry={nodes.Cube_cell179.geometry}
            material={materials.CUBE}
            position={[20.78, -2.69, -40.62]}
            rotation={[0.69, 0.34, -1.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell180"
            geometry={nodes.Cube_cell180.geometry}
            material={materials.CUBE}
            position={[1.96, -7.52, -9.16]}
            rotation={[-1.2, 0.08, 2.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell181"
            geometry={nodes.Cube_cell181.geometry}
            material={materials.CUBE}
            position={[2.83, -26.67, 27.03]}
            rotation={[0.15, 0.13, -1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell182"
            geometry={nodes.Cube_cell182.geometry}
            material={materials.CUBE}
            position={[-2.72, 42.15, 35.86]}
            rotation={[-0.85, 0.21, 2.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell183"
            geometry={nodes.Cube_cell183.geometry}
            material={materials.CUBE}
            position={[-6.03, 8.15, -23.41]}
            rotation={[1.07, 0.72, 0.6]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell184"
            geometry={nodes.Cube_cell184.geometry}
            material={materials.CUBE}
            position={[-39.88, 10.65, -9.93]}
            rotation={[-0.14, -0.21, 1.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell185"
            geometry={nodes.Cube_cell185.geometry}
            material={materials.CUBE}
            position={[7.47, 39.1, 11.14]}
            rotation={[-1.94, -1.13, -2.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell186"
            geometry={nodes.Cube_cell186.geometry}
            material={materials.CUBE}
            position={[-1.04, -27.46, 2.59]}
            rotation={[-2.74, 0.54, -2.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell187"
            geometry={nodes.Cube_cell187.geometry}
            material={materials.CUBE}
            position={[-40.87, 8.27, 15.41]}
            rotation={[-0.35, 0.23, -0.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell188"
            geometry={nodes.Cube_cell188.geometry}
            material={materials.CUBE}
            position={[-2.83, -39.51, -26.96]}
            rotation={[-2.55, 1.38, -1.48]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell189"
            geometry={nodes.Cube_cell189.geometry}
            material={materials.CUBE}
            position={[12.02, -7.11, -35]}
            rotation={[-2.21, 1.35, 1.83]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell190"
            geometry={nodes.Cube_cell190.geometry}
            material={materials.CUBE}
            position={[1.89, -36.35, -3.4]}
            rotation={[-2.45, -0.22, -0.83]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell191"
            geometry={nodes.Cube_cell191.geometry}
            material={materials.CUBE}
            position={[1.82, 17.16, -6.62]}
            rotation={[0, -1.36, -0.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell192"
            geometry={nodes.Cube_cell192.geometry}
            material={materials.CUBE}
            position={[-24.46, 4.24, -33.4]}
            rotation={[-1.23, -0.11, 1.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell193"
            geometry={nodes.Cube_cell193.geometry}
            material={materials.CUBE}
            position={[-2.16, -15.47, -13.63]}
            rotation={[-0.52, -0.3, -0.62]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell194"
            geometry={nodes.Cube_cell194.geometry}
            material={materials.CUBE}
            position={[-10.89, 36.21, 10.99]}
            rotation={[-1.83, -0.88, -2.91]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell195"
            geometry={nodes.Cube_cell195.geometry}
            material={materials.CUBE}
            position={[-7.46, 14.93, -36.69]}
            rotation={[-0.55, 0.65, 0.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell196"
            geometry={nodes.Cube_cell196.geometry}
            material={materials.CUBE}
            position={[14.6, -2.61, 25.69]}
            rotation={[-0.75, 0.44, 0.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell197"
            geometry={nodes.Cube_cell197.geometry}
            material={materials.CUBE}
            position={[-1.13, 17.06, 10.43]}
            rotation={[-0.3, -0.23, 2.62]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell198"
            geometry={nodes.Cube_cell198.geometry}
            material={materials.CUBE}
            position={[4.52, -45.51, -0.05]}
            rotation={[-0.59, -0.92, 2.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell199"
            geometry={nodes.Cube_cell199.geometry}
            material={materials.CUBE}
            position={[5.42, 16.6, 24.59]}
            rotation={[-0.73, -1.1, 1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell200"
            geometry={nodes.Cube_cell200.geometry}
            material={materials.CUBE}
            position={[4.11, -31.35, -22.67]}
            rotation={[-1.53, -0.6, -0.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell201"
            geometry={nodes.Cube_cell201.geometry}
            material={materials.CUBE}
            position={[-10.37, -51.69, 27.55]}
            rotation={[0.11, 0.3, -0.21]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell202"
            geometry={nodes.Cube_cell202.geometry}
            material={materials.CUBE}
            position={[-7.35, -33.43, -23.25]}
            rotation={[2.95, 1, 2.62]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell203"
            geometry={nodes.Cube_cell203.geometry}
            material={materials.CUBE}
            position={[26.23, 23.97, 28.01]}
            rotation={[-3.06, 0.54, -2.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell204"
            geometry={nodes.Cube_cell204.geometry}
            material={materials.CUBE}
            position={[3.29, 7.7, 39.19]}
            rotation={[-0.13, 0.6, -0.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell205"
            geometry={nodes.Cube_cell205.geometry}
            material={materials.CUBE}
            position={[8.1, 25.19, 15.81]}
            rotation={[-0.18, 1.32, 0.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell206"
            geometry={nodes.Cube_cell206.geometry}
            material={materials.CUBE}
            position={[-8.05, -37.97, 49.84]}
            rotation={[-0.61, -0.44, -0.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell207"
            geometry={nodes.Cube_cell207.geometry}
            material={materials.CUBE}
            position={[17.11, -9.49, -26.41]}
            rotation={[2.86, -0.17, -2.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell208"
            geometry={nodes.Cube_cell208.geometry}
            material={materials.CUBE}
            position={[-5.13, -6.85, -47.18]}
            rotation={[-0.49, -0.14, 1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell209"
            geometry={nodes.Cube_cell209.geometry}
            material={materials.CUBE}
            position={[-10.25, 30.28, -21.1]}
            rotation={[0.49, -0.59, 0.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell210"
            geometry={nodes.Cube_cell210.geometry}
            material={materials.CUBE}
            position={[-11, -36.75, -20.3]}
            rotation={[0.9, 0.08, -0.28]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell211"
            geometry={nodes.Cube_cell211.geometry}
            material={materials.CUBE}
            position={[-3.67, 14.78, 10.16]}
            rotation={[1.32, -0.49, 0.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell212"
            geometry={nodes.Cube_cell212.geometry}
            material={materials.CUBE}
            position={[0.98, 0.12, 54]}
            rotation={[-3.02, 1.28, 0.53]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell213"
            geometry={nodes.Cube_cell213.geometry}
            material={materials.CUBE}
            position={[20.91, 14.99, 17.22]}
            rotation={[-0.61, 0.35, 1.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell214"
            geometry={nodes.Cube_cell214.geometry}
            material={materials.CUBE}
            position={[6.17, 26.96, 24.04]}
            rotation={[1.43, 0.82, -1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell215"
            geometry={nodes.Cube_cell215.geometry}
            material={materials.CUBE}
            position={[8.43, 7.33, 20.17]}
            rotation={[1.53, 0.78, -0.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell216"
            geometry={nodes.Cube_cell216.geometry}
            material={materials.CUBE}
            position={[-4.35, 2.29, 34.87]}
            rotation={[2.8, -0.22, -0.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell217"
            geometry={nodes.Cube_cell217.geometry}
            material={materials.CUBE}
            position={[2.13, 11.9, 8.43]}
            rotation={[-0.95, -0.85, -1.53]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell218"
            geometry={nodes.Cube_cell218.geometry}
            material={materials.CUBE}
            position={[-16.59, -22.72, -9.27]}
            rotation={[1.06, 0.41, -0.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell219"
            geometry={nodes.Cube_cell219.geometry}
            material={materials.CUBE}
            position={[-8.9, -6.06, -7.95]}
            rotation={[0.66, 0.91, -1.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell220"
            geometry={nodes.Cube_cell220.geometry}
            material={materials.CUBE}
            position={[-2.64, 2.52, 24.93]}
            rotation={[2.31, 1.21, -2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell221"
            geometry={nodes.Cube_cell221.geometry}
            material={materials.CUBE}
            position={[-38.35, -2.69, -18.56]}
            rotation={[0.47, 0.18, -0.55]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell222"
            geometry={nodes.Cube_cell222.geometry}
            material={materials.CUBE}
            position={[9.95, 14.76, -7.92]}
            rotation={[-2.98, -0.75, 2.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell223"
            geometry={nodes.Cube_cell223.geometry}
            material={materials.CUBE}
            position={[-7.02, -0.47, 28.41]}
            rotation={[2.54, 0.06, -2.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell224"
            geometry={nodes.Cube_cell224.geometry}
            material={materials.CUBE}
            position={[3.72, -15.94, -12.32]}
            rotation={[-3.07, 0.04, -0.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell225"
            geometry={nodes.Cube_cell225.geometry}
            material={materials.CUBE}
            position={[16.95, 1.43, 25.48]}
            rotation={[0.96, -1.32, 1.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell226"
            geometry={nodes.Cube_cell226.geometry}
            material={materials.CUBE}
            position={[10.9, 0.54, 32.83]}
            rotation={[-1.12, 0.47, -3.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell227"
            geometry={nodes.Cube_cell227.geometry}
            material={materials.CUBE}
            position={[-5.93, -27.29, -30.8]}
            rotation={[0.15, -0.71, 0.29]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell228"
            geometry={nodes.Cube_cell228.geometry}
            material={materials.CUBE}
            position={[0.54, 30.78, -10.73]}
            rotation={[-0.93, 0.59, 1.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell229"
            geometry={nodes.Cube_cell229.geometry}
            material={materials.CUBE}
            position={[16.64, 3.98, 0.54]}
            rotation={[1.84, 0.41, 2.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell230"
            geometry={nodes.Cube_cell230.geometry}
            material={materials.CUBE}
            position={[-0.91, 34.83, -31.36]}
            rotation={[0.55, 0.36, 1.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell231"
            geometry={nodes.Cube_cell231.geometry}
            material={materials.CUBE}
            position={[0.66, -28.06, -9.2]}
            rotation={[-2.95, 0.14, -0.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell232"
            geometry={nodes.Cube_cell232.geometry}
            material={materials.CUBE}
            position={[-6.69, 1.38, -0.56]}
            rotation={[0.69, -0.44, -0.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell233"
            geometry={nodes.Cube_cell233.geometry}
            material={materials.CUBE}
            position={[5.04, -5.46, 55.18]}
            rotation={[0.38, -0.76, -1.44]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell234"
            geometry={nodes.Cube_cell234.geometry}
            material={materials.CUBE}
            position={[8.7, -3.47, -5.23]}
            rotation={[-1.07, 0.37, 1.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell235"
            geometry={nodes.Cube_cell235.geometry}
            material={materials.CUBE}
            position={[-3.52, 41.01, -10.89]}
            rotation={[-0.89, 0.78, 0.46]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell236"
            geometry={nodes.Cube_cell236.geometry}
            material={materials.CUBE}
            position={[3.04, 4.88, 20.52]}
            rotation={[0.36, 0.69, -0.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell237"
            geometry={nodes.Cube_cell237.geometry}
            material={materials.CUBE}
            position={[36.7, -12.87, 22.49]}
            rotation={[-0.83, -0.58, -1.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell238"
            geometry={nodes.Cube_cell238.geometry}
            material={materials.CUBE}
            position={[-14.41, 9.32, 29.66]}
            rotation={[-3.04, -0.35, 3.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell239"
            geometry={nodes.Cube_cell239.geometry}
            material={materials.CUBE}
            position={[9.1, 0.29, -8.03]}
            rotation={[2.52, 0.56, 1.3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell240"
            geometry={nodes.Cube_cell240.geometry}
            material={materials.CUBE}
            position={[-25.35, -34.67, 6.07]}
            rotation={[-2.56, 0.56, -0.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell241"
            geometry={nodes.Cube_cell241.geometry}
            material={materials.CUBE}
            position={[10.3, -16.25, 23.52]}
            rotation={[0.28, -0.24, 2.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell242"
            geometry={nodes.Cube_cell242.geometry}
            material={materials.CUBE}
            position={[25.48, 17.61, -10.98]}
            rotation={[2.81, -1.45, -2.79]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell243"
            geometry={nodes.Cube_cell243.geometry}
            material={materials.CUBE}
            position={[-11.18, 12.9, 19.73]}
            rotation={[-3.06, 1.47, -0.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell244"
            geometry={nodes.Cube_cell244.geometry}
            material={materials.CUBE}
            position={[-5.86, -5.38, 21.05]}
            rotation={[-0.28, 0.59, -1.59]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell245"
            geometry={nodes.Cube_cell245.geometry}
            material={materials.CUBE}
            position={[12.93, -34.67, 10.29]}
            rotation={[0.63, 0.61, 1.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell246"
            geometry={nodes.Cube_cell246.geometry}
            material={materials.CUBE}
            position={[-3.02, -30.87, -36.85]}
            rotation={[-2.37, 0.19, -0.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell247"
            geometry={nodes.Cube_cell247.geometry}
            material={materials.CUBE}
            position={[-4.13, 39.66, -19.99]}
            rotation={[-1.75, 0.66, -3.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell248"
            geometry={nodes.Cube_cell248.geometry}
            material={materials.CUBE}
            position={[-12.72, -4.71, 27.56]}
            rotation={[-1.44, -0.85, -0.78]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell249"
            geometry={nodes.Cube_cell249.geometry}
            material={materials.CUBE}
            position={[-3.33, 19.74, 40.99]}
            rotation={[3.1, 0.22, 3.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell250"
            geometry={nodes.Cube_cell250.geometry}
            material={materials.CUBE}
            position={[4.57, 3.73, -33.88]}
            rotation={[-0.12, 0.57, 0.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell251"
            geometry={nodes.Cube_cell251.geometry}
            material={materials.CUBE}
            position={[-4.48, 23.63, -38.97]}
            rotation={[-0.19, -0.06, 1.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell252"
            geometry={nodes.Cube_cell252.geometry}
            material={materials.CUBE}
            position={[3.18, 33.1, 15.77]}
            rotation={[-1.91, 0.39, -0.85]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell253"
            geometry={nodes.Cube_cell253.geometry}
            material={materials.CUBE}
            position={[-2, 38.91, 44.23]}
            rotation={[0.44, 0.28, 0.6]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell254"
            geometry={nodes.Cube_cell254.geometry}
            material={materials.CUBE}
            position={[5.59, -36.08, 30.05]}
            rotation={[2.47, 0.82, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell255"
            geometry={nodes.Cube_cell255.geometry}
            material={materials.CUBE}
            position={[-1.9, -17.85, -22.52]}
            rotation={[-0.31, -0.42, 0.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell256"
            geometry={nodes.Cube_cell256.geometry}
            material={materials.CUBE}
            position={[1.05, 22.61, -14.45]}
            rotation={[2.15, -1.23, -1.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell257"
            geometry={nodes.Cube_cell257.geometry}
            material={materials.CUBE}
            position={[12.28, -25.55, -12.59]}
            rotation={[-2.36, 1.37, 3.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell258"
            geometry={nodes.Cube_cell258.geometry}
            material={materials.CUBE}
            position={[5.13, -33.93, 2.68]}
            rotation={[0.52, 0.02, 0.85]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell259"
            geometry={nodes.Cube_cell259.geometry}
            material={materials.CUBE}
            position={[-2.85, 13.52, 31.77]}
            rotation={[0.47, -1.28, 1.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell260"
            geometry={nodes.Cube_cell260.geometry}
            material={materials.CUBE}
            position={[9.74, 7.68, 2.31]}
            rotation={[1.27, 0.31, -2.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell261"
            geometry={nodes.Cube_cell261.geometry}
            material={materials.CUBE}
            position={[4.64, 24.05, -23.71]}
            rotation={[-0.24, 0.06, 2.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell262"
            geometry={nodes.Cube_cell262.geometry}
            material={materials.CUBE}
            position={[5.32, -30.27, -39.18]}
            rotation={[-2.67, 0.15, -0.4]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell263"
            geometry={nodes.Cube_cell263.geometry}
            material={materials.CUBE}
            position={[-2.79, 40.16, 22.65]}
            rotation={[-1.72, 0.31, -3.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell264"
            geometry={nodes.Cube_cell264.geometry}
            material={materials.CUBE}
            position={[-12.91, 19.6, 27.51]}
            rotation={[-2.11, -0.72, 2.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell265"
            geometry={nodes.Cube_cell265.geometry}
            material={materials.CUBE}
            position={[-3.94, -6.74, -16.61]}
            rotation={[-0.94, -1.28, -0.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell266"
            geometry={nodes.Cube_cell266.geometry}
            material={materials.CUBE}
            position={[6.46, -8.62, -18.19]}
            rotation={[-2.45, -0.44, -2.76]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell267"
            geometry={nodes.Cube_cell267.geometry}
            material={materials.CUBE}
            position={[-9.45, -18.01, -42.13]}
            rotation={[-0.34, 1.27, -0.57]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell268"
            geometry={nodes.Cube_cell268.geometry}
            material={materials.CUBE}
            position={[-7.11, -28.1, 1.36]}
            rotation={[0.74, -0.88, -0.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell269"
            geometry={nodes.Cube_cell269.geometry}
            material={materials.CUBE}
            position={[18.75, 33.38, 4.3]}
            rotation={[0.3, -0.15, 0.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell270"
            geometry={nodes.Cube_cell270.geometry}
            material={materials.CUBE}
            position={[1.34, -11.91, 34.84]}
            rotation={[-0.72, -0.67, -2.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell271"
            geometry={nodes.Cube_cell271.geometry}
            material={materials.CUBE}
            position={[1.91, -0.55, -3.14]}
            rotation={[0, -0.64, -1.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell272"
            geometry={nodes.Cube_cell272.geometry}
            material={materials.CUBE}
            position={[-17.73, 32.96, 0.04]}
            rotation={[1.43, 0.78, -1.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell273"
            geometry={nodes.Cube_cell273.geometry}
            material={materials.CUBE}
            position={[-6.89, 12.9, -35.34]}
            rotation={[-2.79, -0.14, 2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell274"
            geometry={nodes.Cube_cell274.geometry}
            material={materials.CUBE}
            position={[-13.15, -16.92, -3.48]}
            rotation={[-3.02, 1.55, 1.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell275"
            geometry={nodes.Cube_cell275.geometry}
            material={materials.CUBE}
            position={[6.39, -41.19, 9.34]}
            rotation={[-0.21, 0.36, 1.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell276"
            geometry={nodes.Cube_cell276.geometry}
            material={materials.CUBE}
            position={[-2.32, 63, -22.83]}
            rotation={[2.36, 0.83, -2.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell277"
            geometry={nodes.Cube_cell277.geometry}
            material={materials.CUBE}
            position={[-6.74, 16.8, -41.29]}
            rotation={[-0.71, -1.43, -0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell278"
            geometry={nodes.Cube_cell278.geometry}
            material={materials.CUBE}
            position={[15.23, 11.24, 13.61]}
            rotation={[1.45, 0.53, 1.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell279"
            geometry={nodes.Cube_cell279.geometry}
            material={materials.CUBE}
            position={[-1.43, 57.84, -1.25]}
            rotation={[-2.21, 0.36, -2.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell280"
            geometry={nodes.Cube_cell280.geometry}
            material={materials.CUBE}
            position={[-4.57, -33.65, -10.9]}
            rotation={[-0.02, 0.67, 2.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell281"
            geometry={nodes.Cube_cell281.geometry}
            material={materials.CUBE}
            position={[-3.99, -15.69, 1.6]}
            rotation={[0.51, 0.7, 2.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell282"
            geometry={nodes.Cube_cell282.geometry}
            material={materials.CUBE}
            position={[0.84, -0.6, 53.54]}
            rotation={[-1.04, -0.24, -3.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell283"
            geometry={nodes.Cube_cell283.geometry}
            material={materials.CUBE}
            position={[10.4, -1.12, -62.4]}
            rotation={[3.1, -0.27, -2.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell284"
            geometry={nodes.Cube_cell284.geometry}
            material={materials.CUBE}
            position={[16.75, 46.24, -18.43]}
            rotation={[-0.3, 0.36, 0.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell285"
            geometry={nodes.Cube_cell285.geometry}
            material={materials.CUBE}
            position={[2.21, -46.99, 30.5]}
            rotation={[2.04, 0.08, -2.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell286"
            geometry={nodes.Cube_cell286.geometry}
            material={materials.CUBE}
            position={[1.53, 24.39, 33.81]}
            rotation={[1.29, -0.4, 0.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell287"
            geometry={nodes.Cube_cell287.geometry}
            material={materials.CUBE}
            position={[-14.64, -55.31, 30.9]}
            rotation={[-1.2, 0.39, 1.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell288"
            geometry={nodes.Cube_cell288.geometry}
            material={materials.CUBE}
            position={[-0.99, -21.68, 27.9]}
            rotation={[-0.31, 0.53, -0.44]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell289"
            geometry={nodes.Cube_cell289.geometry}
            material={materials.CUBE}
            position={[-1.62, 15.08, -22.1]}
            rotation={[0.72, -0.39, -0.73]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell290"
            geometry={nodes.Cube_cell290.geometry}
            material={materials.CUBE}
            position={[-4.09, 7.22, 7.42]}
            rotation={[-0.4, 0.43, 2.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell291"
            geometry={nodes.Cube_cell291.geometry}
            material={materials.CUBE}
            position={[13.38, -40.76, -23.88]}
            rotation={[1.91, 0.6, -2.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell292"
            geometry={nodes.Cube_cell292.geometry}
            material={materials.CUBE}
            position={[-10.7, -5.93, -5.32]}
            rotation={[-0.12, 0.94, -0.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell293"
            geometry={nodes.Cube_cell293.geometry}
            material={materials.CUBE}
            position={[5.12, -15.72, 1.46]}
            rotation={[-2.19, 0, 1.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell294"
            geometry={nodes.Cube_cell294.geometry}
            material={materials.CUBE}
            position={[6.53, 23.67, 7.01]}
            rotation={[-0.08, -1.52, -2.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell295"
            geometry={nodes.Cube_cell295.geometry}
            material={materials.CUBE}
            position={[1.7, 32.63, -6.37]}
            rotation={[2.91, -0.09, -0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell296"
            geometry={nodes.Cube_cell296.geometry}
            material={materials.CUBE}
            position={[-14.76, -72.14, -10.24]}
            rotation={[1.13, 1.18, -1.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell297"
            geometry={nodes.Cube_cell297.geometry}
            material={materials.CUBE}
            position={[28.24, 22.83, 0.86]}
            rotation={[-0.91, -0.11, 0.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell298"
            geometry={nodes.Cube_cell298.geometry}
            material={materials.CUBE}
            position={[-25.69, -2.13, -7.4]}
            rotation={[0.02, 0.96, 0.43]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell299"
            geometry={nodes.Cube_cell299.geometry}
            material={materials.CUBE}
            position={[4.55, 23.9, 44.2]}
            rotation={[-0.33, -0.8, -2.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell300"
            geometry={nodes.Cube_cell300.geometry}
            material={materials.CUBE}
            position={[3.13, 16.21, 40.97]}
            rotation={[0.72, 0.16, 2.57]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell301"
            geometry={nodes.Cube_cell301.geometry}
            material={materials.CUBE}
            position={[-2.95, -26.61, -42.02]}
            rotation={[-0.29, -0.3, -0.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell302"
            geometry={nodes.Cube_cell302.geometry}
            material={materials.CUBE}
            position={[18.73, -20.2, -11.64]}
            rotation={[-1.83, -0.5, -2.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell303"
            geometry={nodes.Cube_cell303.geometry}
            material={materials.CUBE}
            position={[3.88, -26, 25.3]}
            rotation={[1.14, 0.21, -0.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell304"
            geometry={nodes.Cube_cell304.geometry}
            material={materials.CUBE}
            position={[-15.53, 44.39, -27.05]}
            rotation={[0.91, 0.36, -0.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell305"
            geometry={nodes.Cube_cell305.geometry}
            material={materials.CUBE}
            position={[2.24, 8.9, -42.4]}
            rotation={[0.12, -0.43, -0.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell306"
            geometry={nodes.Cube_cell306.geometry}
            material={materials.CUBE}
            position={[7.78, -3.38, -5.6]}
            rotation={[1.67, 0.31, 0.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell307"
            geometry={nodes.Cube_cell307.geometry}
            material={materials.CUBE}
            position={[1.22, 28.42, 51.15]}
            rotation={[0.73, -0.34, -1.28]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell308"
            geometry={nodes.Cube_cell308.geometry}
            material={materials.CUBE}
            position={[5.51, -1.75, 43.88]}
            rotation={[0.32, 0.1, 0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell309"
            geometry={nodes.Cube_cell309.geometry}
            material={materials.CUBE}
            position={[15.71, 17.06, -22.52]}
            rotation={[0.61, -0.43, -1.22]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell310"
            geometry={nodes.Cube_cell310.geometry}
            material={materials.CUBE}
            position={[8.21, 3.15, -30.35]}
            rotation={[2.23, -1.06, -0.43]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell311"
            geometry={nodes.Cube_cell311.geometry}
            material={materials.CUBE}
            position={[4, -24.29, 46.89]}
            rotation={[2.84, -0.34, -1.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell312"
            geometry={nodes.Cube_cell312.geometry}
            material={materials.CUBE}
            position={[-29.7, -25.89, -22.59]}
            rotation={[-0.41, -0.04, -0.85]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell313"
            geometry={nodes.Cube_cell313.geometry}
            material={materials.CUBE}
            position={[-0.24, -17.85, -6.88]}
            rotation={[2.63, -1.46, 2.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell314"
            geometry={nodes.Cube_cell314.geometry}
            material={materials.CUBE}
            position={[16.15, -27.68, 21.62]}
            rotation={[0.61, -0.31, 1.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell315"
            geometry={nodes.Cube_cell315.geometry}
            material={materials.CUBE}
            position={[-3.57, 16.2, -24.44]}
            rotation={[1.28, -0.3, 0.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell316"
            geometry={nodes.Cube_cell316.geometry}
            material={materials.CUBE}
            position={[-20.39, -32.05, 38.99]}
            rotation={[2.96, -0.38, 2.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell317"
            geometry={nodes.Cube_cell317.geometry}
            material={materials.CUBE}
            position={[28.34, -31.96, -17.72]}
            rotation={[0.02, 0.69, 1.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell318"
            geometry={nodes.Cube_cell318.geometry}
            material={materials.CUBE}
            position={[0.12, 8.87, -5.86]}
            rotation={[-0.55, -0.27, -0.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell319"
            geometry={nodes.Cube_cell319.geometry}
            material={materials.CUBE}
            position={[13.65, 8.57, -20.74]}
            rotation={[2.33, 0.02, 3.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell320"
            geometry={nodes.Cube_cell320.geometry}
            material={materials.CUBE}
            position={[0.65, -4.53, 20.48]}
            rotation={[0.43, 0.47, 2.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell321"
            geometry={nodes.Cube_cell321.geometry}
            material={materials.CUBE}
            position={[-1, -47.74, 10.14]}
            rotation={[1.04, -1.31, 0.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell322"
            geometry={nodes.Cube_cell322.geometry}
            material={materials.CUBE}
            position={[41.17, 5.39, -14.91]}
            rotation={[1.2, -1.08, 1.6]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell323"
            geometry={nodes.Cube_cell323.geometry}
            material={materials.CUBE}
            position={[-15.34, -18.84, -26.83]}
            rotation={[0.19, 0.5, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell324"
            geometry={nodes.Cube_cell324.geometry}
            material={materials.CUBE}
            position={[16.55, -27.89, -7.32]}
            rotation={[-1.31, 0.58, 1.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell325"
            geometry={nodes.Cube_cell325.geometry}
            material={materials.CUBE}
            position={[4.89, 38.63, -5.79]}
            rotation={[1.42, 0.79, -2.39]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell326"
            geometry={nodes.Cube_cell326.geometry}
            material={materials.CUBE}
            position={[38.54, -24.16, 59.14]}
            rotation={[2.05, -0.5, -3.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell327"
            geometry={nodes.Cube_cell327.geometry}
            material={materials.CUBE}
            position={[-0.15, -7.18, -22.59]}
            rotation={[-0.33, -0.29, 0.81]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell328"
            geometry={nodes.Cube_cell328.geometry}
            material={materials.CUBE}
            position={[-11, -24.11, -2.89]}
            rotation={[-0.84, -0.4, -1.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell329"
            geometry={nodes.Cube_cell329.geometry}
            material={materials.CUBE}
            position={[-14.3, -0.44, -23.33]}
            rotation={[3.1, -0.63, -2.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell330"
            geometry={nodes.Cube_cell330.geometry}
            material={materials.CUBE}
            position={[3.82, -44.83, 39.24]}
            rotation={[0.01, 0.38, -0.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell331"
            geometry={nodes.Cube_cell331.geometry}
            material={materials.CUBE}
            position={[-3.37, -26.62, 25.27]}
            rotation={[0.81, 0.4, -2.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell332"
            geometry={nodes.Cube_cell332.geometry}
            material={materials.CUBE}
            position={[32.12, 7.35, 3.66]}
            rotation={[0.72, 0.27, -0.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell333"
            geometry={nodes.Cube_cell333.geometry}
            material={materials.CUBE}
            position={[-6.79, 2.75, -38.83]}
            rotation={[2.83, -0.3, 0.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell334"
            geometry={nodes.Cube_cell334.geometry}
            material={materials.CUBE}
            position={[-2.63, 6.41, 43.79]}
            rotation={[-0.12, -0.65, 0.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell335"
            geometry={nodes.Cube_cell335.geometry}
            material={materials.CUBE}
            position={[-3.47, 2.24, -37.17]}
            rotation={[0.51, 0.32, 0.7]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell336"
            geometry={nodes.Cube_cell336.geometry}
            material={materials.CUBE}
            position={[13.33, 10.61, 64.05]}
            rotation={[2.13, -1.22, 2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell337"
            geometry={nodes.Cube_cell337.geometry}
            material={materials.CUBE}
            position={[-1.35, 16.86, 14.75]}
            rotation={[-1.42, 0.47, -0.93]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell338"
            geometry={nodes.Cube_cell338.geometry}
            material={materials.CUBE}
            position={[-0.89, 39.18, -28.25]}
            rotation={[0.01, -0.02, -1.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell339"
            geometry={nodes.Cube_cell339.geometry}
            material={materials.CUBE}
            position={[5.48, 46.35, -2.36]}
            rotation={[1.3, -0.56, -1.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell340"
            geometry={nodes.Cube_cell340.geometry}
            material={materials.CUBE}
            position={[-27.36, -32.78, 35.86]}
            rotation={[0.75, -0.63, 0.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell341"
            geometry={nodes.Cube_cell341.geometry}
            material={materials.CUBE}
            position={[5.33, -9.26, 22]}
            rotation={[-1, -0.09, 0.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell342"
            geometry={nodes.Cube_cell342.geometry}
            material={materials.CUBE}
            position={[-2.99, -3.24, -7.61]}
            rotation={[-2.26, 1.1, 1.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell343"
            geometry={nodes.Cube_cell343.geometry}
            material={materials.CUBE}
            position={[8.95, 12.77, 7.05]}
            rotation={[-0.54, 0.51, -1.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell344"
            geometry={nodes.Cube_cell344.geometry}
            material={materials.CUBE}
            position={[10.3, -98.88, -55]}
            rotation={[-0.3, -0.59, -0.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell345"
            geometry={nodes.Cube_cell345.geometry}
            material={materials.CUBE}
            position={[11.71, 5.21, 42.16]}
            rotation={[0.45, 0.25, -2.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell346"
            geometry={nodes.Cube_cell346.geometry}
            material={materials.CUBE}
            position={[-0.14, -11.96, 40.81]}
            rotation={[3.01, -0.04, 0.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell347"
            geometry={nodes.Cube_cell347.geometry}
            material={materials.CUBE}
            position={[1.05, -53.33, 16.76]}
            rotation={[-0.89, 0.05, 2.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell348"
            geometry={nodes.Cube_cell348.geometry}
            material={materials.CUBE}
            position={[-3.18, -34.91, -38.06]}
            rotation={[1.65, -0.16, 1.74]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell349"
            geometry={nodes.Cube_cell349.geometry}
            material={materials.CUBE}
            position={[0, -34.36, 17.65]}
            rotation={[-0.16, 0.55, 0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell350"
            geometry={nodes.Cube_cell350.geometry}
            material={materials.CUBE}
            position={[12.27, -40.44, 1.34]}
            rotation={[-0.43, 0.63, -2.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell351"
            geometry={nodes.Cube_cell351.geometry}
            material={materials.CUBE}
            position={[12.92, 13.26, -16.47]}
            rotation={[-0.64, 1.46, -2.19]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell352"
            geometry={nodes.Cube_cell352.geometry}
            material={materials.CUBE}
            position={[0.78, -36.64, -9.57]}
            rotation={[-2.37, -0.93, 1.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell353"
            geometry={nodes.Cube_cell353.geometry}
            material={materials.CUBE}
            position={[6.89, 40.96, -2.69]}
            rotation={[1.76, -0.78, -2.46]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell354"
            geometry={nodes.Cube_cell354.geometry}
            material={materials.CUBE}
            position={[18.76, -67.16, -5.63]}
            rotation={[0.19, -0.8, -0.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell355"
            geometry={nodes.Cube_cell355.geometry}
            material={materials.CUBE}
            position={[-15.63, 28.36, 10.06]}
            rotation={[3.06, -0.28, -2.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell356"
            geometry={nodes.Cube_cell356.geometry}
            material={materials.CUBE}
            position={[5.8, -3.99, 53.22]}
            rotation={[1.58, -0.91, -1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell357"
            geometry={nodes.Cube_cell357.geometry}
            material={materials.CUBE}
            position={[12.26, 29.99, 17]}
            rotation={[-2.01, -1.01, 1.57]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell358"
            geometry={nodes.Cube_cell358.geometry}
            material={materials.CUBE}
            position={[-1.4, -48.21, 37.56]}
            rotation={[3.12, 0.82, 2.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell359"
            geometry={nodes.Cube_cell359.geometry}
            material={materials.CUBE}
            position={[-3.98, 23.25, -30.13]}
            rotation={[0.12, -0.26, 0.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell360"
            geometry={nodes.Cube_cell360.geometry}
            material={materials.CUBE}
            position={[-1.08, 27.78, 16.58]}
            rotation={[3.11, 0.69, -0.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell361"
            geometry={nodes.Cube_cell361.geometry}
            material={materials.CUBE}
            position={[1.01, -35.55, 13.93]}
            rotation={[-1.17, -0.25, 0.62]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell362"
            geometry={nodes.Cube_cell362.geometry}
            material={materials.CUBE}
            position={[-1.99, -25.79, 1.44]}
            rotation={[-0.28, 1.03, 2.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell363"
            geometry={nodes.Cube_cell363.geometry}
            material={materials.CUBE}
            position={[5.53, 8.27, -34.55]}
            rotation={[-1.96, -0.34, 0.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell364"
            geometry={nodes.Cube_cell364.geometry}
            material={materials.CUBE}
            position={[1.22, 2.9, -0.8]}
            rotation={[1.05, 0.85, 1.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell365"
            geometry={nodes.Cube_cell365.geometry}
            material={materials.CUBE}
            position={[-2.48, -10.09, 12.27]}
            rotation={[1.61, -0.67, 3.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell366"
            geometry={nodes.Cube_cell366.geometry}
            material={materials.CUBE}
            position={[10.28, 23.65, 20.99]}
            rotation={[0.46, -0.73, -0.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell367"
            geometry={nodes.Cube_cell367.geometry}
            material={materials.CUBE}
            position={[0.78, 18.61, 8.76]}
            rotation={[-2.71, -0.82, 1.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell368"
            geometry={nodes.Cube_cell368.geometry}
            material={materials.CUBE}
            position={[0.96, -2.43, 41.08]}
            rotation={[-1.14, -0.4, -0.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell369"
            geometry={nodes.Cube_cell369.geometry}
            material={materials.CUBE}
            position={[1.14, 27.12, -13.87]}
            rotation={[0.7, 0.69, 2.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell370"
            geometry={nodes.Cube_cell370.geometry}
            material={materials.CUBE}
            position={[-6.92, 20.77, 21.38]}
            rotation={[0.46, 0.42, -1.4]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell371"
            geometry={nodes.Cube_cell371.geometry}
            material={materials.CUBE}
            position={[2.11, 25.43, -16.68]}
            rotation={[0.73, 0.23, -0.53]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell372"
            geometry={nodes.Cube_cell372.geometry}
            material={materials.CUBE}
            position={[14.66, 20.04, 24.99]}
            rotation={[2.13, 0.3, 2.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell373"
            geometry={nodes.Cube_cell373.geometry}
            material={materials.CUBE}
            position={[14.7, 2.83, -34.62]}
            rotation={[1.07, -0.23, 0.17]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell374"
            geometry={nodes.Cube_cell374.geometry}
            material={materials.CUBE}
            position={[5.33, -46.75, 0.18]}
            rotation={[-3.12, 0.44, 0.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell375"
            geometry={nodes.Cube_cell375.geometry}
            material={materials.CUBE}
            position={[1.28, 19.22, -2.28]}
            rotation={[-0.08, -1.12, -2.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell376"
            geometry={nodes.Cube_cell376.geometry}
            material={materials.CUBE}
            position={[-6.25, 1.54, 4.96]}
            rotation={[-2.72, -1.06, -2.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell377"
            geometry={nodes.Cube_cell377.geometry}
            material={materials.CUBE}
            position={[2.55, 26.67, 2.13]}
            rotation={[-2.69, 0.02, -1.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell378"
            geometry={nodes.Cube_cell378.geometry}
            material={materials.CUBE}
            position={[-5.32, 10.98, -26.66]}
            rotation={[0.66, 0.38, 0.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell379"
            geometry={nodes.Cube_cell379.geometry}
            material={materials.CUBE}
            position={[12.7, -28.01, -23.52]}
            rotation={[-1.43, 0.22, -0.89]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell380"
            geometry={nodes.Cube_cell380.geometry}
            material={materials.CUBE}
            position={[4.24, 38.82, 16.39]}
            rotation={[-2.19, -0.62, -0.87]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell381"
            geometry={nodes.Cube_cell381.geometry}
            material={materials.CUBE}
            position={[-1.38, 20.73, -39.97]}
            rotation={[-0.5, -1.12, 2.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell382"
            geometry={nodes.Cube_cell382.geometry}
            material={materials.CUBE}
            position={[-3.93, -24.1, 2.89]}
            rotation={[-0.97, -0.74, 1.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell383"
            geometry={nodes.Cube_cell383.geometry}
            material={materials.CUBE}
            position={[2.07, -33.36, 32.27]}
            rotation={[-1.98, 0.85, -0.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell384"
            geometry={nodes.Cube_cell384.geometry}
            material={materials.CUBE}
            position={[0.36, -36.88, -34.59]}
            rotation={[-1.15, 0.52, 0.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell385"
            geometry={nodes.Cube_cell385.geometry}
            material={materials.CUBE}
            position={[17.85, 27.21, -29.95]}
            rotation={[-1.91, 0.3, -0.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell386"
            geometry={nodes.Cube_cell386.geometry}
            material={materials.CUBE}
            position={[-33.95, 0.15, 8.28]}
            rotation={[-1.06, -1.17, -2.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell387"
            geometry={nodes.Cube_cell387.geometry}
            material={materials.CUBE}
            position={[8.46, -11.64, 26.89]}
            rotation={[-0.85, -1.05, -0.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell388"
            geometry={nodes.Cube_cell388.geometry}
            material={materials.CUBE}
            position={[-3.15, -31.87, 53.82]}
            rotation={[2.32, 0.31, 0.63]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell389"
            geometry={nodes.Cube_cell389.geometry}
            material={materials.CUBE}
            position={[-20.44, 27.98, -8.42]}
            rotation={[-3.13, -1.15, 3.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell390"
            geometry={nodes.Cube_cell390.geometry}
            material={materials.CUBE}
            position={[-5.61, -26.58, -18.64]}
            rotation={[0.7, -0.57, 1.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell391"
            geometry={nodes.Cube_cell391.geometry}
            material={materials.CUBE}
            position={[-32.23, 9.81, 8.71]}
            rotation={[-0.75, 0.07, -0.87]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell392"
            geometry={nodes.Cube_cell392.geometry}
            material={materials.CUBE}
            position={[12.72, -19.65, 15.26]}
            rotation={[0.89, 0.95, 2.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell393"
            geometry={nodes.Cube_cell393.geometry}
            material={materials.CUBE}
            position={[9.73, 5.53, -20.37]}
            rotation={[-0.5, -0.55, -0.46]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell394"
            geometry={nodes.Cube_cell394.geometry}
            material={materials.CUBE}
            position={[-32.39, -23.48, 18.1]}
            rotation={[2.61, -0.34, -3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell395"
            geometry={nodes.Cube_cell395.geometry}
            material={materials.CUBE}
            position={[9.8, 10.42, -37.68]}
            rotation={[0.24, -0.32, -0.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell396"
            geometry={nodes.Cube_cell396.geometry}
            material={materials.CUBE}
            position={[-2.96, -6.69, 7.69]}
            rotation={[-2.28, -0.98, -1.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell397"
            geometry={nodes.Cube_cell397.geometry}
            material={materials.CUBE}
            position={[-3.59, -56.3, -47.72]}
            rotation={[0.46, 0.22, -1.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell398"
            geometry={nodes.Cube_cell398.geometry}
            material={materials.CUBE}
            position={[-10.1, -1.77, -39.74]}
            rotation={[-1.52, 0.91, 1.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell399"
            geometry={nodes.Cube_cell399.geometry}
            material={materials.CUBE}
            position={[42.41, -56.8, 20.27]}
            rotation={[0.36, 0.38, 0.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell400"
            geometry={nodes.Cube_cell400.geometry}
            material={materials.CUBE}
            position={[-17, 3.49, 4.5]}
            rotation={[0.47, 0.01, -2.6]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell401"
            geometry={nodes.Cube_cell401.geometry}
            material={materials.CUBE}
            position={[3.76, 13.57, -9.49]}
            rotation={[-0.03, 0.26, 1.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell402"
            geometry={nodes.Cube_cell402.geometry}
            material={materials.CUBE}
            position={[-8.98, -7.2, -12.08]}
            rotation={[-0.47, 0.07, -2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell403"
            geometry={nodes.Cube_cell403.geometry}
            material={materials.CUBE}
            position={[-2.59, -36.84, -35]}
            rotation={[0.98, -0.1, 0.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell404"
            geometry={nodes.Cube_cell404.geometry}
            material={materials.CUBE}
            position={[-3.79, -20.32, -33.22]}
            rotation={[3.07, 0.17, 2.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell405"
            geometry={nodes.Cube_cell405.geometry}
            material={materials.CUBE}
            position={[1.36, -6.27, 13.89]}
            rotation={[-1.35, -0.16, -0.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell406"
            geometry={nodes.Cube_cell406.geometry}
            material={materials.CUBE}
            position={[-0.14, 30.62, -28.66]}
            rotation={[-2.42, 0.12, -0.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell407"
            geometry={nodes.Cube_cell407.geometry}
            material={materials.CUBE}
            position={[5.65, 1.99, 2.7]}
            rotation={[-2.14, -0.69, -2.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell408"
            geometry={nodes.Cube_cell408.geometry}
            material={materials.CUBE}
            position={[-12.03, 21.42, 25.95]}
            rotation={[-0.44, -0.27, -2.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell409"
            geometry={nodes.Cube_cell409.geometry}
            material={materials.CUBE}
            position={[-6.4, -7.49, -44.09]}
            rotation={[-0.05, 0.24, -0.39]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell410"
            geometry={nodes.Cube_cell410.geometry}
            material={materials.CUBE}
            position={[-12.56, 21.59, 13.83]}
            rotation={[-2.23, 0.01, -0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell411"
            geometry={nodes.Cube_cell411.geometry}
            material={materials.CUBE}
            position={[5.31, 34.78, 46.5]}
            rotation={[-1.78, -0.46, -2.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell412"
            geometry={nodes.Cube_cell412.geometry}
            material={materials.CUBE}
            position={[-0.27, -0.98, -28.15]}
            rotation={[-2.72, 1.25, 3.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell413"
            geometry={nodes.Cube_cell413.geometry}
            material={materials.CUBE}
            position={[1.99, -39.11, 32.42]}
            rotation={[0.05, -0.29, -1.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell414"
            geometry={nodes.Cube_cell414.geometry}
            material={materials.CUBE}
            position={[-40.14, 21.77, 6.66]}
            rotation={[0.73, -0.69, 2.59]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell415"
            geometry={nodes.Cube_cell415.geometry}
            material={materials.CUBE}
            position={[10.42, -31.66, 31.05]}
            rotation={[0.36, -0.52, 0.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell416"
            geometry={nodes.Cube_cell416.geometry}
            material={materials.CUBE}
            position={[11.5, -28.75, 19.32]}
            rotation={[-2.07, -0.49, 0.89]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell417"
            geometry={nodes.Cube_cell417.geometry}
            material={materials.CUBE}
            position={[-6.44, 32.13, -8.91]}
            rotation={[-2.93, -0.01, -0.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell418"
            geometry={nodes.Cube_cell418.geometry}
            material={materials.CUBE}
            position={[9.3, 19.97, 38.03]}
            rotation={[-1.92, -0.22, 0.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell419"
            geometry={nodes.Cube_cell419.geometry}
            material={materials.CUBE}
            position={[3.75, 40.12, -9.59]}
            rotation={[-1.67, 0.01, 0.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell420"
            geometry={nodes.Cube_cell420.geometry}
            material={materials.CUBE}
            position={[42.42, 11.37, -23.85]}
            rotation={[-0.03, 1.05, -0.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell421"
            geometry={nodes.Cube_cell421.geometry}
            material={materials.CUBE}
            position={[60.61, -2.57, 22.62]}
            rotation={[-0.76, 0.29, 0.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell422"
            geometry={nodes.Cube_cell422.geometry}
            material={materials.CUBE}
            position={[8.59, -0.52, 19.5]}
            rotation={[2.74, 1.32, 2.72]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell423"
            geometry={nodes.Cube_cell423.geometry}
            material={materials.CUBE}
            position={[2.44, 12.61, -18.64]}
            rotation={[2.7, 0.37, 0.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell424"
            geometry={nodes.Cube_cell424.geometry}
            material={materials.CUBE}
            position={[7.61, 11.46, 49.27]}
            rotation={[-1.12, 0.7, -0.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell425"
            geometry={nodes.Cube_cell425.geometry}
            material={materials.CUBE}
            position={[5.2, -2.43, -34.19]}
            rotation={[3.02, 0.49, -2.4]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell426"
            geometry={nodes.Cube_cell426.geometry}
            material={materials.CUBE}
            position={[-14.01, -26.95, -10.43]}
            rotation={[-1.4, 0.73, -0.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell427"
            geometry={nodes.Cube_cell427.geometry}
            material={materials.CUBE}
            position={[-2.06, -4.67, 47.03]}
            rotation={[-1.08, 0.27, -1.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell428"
            geometry={nodes.Cube_cell428.geometry}
            material={materials.CUBE}
            position={[-5.03, -22.65, 9.02]}
            rotation={[0.66, -0.07, -2.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell429"
            geometry={nodes.Cube_cell429.geometry}
            material={materials.CUBE}
            position={[51.19, 25.84, -20.75]}
            rotation={[-2.94, 0.68, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell430"
            geometry={nodes.Cube_cell430.geometry}
            material={materials.CUBE}
            position={[14.58, 13.85, 24.6]}
            rotation={[-0.51, -1.01, 0.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell431"
            geometry={nodes.Cube_cell431.geometry}
            material={materials.CUBE}
            position={[-2.84, 37.52, -11.9]}
            rotation={[-0.46, -0.49, -1.76]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell432"
            geometry={nodes.Cube_cell432.geometry}
            material={materials.CUBE}
            position={[5.48, -23.59, 39.44]}
            rotation={[-0.95, -0.47, -0.44]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell433"
            geometry={nodes.Cube_cell433.geometry}
            material={materials.CUBE}
            position={[3.11, -6.97, -37.41]}
            rotation={[-1.5, 0.02, 1.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell434"
            geometry={nodes.Cube_cell434.geometry}
            material={materials.CUBE}
            position={[-6.37, -0.84, -49.38]}
            rotation={[-0.62, -1.04, 3.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell435"
            geometry={nodes.Cube_cell435.geometry}
            material={materials.CUBE}
            position={[2.2, -14.57, 32.67]}
            rotation={[1.05, 0.23, -2.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell436"
            geometry={nodes.Cube_cell436.geometry}
            material={materials.CUBE}
            position={[-8.07, 14.98, 22.36]}
            rotation={[-2.66, -0.44, -0.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell437"
            geometry={nodes.Cube_cell437.geometry}
            material={materials.CUBE}
            position={[-1.51, 3.51, 39.5]}
            rotation={[1.99, 1.04, 2.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell438"
            geometry={nodes.Cube_cell438.geometry}
            material={materials.CUBE}
            position={[0.54, -43.66, -24.2]}
            rotation={[-0.81, 0.02, 0.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell439"
            geometry={nodes.Cube_cell439.geometry}
            material={materials.CUBE}
            position={[-3.64, -15.41, -38.16]}
            rotation={[-1.12, 0, -1.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell440"
            geometry={nodes.Cube_cell440.geometry}
            material={materials.CUBE}
            position={[-2.35, 23.61, -67.73]}
            rotation={[-0.02, 1.01, -1.17]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell441"
            geometry={nodes.Cube_cell441.geometry}
            material={materials.CUBE}
            position={[-1.39, -3.76, -30.44]}
            rotation={[-1.42, -1.34, -1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell442"
            geometry={nodes.Cube_cell442.geometry}
            material={materials.CUBE}
            position={[-26.26, 16.22, -25.44]}
            rotation={[0.4, 0.11, -0.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell443"
            geometry={nodes.Cube_cell443.geometry}
            material={materials.CUBE}
            position={[-18.13, 31.16, -27.33]}
            rotation={[-0.53, -0.18, -0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell444"
            geometry={nodes.Cube_cell444.geometry}
            material={materials.CUBE}
            position={[15.53, -3.17, 19.78]}
            rotation={[-2.16, -0.04, 0.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell445"
            geometry={nodes.Cube_cell445.geometry}
            material={materials.CUBE}
            position={[7.34, -3.76, -23.8]}
            rotation={[-2.31, -1.07, -2.48]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell446"
            geometry={nodes.Cube_cell446.geometry}
            material={materials.CUBE}
            position={[2.39, 0.77, -2.65]}
            rotation={[-2.21, 1.12, 2.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell447"
            geometry={nodes.Cube_cell447.geometry}
            material={materials.CUBE}
            position={[-7.4, 13.62, 44.6]}
            rotation={[0.91, 0.76, 2.58]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell448"
            geometry={nodes.Cube_cell448.geometry}
            material={materials.CUBE}
            position={[-0.07, -33.27, -16.61]}
            rotation={[-1.79, 1.12, -1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell449"
            geometry={nodes.Cube_cell449.geometry}
            material={materials.CUBE}
            position={[17.13, -7.88, 39.06]}
            rotation={[0.09, -0.71, -2.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell450"
            geometry={nodes.Cube_cell450.geometry}
            material={materials.CUBE}
            position={[-4.7, -5.3, 10.06]}
            rotation={[1.91, -0.46, -0.44]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell451"
            geometry={nodes.Cube_cell451.geometry}
            material={materials.CUBE}
            position={[-3.03, 21.66, -16.84]}
            rotation={[-2.12, 1.12, 2.46]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell452"
            geometry={nodes.Cube_cell452.geometry}
            material={materials.CUBE}
            position={[-0.41, -13.15, -0.65]}
            rotation={[2.79, -0.56, 0.39]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell453"
            geometry={nodes.Cube_cell453.geometry}
            material={materials.CUBE}
            position={[21.22, 9, 15.59]}
            rotation={[1.66, -0.28, 0.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell454"
            geometry={nodes.Cube_cell454.geometry}
            material={materials.CUBE}
            position={[-42.81, 8.01, 0.16]}
            rotation={[2.28, -0.03, -0.55]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell455"
            geometry={nodes.Cube_cell455.geometry}
            material={materials.CUBE}
            position={[-6.19, 12.82, -6.39]}
            rotation={[0.6, -0.6, -2.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell456"
            geometry={nodes.Cube_cell456.geometry}
            material={materials.CUBE}
            position={[21.37, -29.59, 15.17]}
            rotation={[0.52, -0.43, -2.48]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell457"
            geometry={nodes.Cube_cell457.geometry}
            material={materials.CUBE}
            position={[7.87, 36.9, -8.2]}
            rotation={[2.39, 0.41, 2.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell458"
            geometry={nodes.Cube_cell458.geometry}
            material={materials.CUBE}
            position={[15.54, 7.41, -15.33]}
            rotation={[0.37, 0.14, -2.91]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell459"
            geometry={nodes.Cube_cell459.geometry}
            material={materials.CUBE}
            position={[-21.73, -19.09, -3.31]}
            rotation={[1.44, -0.63, 0.44]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell460"
            geometry={nodes.Cube_cell460.geometry}
            material={materials.CUBE}
            position={[8.2, -58.94, -11.22]}
            rotation={[-3.01, -0.28, -2.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell461"
            geometry={nodes.Cube_cell461.geometry}
            material={materials.CUBE}
            position={[-17.83, 6.26, 3.72]}
            rotation={[1.21, 0.02, 0.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell462"
            geometry={nodes.Cube_cell462.geometry}
            material={materials.CUBE}
            position={[-6.44, -23.24, -6.78]}
            rotation={[0.7, -0.09, -1.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell463"
            geometry={nodes.Cube_cell463.geometry}
            material={materials.CUBE}
            position={[7.16, 0.88, -19.66]}
            rotation={[2.96, 1.14, -2.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell464"
            geometry={nodes.Cube_cell464.geometry}
            material={materials.CUBE}
            position={[-6.49, 5.83, 34.93]}
            rotation={[0.25, 0.17, -0.58]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell465"
            geometry={nodes.Cube_cell465.geometry}
            material={materials.CUBE}
            position={[-21.65, 4.27, -52.66]}
            rotation={[1.09, -1, -0.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell466"
            geometry={nodes.Cube_cell466.geometry}
            material={materials.CUBE}
            position={[-33.38, 14.45, 7.15]}
            rotation={[-0.26, 0.32, 2.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell467"
            geometry={nodes.Cube_cell467.geometry}
            material={materials.CUBE}
            position={[3.74, -48.2, 12.26]}
            rotation={[1.07, -0.32, 0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell468"
            geometry={nodes.Cube_cell468.geometry}
            material={materials.CUBE}
            position={[11.63, 32.97, 43.77]}
            rotation={[-0.12, 0, -0.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell469"
            geometry={nodes.Cube_cell469.geometry}
            material={materials.CUBE}
            position={[36.92, -6.78, -36.66]}
            rotation={[-0.02, 1.28, 1.21]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell470"
            geometry={nodes.Cube_cell470.geometry}
            material={materials.CUBE}
            position={[9.09, -13.11, 23.2]}
            rotation={[0.99, 1.06, -1.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell471"
            geometry={nodes.Cube_cell471.geometry}
            material={materials.CUBE}
            position={[7.76, 2.31, 13.5]}
            rotation={[0.33, -0.59, -0.7]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell472"
            geometry={nodes.Cube_cell472.geometry}
            material={materials.CUBE}
            position={[-6.63, 40.2, -41.05]}
            rotation={[1.61, 1.23, -2.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell473"
            geometry={nodes.Cube_cell473.geometry}
            material={materials.CUBE}
            position={[10.34, -11.19, 8.63]}
            rotation={[0.07, 0.96, 1.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell474"
            geometry={nodes.Cube_cell474.geometry}
            material={materials.CUBE}
            position={[39.97, -15.02, 34.44]}
            rotation={[0.17, 0.02, -0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell475"
            geometry={nodes.Cube_cell475.geometry}
            material={materials.CUBE}
            position={[-8.3, -23.56, 17.12]}
            rotation={[-2.15, -0.15, -2.3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell476"
            geometry={nodes.Cube_cell476.geometry}
            material={materials.CUBE}
            position={[-2.27, -1.46, -19.75]}
            rotation={[1.01, 0.52, -0.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell477"
            geometry={nodes.Cube_cell477.geometry}
            material={materials.CUBE}
            position={[-19.64, 22.66, -20.26]}
            rotation={[1.28, -0.4, -0.89]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell478"
            geometry={nodes.Cube_cell478.geometry}
            material={materials.CUBE}
            position={[15.11, 5.7, 33.71]}
            rotation={[-0.17, 0.3, -0.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell479"
            geometry={nodes.Cube_cell479.geometry}
            material={materials.CUBE}
            position={[3.4, 8.25, -47.8]}
            rotation={[-0.76, 0.09, -2.89]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell480"
            geometry={nodes.Cube_cell480.geometry}
            material={materials.CUBE}
            position={[2.82, 2.37, -43.02]}
            rotation={[1.87, 0.77, 3.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell481"
            geometry={nodes.Cube_cell481.geometry}
            material={materials.CUBE}
            position={[-14.57, 24.47, 49.67]}
            rotation={[0.81, -0.39, 1.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell482"
            geometry={nodes.Cube_cell482.geometry}
            material={materials.CUBE}
            position={[-29.88, -8.96, -10.29]}
            rotation={[-1.75, -0.03, -0.59]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell483"
            geometry={nodes.Cube_cell483.geometry}
            material={materials.CUBE}
            position={[-5.17, -28.02, 29.7]}
            rotation={[-1.25, 0.04, -0.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell484"
            geometry={nodes.Cube_cell484.geometry}
            material={materials.CUBE}
            position={[-1.33, 33.34, 0.39]}
            rotation={[2.33, -1.44, 1.28]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell485"
            geometry={nodes.Cube_cell485.geometry}
            material={materials.CUBE}
            position={[9.52, -39.05, -5.47]}
            rotation={[-0.42, 0.25, -2.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell486"
            geometry={nodes.Cube_cell486.geometry}
            material={materials.CUBE}
            position={[6.75, 25.31, 22.53]}
            rotation={[-0.44, -0.19, 0.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell487"
            geometry={nodes.Cube_cell487.geometry}
            material={materials.CUBE}
            position={[-6.34, 8.05, -42.88]}
            rotation={[-0.85, 0.56, 2.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell488"
            geometry={nodes.Cube_cell488.geometry}
            material={materials.CUBE}
            position={[4.92, -7.88, 39.03]}
            rotation={[2.8, 0.17, 0.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell489"
            geometry={nodes.Cube_cell489.geometry}
            material={materials.CUBE}
            position={[-7.66, 1.48, 5.56]}
            rotation={[0.07, -0.15, 2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell490"
            geometry={nodes.Cube_cell490.geometry}
            material={materials.CUBE}
            position={[-0.05, 25.75, 25.77]}
            rotation={[2.03, 0.01, 2.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell491"
            geometry={nodes.Cube_cell491.geometry}
            material={materials.CUBE}
            position={[8.2, -26.74, -2.18]}
            rotation={[-3.05, -1.17, -0.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell492"
            geometry={nodes.Cube_cell492.geometry}
            material={materials.CUBE}
            position={[27.23, 13.4, -22.36]}
            rotation={[-0.44, -0.79, -0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell493"
            geometry={nodes.Cube_cell493.geometry}
            material={materials.CUBE}
            position={[1.28, 12.07, 15.27]}
            rotation={[-2.06, 0.61, -0.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell494"
            geometry={nodes.Cube_cell494.geometry}
            material={materials.CUBE}
            position={[3.23, -34.61, -3.68]}
            rotation={[0.47, -0.22, -1.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell495"
            geometry={nodes.Cube_cell495.geometry}
            material={materials.CUBE}
            position={[-12.48, -8.77, -17.38]}
            rotation={[0.36, 0.04, 2.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell496"
            geometry={nodes.Cube_cell496.geometry}
            material={materials.CUBE}
            position={[-3.56, 64.55, 4.45]}
            rotation={[1.34, -0.62, 2.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell497"
            geometry={nodes.Cube_cell497.geometry}
            material={materials.CUBE}
            position={[3.55, 43.4, -23.8]}
            rotation={[-2.89, -0.1, 0.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell498"
            geometry={nodes.Cube_cell498.geometry}
            material={materials.CUBE}
            position={[-8.61, -20.79, 0.99]}
            rotation={[0.73, 0, 1.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell499"
            geometry={nodes.Cube_cell499.geometry}
            material={materials.CUBE}
            position={[-15.67, -15.33, 32.95]}
            rotation={[-2.25, 0.71, 3.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell500"
            geometry={nodes.Cube_cell500.geometry}
            material={materials.CUBE}
            position={[-11.83, -10.28, -13.45]}
            rotation={[3.12, -0.97, 1.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell501"
            geometry={nodes.Cube_cell501.geometry}
            material={materials.CUBE}
            position={[-16.36, -7.57, 24.47]}
            rotation={[-0.74, 0.4, 3.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell502"
            geometry={nodes.Cube_cell502.geometry}
            material={materials.CUBE}
            position={[-6.36, 36.93, 15.5]}
            rotation={[-2.89, 0.49, -0.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell503"
            geometry={nodes.Cube_cell503.geometry}
            material={materials.CUBE}
            position={[0.38, -0.96, 17.39]}
            rotation={[3.07, -1.43, -2.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell504"
            geometry={nodes.Cube_cell504.geometry}
            material={materials.CUBE}
            position={[4.07, 43.24, -8.16]}
            rotation={[-1.16, -0.09, 2.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell505"
            geometry={nodes.Cube_cell505.geometry}
            material={materials.CUBE}
            position={[25.61, -10.29, 3.99]}
            rotation={[1.35, -0.74, 0.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell506"
            geometry={nodes.Cube_cell506.geometry}
            material={materials.CUBE}
            position={[-0.66, 0.36, -25.39]}
            rotation={[2.46, 0.21, 2.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell507"
            geometry={nodes.Cube_cell507.geometry}
            material={materials.CUBE}
            position={[20.95, 0.09, -28.29]}
            rotation={[-2.82, -1.05, -1.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell508"
            geometry={nodes.Cube_cell508.geometry}
            material={materials.CUBE}
            position={[3.99, 24.73, 7.81]}
            rotation={[-0.76, 0.9, -0.4]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell509"
            geometry={nodes.Cube_cell509.geometry}
            material={materials.CUBE}
            position={[0.05, 28.97, -9.48]}
            rotation={[-0.62, 0.74, -2.76]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell510"
            geometry={nodes.Cube_cell510.geometry}
            material={materials.CUBE}
            position={[12.65, -55.31, 11.47]}
            rotation={[-1.35, 0.62, -0.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell511"
            geometry={nodes.Cube_cell511.geometry}
            material={materials.CUBE}
            position={[-7.3, 37.65, -6.45]}
            rotation={[-0.01, -0.18, 0.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell512"
            geometry={nodes.Cube_cell512.geometry}
            material={materials.CUBE}
            position={[-1.83, -0.62, 18.79]}
            rotation={[-2.46, 0.16, 2.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell513"
            geometry={nodes.Cube_cell513.geometry}
            material={materials.CUBE}
            position={[-6.75, -5.37, 19.43]}
            rotation={[-0.28, 0.57, 0.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell514"
            geometry={nodes.Cube_cell514.geometry}
            material={materials.CUBE}
            position={[38.28, 62.71, -20.86]}
            rotation={[-2.15, 0.02, -0.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell515"
            geometry={nodes.Cube_cell515.geometry}
            material={materials.CUBE}
            position={[23.75, -59.36, 24.9]}
            rotation={[1.58, 0.34, -1.63]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell516"
            geometry={nodes.Cube_cell516.geometry}
            material={materials.CUBE}
            position={[-5.86, 9.24, -29.54]}
            rotation={[-0.58, 0.08, 0.4]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell517"
            geometry={nodes.Cube_cell517.geometry}
            material={materials.CUBE}
            position={[7.72, -25.52, 14.98]}
            rotation={[1.92, -0.32, 1.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell518"
            geometry={nodes.Cube_cell518.geometry}
            material={materials.CUBE}
            position={[29.79, 26.22, 15.38]}
            rotation={[0.61, 0.21, -1.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell519"
            geometry={nodes.Cube_cell519.geometry}
            material={materials.CUBE}
            position={[-29.69, 10.34, 37.35]}
            rotation={[-2.43, -0.53, -0.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell520"
            geometry={nodes.Cube_cell520.geometry}
            material={materials.CUBE}
            position={[-0.66, -28.13, -14.9]}
            rotation={[0.31, -0.32, 1.73]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell521"
            geometry={nodes.Cube_cell521.geometry}
            material={materials.CUBE}
            position={[2.38, 25.45, 36.1]}
            rotation={[0.66, 0.39, -2.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell522"
            geometry={nodes.Cube_cell522.geometry}
            material={materials.CUBE}
            position={[-7.17, -41.45, -7.55]}
            rotation={[0.67, -1.18, 0.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell523"
            geometry={nodes.Cube_cell523.geometry}
            material={materials.CUBE}
            position={[-6.82, 13.65, -10.77]}
            rotation={[3.12, 0.19, -0.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell524"
            geometry={nodes.Cube_cell524.geometry}
            material={materials.CUBE}
            position={[-10.8, 21.07, -5.16]}
            rotation={[-0.86, 0.63, 0.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell525"
            geometry={nodes.Cube_cell525.geometry}
            material={materials.CUBE}
            position={[-6.21, -4.65, -14.7]}
            rotation={[-0.58, 0.7, 1.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell526"
            geometry={nodes.Cube_cell526.geometry}
            material={materials.CUBE}
            position={[2.92, -34.33, 35.07]}
            rotation={[-0.58, 0.04, -2.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell527"
            geometry={nodes.Cube_cell527.geometry}
            material={materials.CUBE}
            position={[16.39, -44.59, -30.82]}
            rotation={[-1.05, 0.27, 1.78]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell528"
            geometry={nodes.Cube_cell528.geometry}
            material={materials.CUBE}
            position={[13.77, -32.21, 7.97]}
            rotation={[-2.07, 1.06, 2.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell529"
            geometry={nodes.Cube_cell529.geometry}
            material={materials.CUBE}
            position={[-3.69, -14.55, -34.19]}
            rotation={[1.7, 0.74, 0.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell530"
            geometry={nodes.Cube_cell530.geometry}
            material={materials.CUBE}
            position={[-16.7, 10.67, 21.17]}
            rotation={[0.51, -0.1, -0.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell531"
            geometry={nodes.Cube_cell531.geometry}
            material={materials.CUBE}
            position={[19.86, 23.12, -29.29]}
            rotation={[-0.1, 0.89, -2.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell532"
            geometry={nodes.Cube_cell532.geometry}
            material={materials.CUBE}
            position={[2.87, -10.01, -30.74]}
            rotation={[0.38, -0.47, -2.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell533"
            geometry={nodes.Cube_cell533.geometry}
            material={materials.CUBE}
            position={[3.92, 15.61, 20.13]}
            rotation={[2.34, 0.2, 0.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell534"
            geometry={nodes.Cube_cell534.geometry}
            material={materials.CUBE}
            position={[-2.27, 18.94, 5.84]}
            rotation={[-1.82, 0.08, -1.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell535"
            geometry={nodes.Cube_cell535.geometry}
            material={materials.CUBE}
            position={[42.72, 10.77, -7.83]}
            rotation={[1.63, 0.01, 0.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell536"
            geometry={nodes.Cube_cell536.geometry}
            material={materials.CUBE}
            position={[-11.39, -11.94, -14.35]}
            rotation={[-1.49, -0.25, -0.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell537"
            geometry={nodes.Cube_cell537.geometry}
            material={materials.CUBE}
            position={[-1.21, 9.07, -17.08]}
            rotation={[1.86, -0.33, 0.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell538"
            geometry={nodes.Cube_cell538.geometry}
            material={materials.CUBE}
            position={[-1.03, 19.21, 15.21]}
            rotation={[-3.09, 0.14, 2.63]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell539"
            geometry={nodes.Cube_cell539.geometry}
            material={materials.CUBE}
            position={[1.19, -44.04, -33.78]}
            rotation={[-2.56, -1.23, -1.74]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell540"
            geometry={nodes.Cube_cell540.geometry}
            material={materials.CUBE}
            position={[-4.85, 12.59, -0.32]}
            rotation={[-2.2, 0.92, -0.31]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell541"
            geometry={nodes.Cube_cell541.geometry}
            material={materials.CUBE}
            position={[-7.61, -24.63, -32.47]}
            rotation={[2.33, -1.3, 1.79]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell542"
            geometry={nodes.Cube_cell542.geometry}
            material={materials.CUBE}
            position={[-0.22, 37.83, -13.19]}
            rotation={[-1.27, -0.45, -0.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell543"
            geometry={nodes.Cube_cell543.geometry}
            material={materials.CUBE}
            position={[11.33, 15.95, -0.64]}
            rotation={[1.13, 0.33, -0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell544"
            geometry={nodes.Cube_cell544.geometry}
            material={materials.CUBE}
            position={[-2.51, 41.82, 26.73]}
            rotation={[0.24, -0.6, 0.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell545"
            geometry={nodes.Cube_cell545.geometry}
            material={materials.CUBE}
            position={[-5, -12.76, 1.45]}
            rotation={[2.75, -0.41, 0.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell546"
            geometry={nodes.Cube_cell546.geometry}
            material={materials.CUBE}
            position={[0.26, 25.71, -27.43]}
            rotation={[2.64, 0.02, 0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell547"
            geometry={nodes.Cube_cell547.geometry}
            material={materials.CUBE}
            position={[4.28, -34.44, 40.94]}
            rotation={[2.51, -0.29, 0.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell548"
            geometry={nodes.Cube_cell548.geometry}
            material={materials.CUBE}
            position={[5.34, 15.88, 17.19]}
            rotation={[2.96, -0.64, 0.7]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell549"
            geometry={nodes.Cube_cell549.geometry}
            material={materials.CUBE}
            position={[13.41, 10.44, 0.22]}
            rotation={[2.84, -0.03, -2.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell550"
            geometry={nodes.Cube_cell550.geometry}
            material={materials.CUBE}
            position={[31.92, -8.34, -22.81]}
            rotation={[-2.87, 0.45, -1.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell551"
            geometry={nodes.Cube_cell551.geometry}
            material={materials.CUBE}
            position={[13.34, 29.73, -6.29]}
            rotation={[0.84, 0.71, -1.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell552"
            geometry={nodes.Cube_cell552.geometry}
            material={materials.CUBE}
            position={[-7.11, -4.42, -42.46]}
            rotation={[-1.3, 0.72, 0.85]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell553"
            geometry={nodes.Cube_cell553.geometry}
            material={materials.CUBE}
            position={[5.33, -18.67, -9.25]}
            rotation={[-0.88, -0.25, 1.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell554"
            geometry={nodes.Cube_cell554.geometry}
            material={materials.CUBE}
            position={[-1.13, 16.14, 18.05]}
            rotation={[-0.03, 0, -2.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell555"
            geometry={nodes.Cube_cell555.geometry}
            material={materials.CUBE}
            position={[2.59, 50.68, -5.66]}
            rotation={[-3.1, -0.34, 0.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell556"
            geometry={nodes.Cube_cell556.geometry}
            material={materials.CUBE}
            position={[-37.18, -13.2, 19.07]}
            rotation={[0.11, 0.69, 2.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell557"
            geometry={nodes.Cube_cell557.geometry}
            material={materials.CUBE}
            position={[-10.99, -1.85, -10.24]}
            rotation={[2.56, 0.59, -1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell558"
            geometry={nodes.Cube_cell558.geometry}
            material={materials.CUBE}
            position={[-11.75, -41.42, -9.58]}
            rotation={[0.46, 1.14, -0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell559"
            geometry={nodes.Cube_cell559.geometry}
            material={materials.CUBE}
            position={[-6.27, -7.68, 21.35]}
            rotation={[0.65, -0.72, 2.17]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell560"
            geometry={nodes.Cube_cell560.geometry}
            material={materials.CUBE}
            position={[1.78, 7.15, -32.88]}
            rotation={[0.95, -0.59, -1.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell561"
            geometry={nodes.Cube_cell561.geometry}
            material={materials.CUBE}
            position={[5.57, 32.64, 22.86]}
            rotation={[0.66, -0.31, 2.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell562"
            geometry={nodes.Cube_cell562.geometry}
            material={materials.CUBE}
            position={[-2.39, 42.66, -25.45]}
            rotation={[-2.94, 0.9, 2.91]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell563"
            geometry={nodes.Cube_cell563.geometry}
            material={materials.CUBE}
            position={[-0.08, -49.63, -17.87]}
            rotation={[-0.45, 0.67, -2.63]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell564"
            geometry={nodes.Cube_cell564.geometry}
            material={materials.CUBE}
            position={[0.28, 23.56, -12.93]}
            rotation={[-2.38, -0.29, 0.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell565"
            geometry={nodes.Cube_cell565.geometry}
            material={materials.CUBE}
            position={[16.17, 1.59, 15.94]}
            rotation={[3.08, 0.55, 3.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell566"
            geometry={nodes.Cube_cell566.geometry}
            material={materials.CUBE}
            position={[-13.23, -12.91, 32.04]}
            rotation={[-0.31, 1.01, 1.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell567"
            geometry={nodes.Cube_cell567.geometry}
            material={materials.CUBE}
            position={[2.19, -15.38, 21.13]}
            rotation={[-0.68, -0.32, 0.48]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell568"
            geometry={nodes.Cube_cell568.geometry}
            material={materials.CUBE}
            position={[-0.58, -6.88, -1.17]}
            rotation={[1.38, 0.3, 1.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell569"
            geometry={nodes.Cube_cell569.geometry}
            material={materials.CUBE}
            position={[-7.41, -5.84, 32.69]}
            rotation={[-1.43, 0.21, -0.3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell570"
            geometry={nodes.Cube_cell570.geometry}
            material={materials.CUBE}
            position={[-0.62, -27.04, -11.88]}
            rotation={[-1.04, -0.48, -0.83]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell571"
            geometry={nodes.Cube_cell571.geometry}
            material={materials.CUBE}
            position={[-0.95, 39.67, 0.7]}
            rotation={[-2.15, 0.14, 0.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell572"
            geometry={nodes.Cube_cell572.geometry}
            material={materials.CUBE}
            position={[-6.76, -27.08, 4.36]}
            rotation={[-1.74, 0.46, 1.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell573"
            geometry={nodes.Cube_cell573.geometry}
            material={materials.CUBE}
            position={[7.03, -18.74, 12.19]}
            rotation={[2.79, 0.57, 0.74]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell574"
            geometry={nodes.Cube_cell574.geometry}
            material={materials.CUBE}
            position={[-2.06, 2.56, 22.92]}
            rotation={[3.02, -1.21, 2.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell575"
            geometry={nodes.Cube_cell575.geometry}
            material={materials.CUBE}
            position={[22.73, -0.52, 29.93]}
            rotation={[1.81, -0.7, -0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell576"
            geometry={nodes.Cube_cell576.geometry}
            material={materials.CUBE}
            position={[0.55, 47.81, 11.49]}
            rotation={[2.9, -0.04, 0.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell577"
            geometry={nodes.Cube_cell577.geometry}
            material={materials.CUBE}
            position={[9.02, -6.78, -0.17]}
            rotation={[2.93, -0.59, -3.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell578"
            geometry={nodes.Cube_cell578.geometry}
            material={materials.CUBE}
            position={[-2.65, 29.89, -11.43]}
            rotation={[0.92, 0.15, -0.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell579"
            geometry={nodes.Cube_cell579.geometry}
            material={materials.CUBE}
            position={[1.74, 30.24, 26.64]}
            rotation={[1.93, 0.34, 1.85]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell580"
            geometry={nodes.Cube_cell580.geometry}
            material={materials.CUBE}
            position={[-4.16, 0.09, -14.22]}
            rotation={[0.01, -0.1, 0.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell581"
            geometry={nodes.Cube_cell581.geometry}
            material={materials.CUBE}
            position={[4.73, 9.09, -45.49]}
            rotation={[-0.3, -0.73, 1.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell582"
            geometry={nodes.Cube_cell582.geometry}
            material={materials.CUBE}
            position={[-6.6, 32.77, -9.58]}
            rotation={[0.43, 0.45, 1.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell583"
            geometry={nodes.Cube_cell583.geometry}
            material={materials.CUBE}
            position={[1.33, 34.14, 19.07]}
            rotation={[-0.82, -0.3, -0.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell584"
            geometry={nodes.Cube_cell584.geometry}
            material={materials.CUBE}
            position={[-4.97, -7.59, 16.67]}
            rotation={[0.58, 0.48, -3.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell585"
            geometry={nodes.Cube_cell585.geometry}
            material={materials.CUBE}
            position={[-12.38, 7.02, -71.51]}
            rotation={[-1.42, 0.06, -0.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell586"
            geometry={nodes.Cube_cell586.geometry}
            material={materials.CUBE}
            position={[5.98, -25.41, 8.42]}
            rotation={[2.22, 1.47, -2.83]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell587"
            geometry={nodes.Cube_cell587.geometry}
            material={materials.CUBE}
            position={[-41.97, -6.49, 25.75]}
            rotation={[1.36, -0.34, 1.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell588"
            geometry={nodes.Cube_cell588.geometry}
            material={materials.CUBE}
            position={[-4.73, -28.48, -19.79]}
            rotation={[0.27, -0.04, 2.97]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell589"
            geometry={nodes.Cube_cell589.geometry}
            material={materials.CUBE}
            position={[-3.45, 5.59, -13.47]}
            rotation={[2.43, 0.09, 0.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell590"
            geometry={nodes.Cube_cell590.geometry}
            material={materials.CUBE}
            position={[26.05, -11.56, 19.72]}
            rotation={[1.58, 1.21, 2.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell591"
            geometry={nodes.Cube_cell591.geometry}
            material={materials.CUBE}
            position={[2.58, 22.47, -3.89]}
            rotation={[-2.74, -0.06, -2.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell592"
            geometry={nodes.Cube_cell592.geometry}
            material={materials.CUBE}
            position={[-7.11, 28.75, 25.1]}
            rotation={[-1.45, -0.35, -0.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell593"
            geometry={nodes.Cube_cell593.geometry}
            material={materials.CUBE}
            position={[-11.08, -12.09, -4.68]}
            rotation={[2.8, 0.29, 3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell594"
            geometry={nodes.Cube_cell594.geometry}
            material={materials.CUBE}
            position={[-13.1, 14.49, 5.38]}
            rotation={[-2.97, 0.36, -0.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell595"
            geometry={nodes.Cube_cell595.geometry}
            material={materials.CUBE}
            position={[-26.06, -19.61, 32.99]}
            rotation={[-1.09, -0.98, -2.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell596"
            geometry={nodes.Cube_cell596.geometry}
            material={materials.CUBE}
            position={[-5.61, -7.27, 12.7]}
            rotation={[-2.12, -0.34, -3.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell597"
            geometry={nodes.Cube_cell597.geometry}
            material={materials.CUBE}
            position={[4.21, -7.96, -2.75]}
            rotation={[2.81, -0.21, 1.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell598"
            geometry={nodes.Cube_cell598.geometry}
            material={materials.CUBE}
            position={[-37.03, 17.1, 9.16]}
            rotation={[-0.2, 0.08, -0.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell599"
            geometry={nodes.Cube_cell599.geometry}
            material={materials.CUBE}
            position={[-3.87, -20.66, -22.75]}
            rotation={[2.78, -0.35, -0.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell600"
            geometry={nodes.Cube_cell600.geometry}
            material={materials.CUBE}
            position={[-12.39, -8.03, 24.92]}
            rotation={[-1.13, -0.19, -0.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell601"
            geometry={nodes.Cube_cell601.geometry}
            material={materials.CUBE}
            position={[-4.4, -5.46, 14.66]}
            rotation={[-0.81, -0.66, 1.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell602"
            geometry={nodes.Cube_cell602.geometry}
            material={materials.CUBE}
            position={[-16.07, -22.09, 16.88]}
            rotation={[2.78, 0.03, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell603"
            geometry={nodes.Cube_cell603.geometry}
            material={materials.CUBE}
            position={[17.4, 40.36, 16.79]}
            rotation={[-1.48, 0.53, -0.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell604"
            geometry={nodes.Cube_cell604.geometry}
            material={materials.CUBE}
            position={[0.41, 23.93, -20.39]}
            rotation={[-1.57, -0.33, 0.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell605"
            geometry={nodes.Cube_cell605.geometry}
            material={materials.CUBE}
            position={[5.33, 15.97, 12.41]}
            rotation={[2.2, 0.51, 2.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell606"
            geometry={nodes.Cube_cell606.geometry}
            material={materials.CUBE}
            position={[-10.71, 42.11, -49.95]}
            rotation={[2.07, -0.84, -2.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell607"
            geometry={nodes.Cube_cell607.geometry}
            material={materials.CUBE}
            position={[38.8, -9.61, 40.24]}
            rotation={[-0.14, -0.37, 0.73]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell608"
            geometry={nodes.Cube_cell608.geometry}
            material={materials.CUBE}
            position={[-20.57, 1.28, -23.61]}
            rotation={[0.94, 0.03, -1.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell609"
            geometry={nodes.Cube_cell609.geometry}
            material={materials.CUBE}
            position={[1.29, 66.28, -12.88]}
            rotation={[-0.78, 0.43, 0.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell610"
            geometry={nodes.Cube_cell610.geometry}
            material={materials.CUBE}
            position={[-33.24, -24.43, 3.78]}
            rotation={[2.73, -0.28, 3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell611"
            geometry={nodes.Cube_cell611.geometry}
            material={materials.CUBE}
            position={[-0.26, 28.12, 2.36]}
            rotation={[-3.09, 0.86, 2.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell612"
            geometry={nodes.Cube_cell612.geometry}
            material={materials.CUBE}
            position={[-3.14, -5.67, 0.81]}
            rotation={[-0.93, 0.69, 2.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell613"
            geometry={nodes.Cube_cell613.geometry}
            material={materials.CUBE}
            position={[7.18, -8.86, 6]}
            rotation={[0.96, 0.95, 0.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell614"
            geometry={nodes.Cube_cell614.geometry}
            material={materials.CUBE}
            position={[8.55, -23.95, -22.84]}
            rotation={[0.44, 0.95, -0.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell615"
            geometry={nodes.Cube_cell615.geometry}
            material={materials.CUBE}
            position={[-7.39, -37.38, -45.36]}
            rotation={[-0.47, 0.27, 0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell616"
            geometry={nodes.Cube_cell616.geometry}
            material={materials.CUBE}
            position={[8.28, 44.37, 43.62]}
            rotation={[0.01, 0.55, 0.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell617"
            geometry={nodes.Cube_cell617.geometry}
            material={materials.CUBE}
            position={[-10.42, 6.68, 43.58]}
            rotation={[-1.62, -0.28, 1.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell618"
            geometry={nodes.Cube_cell618.geometry}
            material={materials.CUBE}
            position={[4.86, 1.69, -11.4]}
            rotation={[1.2, 0.41, -0.29]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell619"
            geometry={nodes.Cube_cell619.geometry}
            material={materials.CUBE}
            position={[-2.97, 13.89, 18.47]}
            rotation={[-1.21, 0.34, -0.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell620"
            geometry={nodes.Cube_cell620.geometry}
            material={materials.CUBE}
            position={[3.48, -8.25, -28.43]}
            rotation={[0.33, 0.55, 2.43]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell621"
            geometry={nodes.Cube_cell621.geometry}
            material={materials.CUBE}
            position={[-2.48, 1.78, 19.1]}
            rotation={[0.7, 0.57, -1.59]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell622"
            geometry={nodes.Cube_cell622.geometry}
            material={materials.CUBE}
            position={[8.87, 18.15, 10.03]}
            rotation={[2, -0.13, 1.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell623"
            geometry={nodes.Cube_cell623.geometry}
            material={materials.CUBE}
            position={[-30.88, 22.01, -5.31]}
            rotation={[-2.57, -0.63, -2.78]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell624"
            geometry={nodes.Cube_cell624.geometry}
            material={materials.CUBE}
            position={[-0.24, -29.68, 10.41]}
            rotation={[-0.1, 0.82, 0.22]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell625"
            geometry={nodes.Cube_cell625.geometry}
            material={materials.CUBE}
            position={[-1.16, -38.05, -31.47]}
            rotation={[0.5, 0.14, -2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell626"
            geometry={nodes.Cube_cell626.geometry}
            material={materials.CUBE}
            position={[3.43, -34.53, 15.25]}
            rotation={[2.48, 1.26, -2.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell627"
            geometry={nodes.Cube_cell627.geometry}
            material={materials.CUBE}
            position={[11.89, -31.1, 11.53]}
            rotation={[-0.12, -0.03, -2.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell628"
            geometry={nodes.Cube_cell628.geometry}
            material={materials.CUBE}
            position={[4.19, -26.09, -12.4]}
            rotation={[2.31, -0.23, 2.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell629"
            geometry={nodes.Cube_cell629.geometry}
            material={materials.CUBE}
            position={[-11.17, 45.31, -11.5]}
            rotation={[-0.78, 0.02, 1.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell630"
            geometry={nodes.Cube_cell630.geometry}
            material={materials.CUBE}
            position={[3.2, 41.79, 14.46]}
            rotation={[2.53, 0.56, -2.39]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell631"
            geometry={nodes.Cube_cell631.geometry}
            material={materials.CUBE}
            position={[-10.45, 28.17, 20.15]}
            rotation={[-1.6, 0.42, 2.48]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell632"
            geometry={nodes.Cube_cell632.geometry}
            material={materials.CUBE}
            position={[16.05, 6.93, -9.18]}
            rotation={[-0.9, -0.29, -2.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell633"
            geometry={nodes.Cube_cell633.geometry}
            material={materials.CUBE}
            position={[-4.55, 14.36, -47.22]}
            rotation={[3.13, -0.82, -2.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell634"
            geometry={nodes.Cube_cell634.geometry}
            material={materials.CUBE}
            position={[-13.46, -29.27, -34.19]}
            rotation={[-2.09, 0.49, 0.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell635"
            geometry={nodes.Cube_cell635.geometry}
            material={materials.CUBE}
            position={[-19.71, 9.84, -17.52]}
            rotation={[0.04, 1.19, 1.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell636"
            geometry={nodes.Cube_cell636.geometry}
            material={materials.CUBE}
            position={[6.18, 47.51, 2.31]}
            rotation={[-1.51, -0.27, 0.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell637"
            geometry={nodes.Cube_cell637.geometry}
            material={materials.CUBE}
            position={[1.15, 55.12, -14.58]}
            rotation={[2.16, 0.38, -0.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell638"
            geometry={nodes.Cube_cell638.geometry}
            material={materials.CUBE}
            position={[-12.75, -51.29, 48.25]}
            rotation={[1.3, 1.11, 0.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell639"
            geometry={nodes.Cube_cell639.geometry}
            material={materials.CUBE}
            position={[17.2, -12.95, -38.38]}
            rotation={[0.98, -0.36, 1.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell640"
            geometry={nodes.Cube_cell640.geometry}
            material={materials.CUBE}
            position={[9.42, -8.95, 38.02]}
            rotation={[-0.24, 0.12, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell641"
            geometry={nodes.Cube_cell641.geometry}
            material={materials.CUBE}
            position={[6.5, -30.73, 12.2]}
            rotation={[3.02, -0.58, 3.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell642"
            geometry={nodes.Cube_cell642.geometry}
            material={materials.CUBE}
            position={[0.19, 18.65, -40.85]}
            rotation={[-1.28, 0.3, -1.83]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell643"
            geometry={nodes.Cube_cell643.geometry}
            material={materials.CUBE}
            position={[-46.21, -30.75, -4.74]}
            rotation={[-0.27, -0.58, -0.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell644"
            geometry={nodes.Cube_cell644.geometry}
            material={materials.CUBE}
            position={[-6.46, -27.77, -16.19]}
            rotation={[0.09, -0.39, -0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell645"
            geometry={nodes.Cube_cell645.geometry}
            material={materials.CUBE}
            position={[3.19, 62.04, -7.53]}
            rotation={[0.41, -0.14, 1.37]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell646"
            geometry={nodes.Cube_cell646.geometry}
            material={materials.CUBE}
            position={[-15.09, 3.6, 36.48]}
            rotation={[-1.19, 0.14, -0.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell647"
            geometry={nodes.Cube_cell647.geometry}
            material={materials.CUBE}
            position={[3.3, 23.94, -42.99]}
            rotation={[-0.86, -0.06, 0.67]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell648"
            geometry={nodes.Cube_cell648.geometry}
            material={materials.CUBE}
            position={[-15.1, 23.57, -6.98]}
            rotation={[1.96, -0.66, 1.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell649"
            geometry={nodes.Cube_cell649.geometry}
            material={materials.CUBE}
            position={[26.33, -25, -12.91]}
            rotation={[1.67, -0.6, 0.39]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell650"
            geometry={nodes.Cube_cell650.geometry}
            material={materials.CUBE}
            position={[14.81, -20.88, -37.37]}
            rotation={[1.12, -0.75, 2.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell651"
            geometry={nodes.Cube_cell651.geometry}
            material={materials.CUBE}
            position={[-9.67, -13.65, 35.62]}
            rotation={[-0.18, 0.11, -2.98]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell652"
            geometry={nodes.Cube_cell652.geometry}
            material={materials.CUBE}
            position={[3.63, 32.45, 13.11]}
            rotation={[-0.44, 0.5, 0.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell653"
            geometry={nodes.Cube_cell653.geometry}
            material={materials.CUBE}
            position={[-2.37, 38.6, 32.21]}
            rotation={[-1.38, 0.41, 0.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell654"
            geometry={nodes.Cube_cell654.geometry}
            material={materials.CUBE}
            position={[3.33, -31.83, 34.46]}
            rotation={[0.97, -0.22, 2.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell655"
            geometry={nodes.Cube_cell655.geometry}
            material={materials.CUBE}
            position={[3.65, 48.23, 13.75]}
            rotation={[-2.67, -0.46, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell656"
            geometry={nodes.Cube_cell656.geometry}
            material={materials.CUBE}
            position={[-17.2, -21.28, 65.02]}
            rotation={[-1.59, 0.34, 3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell657"
            geometry={nodes.Cube_cell657.geometry}
            material={materials.CUBE}
            position={[-5.32, -2.29, 1.38]}
            rotation={[0.08, -0.12, 2.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell658"
            geometry={nodes.Cube_cell658.geometry}
            material={materials.CUBE}
            position={[-28.76, 2.71, -13.93]}
            rotation={[2.88, 0.19, -3.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell659"
            geometry={nodes.Cube_cell659.geometry}
            material={materials.CUBE}
            position={[-7.21, 5.45, -1.08]}
            rotation={[-2.59, 0.04, 0.76]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell660"
            geometry={nodes.Cube_cell660.geometry}
            material={materials.CUBE}
            position={[-5.09, -7.52, -29.6]}
            rotation={[-1.03, -0.06, -0.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell661"
            geometry={nodes.Cube_cell661.geometry}
            material={materials.CUBE}
            position={[9.61, 17.32, -17.5]}
            rotation={[1.43, -0.45, -2.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell662"
            geometry={nodes.Cube_cell662.geometry}
            material={materials.CUBE}
            position={[-3.82, 7.7, -8.73]}
            rotation={[2.56, -0.16, 2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell663"
            geometry={nodes.Cube_cell663.geometry}
            material={materials.CUBE}
            position={[-13.9, -6.11, -2.19]}
            rotation={[2.57, -0.07, 2.79]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell664"
            geometry={nodes.Cube_cell664.geometry}
            material={materials.CUBE}
            position={[-0.59, 35.11, -3.95]}
            rotation={[-2.64, 0.13, 0.79]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell665"
            geometry={nodes.Cube_cell665.geometry}
            material={materials.CUBE}
            position={[-5.01, -6.84, -2.1]}
            rotation={[1.24, -0.18, -0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell666"
            geometry={nodes.Cube_cell666.geometry}
            material={materials.CUBE}
            position={[-8.42, 15.99, -35.28]}
            rotation={[3.05, 0.89, 2.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell667"
            geometry={nodes.Cube_cell667.geometry}
            material={materials.CUBE}
            position={[-3.88, 9.15, -13.92]}
            rotation={[-0.46, 0.82, -1.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell668"
            geometry={nodes.Cube_cell668.geometry}
            material={materials.CUBE}
            position={[7.85, -30.42, 38.58]}
            rotation={[1.77, -0.76, 0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell669"
            geometry={nodes.Cube_cell669.geometry}
            material={materials.CUBE}
            position={[-4.14, 7.26, -11.78]}
            rotation={[-3.1, 0.11, -2.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell670"
            geometry={nodes.Cube_cell670.geometry}
            material={materials.CUBE}
            position={[-10.84, -0.16, 16.33]}
            rotation={[0.45, 1.17, -0.3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell671"
            geometry={nodes.Cube_cell671.geometry}
            material={materials.CUBE}
            position={[-6.54, -55.41, -45.1]}
            rotation={[2.6, -0.84, 1.93]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell672"
            geometry={nodes.Cube_cell672.geometry}
            material={materials.CUBE}
            position={[-6.55, -1.21, 4.77]}
            rotation={[-2.31, 1.32, 2.43]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell673"
            geometry={nodes.Cube_cell673.geometry}
            material={materials.CUBE}
            position={[0.67, 45.25, 19.18]}
            rotation={[-0.93, 0.19, -0.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell674"
            geometry={nodes.Cube_cell674.geometry}
            material={materials.CUBE}
            position={[12.24, -3.62, 26.49]}
            rotation={[-0.98, -0.44, -0.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell675"
            geometry={nodes.Cube_cell675.geometry}
            material={materials.CUBE}
            position={[7.83, 29.14, 25.44]}
            rotation={[0.19, -0.51, -0.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell676"
            geometry={nodes.Cube_cell676.geometry}
            material={materials.CUBE}
            position={[-3.38, -25.16, 6.16]}
            rotation={[1.98, 0.03, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell677"
            geometry={nodes.Cube_cell677.geometry}
            material={materials.CUBE}
            position={[-6.23, -31.32, 5.12]}
            rotation={[-0.57, 0.26, 1.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell678"
            geometry={nodes.Cube_cell678.geometry}
            material={materials.CUBE}
            position={[6.85, 11.14, -43.6]}
            rotation={[1.87, -0.47, 1.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell679"
            geometry={nodes.Cube_cell679.geometry}
            material={materials.CUBE}
            position={[-4.12, 21.08, -12.54]}
            rotation={[1.79, 0.42, -3.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell680"
            geometry={nodes.Cube_cell680.geometry}
            material={materials.CUBE}
            position={[9.48, 5.15, 28.44]}
            rotation={[0.25, 1.04, 0.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell681"
            geometry={nodes.Cube_cell681.geometry}
            material={materials.CUBE}
            position={[-0.94, 45.99, -2.14]}
            rotation={[1.25, -0.65, -1.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell682"
            geometry={nodes.Cube_cell682.geometry}
            material={materials.CUBE}
            position={[-14.37, -7.53, 25.04]}
            rotation={[-0.08, -0.24, 0.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell683"
            geometry={nodes.Cube_cell683.geometry}
            material={materials.CUBE}
            position={[40.5, 0.41, 10]}
            rotation={[-0.44, 0.18, -0.3]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell684"
            geometry={nodes.Cube_cell684.geometry}
            material={materials.CUBE}
            position={[14.31, -24.75, 32.05]}
            rotation={[0.8, 0.6, 0.48]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell685"
            geometry={nodes.Cube_cell685.geometry}
            material={materials.CUBE}
            position={[4.54, -12.14, -21.43]}
            rotation={[-1.72, 0.27, 1.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell686"
            geometry={nodes.Cube_cell686.geometry}
            material={materials.CUBE}
            position={[13.62, 8.15, -4.82]}
            rotation={[-1.28, -1.03, -2.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell687"
            geometry={nodes.Cube_cell687.geometry}
            material={materials.CUBE}
            position={[-4.57, 35.08, 1.05]}
            rotation={[-0.83, 0.57, 0]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell688"
            geometry={nodes.Cube_cell688.geometry}
            material={materials.CUBE}
            position={[-9.87, -6.23, -36.71]}
            rotation={[-0.98, -0.31, -2.22]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell689"
            geometry={nodes.Cube_cell689.geometry}
            material={materials.CUBE}
            position={[7.44, -14.94, 14.14]}
            rotation={[2.21, 0.13, -0.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell690"
            geometry={nodes.Cube_cell690.geometry}
            material={materials.CUBE}
            position={[-0.16, -16.84, 14.19]}
            rotation={[1.66, 0.65, 2.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell691"
            geometry={nodes.Cube_cell691.geometry}
            material={materials.CUBE}
            position={[-7.62, 0.7, 6.19]}
            rotation={[-2.18, -0.95, 0.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell692"
            geometry={nodes.Cube_cell692.geometry}
            material={materials.CUBE}
            position={[-3.03, 26.7, -26.01]}
            rotation={[-1.62, 0, -1.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell693"
            geometry={nodes.Cube_cell693.geometry}
            material={materials.CUBE}
            position={[2.08, 2.58, -10.69]}
            rotation={[-2.48, 0.03, -0.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell694"
            geometry={nodes.Cube_cell694.geometry}
            material={materials.CUBE}
            position={[1.26, -27.47, 19.61]}
            rotation={[-0.52, 0.18, 0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell695"
            geometry={nodes.Cube_cell695.geometry}
            material={materials.CUBE}
            position={[2.08, 27.37, -15.51]}
            rotation={[-1.33, 0.42, -1.48]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell696"
            geometry={nodes.Cube_cell696.geometry}
            material={materials.CUBE}
            position={[-9.22, 27.5, -39.2]}
            rotation={[2.36, -1.27, -2.85]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell697"
            geometry={nodes.Cube_cell697.geometry}
            material={materials.CUBE}
            position={[-0.85, 7.49, -7.36]}
            rotation={[-1.44, -0.45, -0.49]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell698"
            geometry={nodes.Cube_cell698.geometry}
            material={materials.CUBE}
            position={[-14.9, 7.22, -46.65]}
            rotation={[3.11, 0.27, 0.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell699"
            geometry={nodes.Cube_cell699.geometry}
            material={materials.CUBE}
            position={[8.46, -28.29, -20.68]}
            rotation={[0.33, -0.25, 2.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell700"
            geometry={nodes.Cube_cell700.geometry}
            material={materials.CUBE}
            position={[-0.17, 16.66, -39.09]}
            rotation={[2.43, 0.91, 2.79]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell701"
            geometry={nodes.Cube_cell701.geometry}
            material={materials.CUBE}
            position={[9.96, -61.64, -52.82]}
            rotation={[-0.72, 0.55, -1.76]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell702"
            geometry={nodes.Cube_cell702.geometry}
            material={materials.CUBE}
            position={[-40.11, 3.3, -1.7]}
            rotation={[0.04, -0.06, 1.99]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell703"
            geometry={nodes.Cube_cell703.geometry}
            material={materials.CUBE}
            position={[4.32, -21.73, -40.95]}
            rotation={[0.4, 0.54, 0.19]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell704"
            geometry={nodes.Cube_cell704.geometry}
            material={materials.CUBE}
            position={[3.16, -41.95, -39.98]}
            rotation={[-0.4, -0.4, -3.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell705"
            geometry={nodes.Cube_cell705.geometry}
            material={materials.CUBE}
            position={[-8.2, -14.98, 24.37]}
            rotation={[0.79, -0.5, 0.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell706"
            geometry={nodes.Cube_cell706.geometry}
            material={materials.CUBE}
            position={[-2.57, 49.31, 20.56]}
            rotation={[-1.29, 1.27, 1.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell707"
            geometry={nodes.Cube_cell707.geometry}
            material={materials.CUBE}
            position={[-12.09, 8.8, 13.67]}
            rotation={[1.24, 0.67, 1.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell708"
            geometry={nodes.Cube_cell708.geometry}
            material={materials.CUBE}
            position={[-1.61, -0.41, -9.46]}
            rotation={[-2.88, 0.23, -0.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell709"
            geometry={nodes.Cube_cell709.geometry}
            material={materials.CUBE}
            position={[-2.49, 6.89, -5.35]}
            rotation={[0.68, 1.25, 0.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell710"
            geometry={nodes.Cube_cell710.geometry}
            material={materials.CUBE}
            position={[-4.37, 42.36, -20.06]}
            rotation={[-2.93, 0.01, 0.35]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell711"
            geometry={nodes.Cube_cell711.geometry}
            material={materials.CUBE}
            position={[13.81, 1.8, -27.71]}
            rotation={[-0.25, -0.97, -0.22]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell712"
            geometry={nodes.Cube_cell712.geometry}
            material={materials.CUBE}
            position={[12.69, -39.04, -8.53]}
            rotation={[3.02, 0.63, 2.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell713"
            geometry={nodes.Cube_cell713.geometry}
            material={materials.CUBE}
            position={[-12.54, -13.53, 45.33]}
            rotation={[-0.28, 0.44, -0.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell714"
            geometry={nodes.Cube_cell714.geometry}
            material={materials.CUBE}
            position={[-28.73, 23.38, -14.14]}
            rotation={[-2.96, 1.04, 2.78]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell715"
            geometry={nodes.Cube_cell715.geometry}
            material={materials.CUBE}
            position={[14.78, -30.77, -76.38]}
            rotation={[0.51, -1.48, 2.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell716"
            geometry={nodes.Cube_cell716.geometry}
            material={materials.CUBE}
            position={[9.92, -24.84, 7.78]}
            rotation={[0.2, 0.38, -1.72]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell717"
            geometry={nodes.Cube_cell717.geometry}
            material={materials.CUBE}
            position={[8.98, 8.23, 0.27]}
            rotation={[-0.22, -0.93, 2.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell718"
            geometry={nodes.Cube_cell718.geometry}
            material={materials.CUBE}
            position={[9.55, 37.96, 49.06]}
            rotation={[-0.79, -0.97, 1.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell719"
            geometry={nodes.Cube_cell719.geometry}
            material={materials.CUBE}
            position={[-7.26, 1.63, -0.06]}
            rotation={[-2.89, -1.02, -1.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell720"
            geometry={nodes.Cube_cell720.geometry}
            material={materials.CUBE}
            position={[9.76, -12.34, 16.94]}
            rotation={[-0.03, 0.37, -0.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell721"
            geometry={nodes.Cube_cell721.geometry}
            material={materials.CUBE}
            position={[-0.58, 47.55, -24.27]}
            rotation={[2.44, 1.44, -2.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell722"
            geometry={nodes.Cube_cell722.geometry}
            material={materials.CUBE}
            position={[-8.76, -10.48, -10.87]}
            rotation={[0.67, 0.2, 2.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell723"
            geometry={nodes.Cube_cell723.geometry}
            material={materials.CUBE}
            position={[18.93, 6.41, 13.42]}
            rotation={[-0.41, 0.09, -2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell724"
            geometry={nodes.Cube_cell724.geometry}
            material={materials.CUBE}
            position={[0.2, 4.86, -11.36]}
            rotation={[-2.54, -0.18, 2.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell725"
            geometry={nodes.Cube_cell725.geometry}
            material={materials.CUBE}
            position={[38.4, 23.68, 44.9]}
            rotation={[-1.03, -0.44, -1.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell726"
            geometry={nodes.Cube_cell726.geometry}
            material={materials.CUBE}
            position={[-0.23, 23.41, 26.1]}
            rotation={[-2.23, 1.31, -1.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell727"
            geometry={nodes.Cube_cell727.geometry}
            material={materials.CUBE}
            position={[-18.78, 17.87, -26.08]}
            rotation={[0.22, 0.81, -0.19]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell728"
            geometry={nodes.Cube_cell728.geometry}
            material={materials.CUBE}
            position={[-0.58, -11.56, 14.99]}
            rotation={[0.08, 0.09, 0.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell729"
            geometry={nodes.Cube_cell729.geometry}
            material={materials.CUBE}
            position={[-0.3, 41.78, -31.49]}
            rotation={[-1.19, 0.15, 2.91]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell730"
            geometry={nodes.Cube_cell730.geometry}
            material={materials.CUBE}
            position={[-4.8, -23.89, 1.28]}
            rotation={[-3.14, -0.39, 0.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell731"
            geometry={nodes.Cube_cell731.geometry}
            material={materials.CUBE}
            position={[-9.27, 19.63, 4.14]}
            rotation={[2, -1.31, 2.45]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell732"
            geometry={nodes.Cube_cell732.geometry}
            material={materials.CUBE}
            position={[-17.76, -14.84, 10.6]}
            rotation={[1.12, -0.52, 0.04]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell733"
            geometry={nodes.Cube_cell733.geometry}
            material={materials.CUBE}
            position={[-0.25, 12.97, 14.18]}
            rotation={[2.32, -0.89, -0.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell734"
            geometry={nodes.Cube_cell734.geometry}
            material={materials.CUBE}
            position={[0.24, 9.19, 44.1]}
            rotation={[-0.37, 0.48, 0.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell735"
            geometry={nodes.Cube_cell735.geometry}
            material={materials.CUBE}
            position={[5, -43.09, -13.18]}
            rotation={[-1.51, -0.23, -1.76]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell736"
            geometry={nodes.Cube_cell736.geometry}
            material={materials.CUBE}
            position={[18.02, -10.88, 21.42]}
            rotation={[0.04, -0.19, -0.21]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell737"
            geometry={nodes.Cube_cell737.geometry}
            material={materials.CUBE}
            position={[51.7, -22.91, -0.74]}
            rotation={[-0.83, -0.04, -1.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell738"
            geometry={nodes.Cube_cell738.geometry}
            material={materials.CUBE}
            position={[5.64, 2.12, 31.99]}
            rotation={[1.8, -0.53, 0.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell739"
            geometry={nodes.Cube_cell739.geometry}
            material={materials.CUBE}
            position={[-12.9, 22.2, 18.89]}
            rotation={[-0.32, 0.49, 0.87]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell740"
            geometry={nodes.Cube_cell740.geometry}
            material={materials.CUBE}
            position={[6.11, 13.08, 28.39]}
            rotation={[0, -0.37, -0.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell741"
            geometry={nodes.Cube_cell741.geometry}
            material={materials.CUBE}
            position={[-3.03, 4.61, 4.13]}
            rotation={[-2.05, -0.03, 1.72]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell742"
            geometry={nodes.Cube_cell742.geometry}
            material={materials.CUBE}
            position={[8.76, -23.12, 18.23]}
            rotation={[-2, -0.85, -2.32]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell743"
            geometry={nodes.Cube_cell743.geometry}
            material={materials.CUBE}
            position={[-7.08, 4.5, 24.93]}
            rotation={[-2.91, 1.56, 2.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell744"
            geometry={nodes.Cube_cell744.geometry}
            material={materials.CUBE}
            position={[12.45, 0.97, 17.7]}
            rotation={[0.17, 0.03, 2.21]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell745"
            geometry={nodes.Cube_cell745.geometry}
            material={materials.CUBE}
            position={[-0.37, -47.34, -14.02]}
            rotation={[3, 0.93, 1.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell746"
            geometry={nodes.Cube_cell746.geometry}
            material={materials.CUBE}
            position={[-3.3, 10.33, 50.54]}
            rotation={[-0.43, -0.23, -1.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell747"
            geometry={nodes.Cube_cell747.geometry}
            material={materials.CUBE}
            position={[4.66, 24.05, 5.56]}
            rotation={[0.32, -0.91, -3.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell748"
            geometry={nodes.Cube_cell748.geometry}
            material={materials.CUBE}
            position={[-26.6, 3.23, 13.57]}
            rotation={[-2.47, -0.11, 3.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell749"
            geometry={nodes.Cube_cell749.geometry}
            material={materials.CUBE}
            position={[7.12, 0.53, -1.21]}
            rotation={[0.69, 0, -2.29]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell750"
            geometry={nodes.Cube_cell750.geometry}
            material={materials.CUBE}
            position={[-4.22, -25.97, -28.39]}
            rotation={[-2.73, -0.22, 3.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell751"
            geometry={nodes.Cube_cell751.geometry}
            material={materials.CUBE}
            position={[3.1, -13.34, 4.95]}
            rotation={[-1.26, -0.29, 0.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell752"
            geometry={nodes.Cube_cell752.geometry}
            material={materials.CUBE}
            position={[-15.74, -0.96, 19.09]}
            rotation={[0.4, -0.98, -2.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell753"
            geometry={nodes.Cube_cell753.geometry}
            material={materials.CUBE}
            position={[-6.02, 34.7, 37.6]}
            rotation={[0.31, 0.54, -0.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell754"
            geometry={nodes.Cube_cell754.geometry}
            material={materials.CUBE}
            position={[-8.84, -16.35, 22.11]}
            rotation={[1.45, -0.09, -3.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell755"
            geometry={nodes.Cube_cell755.geometry}
            material={materials.CUBE}
            position={[17.54, -17.03, 20.42]}
            rotation={[1.02, -0.09, -1.68]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell756"
            geometry={nodes.Cube_cell756.geometry}
            material={materials.CUBE}
            position={[0.45, -31.22, 17.09]}
            rotation={[-1.6, -1, -1.5]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell757"
            geometry={nodes.Cube_cell757.geometry}
            material={materials.CUBE}
            position={[9.05, 21.97, 21.62]}
            rotation={[0.89, 1.29, 1.38]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell758"
            geometry={nodes.Cube_cell758.geometry}
            material={materials.CUBE}
            position={[-27.31, -16.29, -25.8]}
            rotation={[1.99, 0.33, -2.61]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell759"
            geometry={nodes.Cube_cell759.geometry}
            material={materials.CUBE}
            position={[-1.23, 52.16, -26.91]}
            rotation={[-1.59, 1.2, 1.17]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell760"
            geometry={nodes.Cube_cell760.geometry}
            material={materials.CUBE}
            position={[-2.02, 13.64, 5.92]}
            rotation={[-0.94, 0.45, 1.93]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell761"
            geometry={nodes.Cube_cell761.geometry}
            material={materials.CUBE}
            position={[-5.66, 27.1, -34.3]}
            rotation={[-3.11, 0.3, -2.42]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell762"
            geometry={nodes.Cube_cell762.geometry}
            material={materials.CUBE}
            position={[-0.81, 3.66, 15.92]}
            rotation={[1.41, 0.08, 1.93]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell763"
            geometry={nodes.Cube_cell763.geometry}
            material={materials.CUBE}
            position={[18.58, 12.31, -33.99]}
            rotation={[-0.27, 0.5, 0.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell764"
            geometry={nodes.Cube_cell764.geometry}
            material={materials.CUBE}
            position={[1.78, 22.73, -0.37]}
            rotation={[1.84, 0.08, 0.23]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell765"
            geometry={nodes.Cube_cell765.geometry}
            material={materials.CUBE}
            position={[-12.38, -2.09, 8.91]}
            rotation={[0.7, -0.09, 0.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell766"
            geometry={nodes.Cube_cell766.geometry}
            material={materials.CUBE}
            position={[-36.32, 10.53, 1.8]}
            rotation={[-0.54, -0.14, 0.93]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell767"
            geometry={nodes.Cube_cell767.geometry}
            material={materials.CUBE}
            position={[-1.6, -13.16, -35.75]}
            rotation={[0.75, 0.42, -0.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell768"
            geometry={nodes.Cube_cell768.geometry}
            material={materials.CUBE}
            position={[10.85, 5.07, 48.49]}
            rotation={[0.17, -0.84, -1.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell769"
            geometry={nodes.Cube_cell769.geometry}
            material={materials.CUBE}
            position={[0.23, 27.78, -7.48]}
            rotation={[-1.04, 0.88, -0.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell770"
            geometry={nodes.Cube_cell770.geometry}
            material={materials.CUBE}
            position={[-7.31, -2.79, -7.18]}
            rotation={[1.96, 0.28, 1.31]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell771"
            geometry={nodes.Cube_cell771.geometry}
            material={materials.CUBE}
            position={[3.51, 31.98, 16.78]}
            rotation={[0.4, -0.46, 0.93]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell772"
            geometry={nodes.Cube_cell772.geometry}
            material={materials.CUBE}
            position={[2.83, -4.45, 12.53]}
            rotation={[-0.49, -0.22, 2.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell773"
            geometry={nodes.Cube_cell773.geometry}
            material={materials.CUBE}
            position={[26.76, -5.3, -0.36]}
            rotation={[-0.36, 0.6, 0.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell774"
            geometry={nodes.Cube_cell774.geometry}
            material={materials.CUBE}
            position={[49.55, -18.3, 7.95]}
            rotation={[0.94, 0.24, 0.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell775"
            geometry={nodes.Cube_cell775.geometry}
            material={materials.CUBE}
            position={[13.41, -8.47, 11.9]}
            rotation={[-0.68, -0.14, 0.74]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell776"
            geometry={nodes.Cube_cell776.geometry}
            material={materials.CUBE}
            position={[16.71, -23.43, -29.53]}
            rotation={[1.33, -0.89, 1.34]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell777"
            geometry={nodes.Cube_cell777.geometry}
            material={materials.CUBE}
            position={[5.19, -36.38, -16.21]}
            rotation={[0.72, 0.05, -1.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell778"
            geometry={nodes.Cube_cell778.geometry}
            material={materials.CUBE}
            position={[-16.42, 2.8, 36.48]}
            rotation={[-3.14, 0.84, 1.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell779"
            geometry={nodes.Cube_cell779.geometry}
            material={materials.CUBE}
            position={[11.65, -12.71, 28.08]}
            rotation={[2.76, -0.37, 2.83]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell780"
            geometry={nodes.Cube_cell780.geometry}
            material={materials.CUBE}
            position={[0.74, 19.29, -51.05]}
            rotation={[-2.71, -1.2, 0.19]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell781"
            geometry={nodes.Cube_cell781.geometry}
            material={materials.CUBE}
            position={[22.15, -24.13, -8.01]}
            rotation={[0.09, 0.19, 2.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell782"
            geometry={nodes.Cube_cell782.geometry}
            material={materials.CUBE}
            position={[-1.36, 12.38, 24.45]}
            rotation={[-0.34, -0.6, -0.43]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell783"
            geometry={nodes.Cube_cell783.geometry}
            material={materials.CUBE}
            position={[4.83, -6.88, -40.38]}
            rotation={[-0.8, -0.13, -1.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell784"
            geometry={nodes.Cube_cell784.geometry}
            material={materials.CUBE}
            position={[-19.48, -12, 0.85]}
            rotation={[-1.36, -0.18, 2.65]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell785"
            geometry={nodes.Cube_cell785.geometry}
            material={materials.CUBE}
            position={[-9.08, 7.62, 28.08]}
            rotation={[1.61, -1.12, -0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell786"
            geometry={nodes.Cube_cell786.geometry}
            material={materials.CUBE}
            position={[-1.23, 10.24, 14.16]}
            rotation={[-2.5, 1.39, -2.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell787"
            geometry={nodes.Cube_cell787.geometry}
            material={materials.CUBE}
            position={[4.46, -21, -20.83]}
            rotation={[2.28, 1.03, -0.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell788"
            geometry={nodes.Cube_cell788.geometry}
            material={materials.CUBE}
            position={[-5.36, 12.64, -29.73]}
            rotation={[-0.61, 1.35, 0.97]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell789"
            geometry={nodes.Cube_cell789.geometry}
            material={materials.CUBE}
            position={[-12.99, -2.33, -41.51]}
            rotation={[0.2, 1.4, -0.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell790"
            geometry={nodes.Cube_cell790.geometry}
            material={materials.CUBE}
            position={[0.59, 40.07, -20.46]}
            rotation={[-1.7, -0.71, -0.92]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell791"
            geometry={nodes.Cube_cell791.geometry}
            material={materials.CUBE}
            position={[0.46, 41.75, -16.25]}
            rotation={[3, -0.86, 2.46]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell792"
            geometry={nodes.Cube_cell792.geometry}
            material={materials.CUBE}
            position={[-4.29, -19.97, -14.78]}
            rotation={[0.61, -0.63, 1.28]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell793"
            geometry={nodes.Cube_cell793.geometry}
            material={materials.CUBE}
            position={[-2.74, 13.16, 32.56]}
            rotation={[-0.3, -0.44, 0.17]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell794"
            geometry={nodes.Cube_cell794.geometry}
            material={materials.CUBE}
            position={[-2.91, -27.58, -37.24]}
            rotation={[2.44, 1.2, -1.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell795"
            geometry={nodes.Cube_cell795.geometry}
            material={materials.CUBE}
            position={[-6.75, 7.13, 15.56]}
            rotation={[-3.09, 1.26, 1.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell796"
            geometry={nodes.Cube_cell796.geometry}
            material={materials.CUBE}
            position={[-5.93, -18.95, -7.46]}
            rotation={[-0.06, 0.09, 2.74]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell797"
            geometry={nodes.Cube_cell797.geometry}
            material={materials.CUBE}
            position={[12.83, 3.56, 2.8]}
            rotation={[-0.8, 1.06, 0.51]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell798"
            geometry={nodes.Cube_cell798.geometry}
            material={materials.CUBE}
            position={[-11.92, 0.27, 30.91]}
            rotation={[0.08, 1.17, 1.81]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell799"
            geometry={nodes.Cube_cell799.geometry}
            material={materials.CUBE}
            position={[-7.36, 19.38, 47.89]}
            rotation={[2.99, -0.37, -1.21]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell800"
            geometry={nodes.Cube_cell800.geometry}
            material={materials.CUBE}
            position={[-2.95, -33.88, 8.29]}
            rotation={[1.21, 0.34, -2.43]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell801"
            geometry={nodes.Cube_cell801.geometry}
            material={materials.CUBE}
            position={[3.51, -38.6, -8.56]}
            rotation={[0.88, -0.6, 1.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell802"
            geometry={nodes.Cube_cell802.geometry}
            material={materials.CUBE}
            position={[-3.11, 52.93, 21.26]}
            rotation={[1.71, -0.33, 0.84]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell803"
            geometry={nodes.Cube_cell803.geometry}
            material={materials.CUBE}
            position={[-8.8, -17.54, 15.93]}
            rotation={[2.55, -0.26, 3.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell804"
            geometry={nodes.Cube_cell804.geometry}
            material={materials.CUBE}
            position={[5.3, -27.85, -16.33]}
            rotation={[1, -0.27, 0.43]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell805"
            geometry={nodes.Cube_cell805.geometry}
            material={materials.CUBE}
            position={[-4.46, 13.41, -37.73]}
            rotation={[-3.13, 0.5, 2.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell806"
            geometry={nodes.Cube_cell806.geometry}
            material={materials.CUBE}
            position={[-12.75, 33.8, 7.32]}
            rotation={[-0.25, -1.07, -1.28]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell807"
            geometry={nodes.Cube_cell807.geometry}
            material={materials.CUBE}
            position={[2.12, 22.68, 41.56]}
            rotation={[2.54, 0.28, 0.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell808"
            geometry={nodes.Cube_cell808.geometry}
            material={materials.CUBE}
            position={[34.93, -18.97, -38.23]}
            rotation={[-2.55, -0.01, 0.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell809"
            geometry={nodes.Cube_cell809.geometry}
            material={materials.CUBE}
            position={[-1.72, -29.23, 21.83]}
            rotation={[-0.26, 0.46, -2.85]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell810"
            geometry={nodes.Cube_cell810.geometry}
            material={materials.CUBE}
            position={[-0.64, -6.18, 35.3]}
            rotation={[-2.12, 0.98, 0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell811"
            geometry={nodes.Cube_cell811.geometry}
            material={materials.CUBE}
            position={[22.04, -28.13, -8.42]}
            rotation={[1.99, -0.49, 0.17]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell812"
            geometry={nodes.Cube_cell812.geometry}
            material={materials.CUBE}
            position={[-11.81, -1.87, 12.55]}
            rotation={[1.63, -1.3, 2.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell813"
            geometry={nodes.Cube_cell813.geometry}
            material={materials.CUBE}
            position={[-6.99, 24.71, -25.22]}
            rotation={[-0.62, 0.4, 0.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell814"
            geometry={nodes.Cube_cell814.geometry}
            material={materials.CUBE}
            position={[-14.76, 1.94, 26.33]}
            rotation={[-0.24, 0.12, 1.87]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell815"
            geometry={nodes.Cube_cell815.geometry}
            material={materials.CUBE}
            position={[3.77, 44.92, 4.61]}
            rotation={[-0.16, 0.01, -0.75]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell816"
            geometry={nodes.Cube_cell816.geometry}
            material={materials.CUBE}
            position={[-1.62, 11.03, -20.47]}
            rotation={[-0.26, -0.94, -0.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell817"
            geometry={nodes.Cube_cell817.geometry}
            material={materials.CUBE}
            position={[5.86, 44.52, 33.28]}
            rotation={[1.22, 0.34, -0.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell818"
            geometry={nodes.Cube_cell818.geometry}
            material={materials.CUBE}
            position={[4.73, 60.07, 35.26]}
            rotation={[-2.12, -0.2, 2.88]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell819"
            geometry={nodes.Cube_cell819.geometry}
            material={materials.CUBE}
            position={[31.82, 3.12, 17.96]}
            rotation={[-0.71, 0.35, -0.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell820"
            geometry={nodes.Cube_cell820.geometry}
            material={materials.CUBE}
            position={[3.72, 18.78, 0.78]}
            rotation={[1.64, -0.72, 0.36]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell821"
            geometry={nodes.Cube_cell821.geometry}
            material={materials.CUBE}
            position={[-44.42, -3.34, -19.41]}
            rotation={[0.04, -0.79, -1.25]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell822"
            geometry={nodes.Cube_cell822.geometry}
            material={materials.CUBE}
            position={[-3.21, -23.26, -19.56]}
            rotation={[-0.33, -0.76, -0.55]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell823"
            geometry={nodes.Cube_cell823.geometry}
            material={materials.CUBE}
            position={[0.17, -25.61, 35.4]}
            rotation={[0.15, 0.46, -3.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell824"
            geometry={nodes.Cube_cell824.geometry}
            material={materials.CUBE}
            position={[7.12, 14.63, -28.93]}
            rotation={[1.82, 0.22, -1.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell825"
            geometry={nodes.Cube_cell825.geometry}
            material={materials.CUBE}
            position={[-10.78, 29, -22.91]}
            rotation={[-0.91, 0.18, 0.7]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell826"
            geometry={nodes.Cube_cell826.geometry}
            material={materials.CUBE}
            position={[-1.49, 9.49, -13.99]}
            rotation={[-0.89, 0.79, 2.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell827"
            geometry={nodes.Cube_cell827.geometry}
            material={materials.CUBE}
            position={[-11.17, -16.75, 6.88]}
            rotation={[0.66, 0.08, -0.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell828"
            geometry={nodes.Cube_cell828.geometry}
            material={materials.CUBE}
            position={[16.98, -6.69, 36.5]}
            rotation={[2.97, -0.23, 0.41]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell829"
            geometry={nodes.Cube_cell829.geometry}
            material={materials.CUBE}
            position={[5.18, -3.76, -34.57]}
            rotation={[0.92, -1.23, 0.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell830"
            geometry={nodes.Cube_cell830.geometry}
            material={materials.CUBE}
            position={[14.63, 21.26, -31.66]}
            rotation={[-0.81, 0.46, 0.94]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell831"
            geometry={nodes.Cube_cell831.geometry}
            material={materials.CUBE}
            position={[-5.51, -14.51, 5.52]}
            rotation={[0.03, -0.1, -1.54]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell832"
            geometry={nodes.Cube_cell832.geometry}
            material={materials.CUBE}
            position={[18.44, -28.25, -21.1]}
            rotation={[0.53, 0.55, -0.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell833"
            geometry={nodes.Cube_cell833.geometry}
            material={materials.CUBE}
            position={[-1.14, -12.91, -2.43]}
            rotation={[-1.16, -0.22, 0.26]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell834"
            geometry={nodes.Cube_cell834.geometry}
            material={materials.CUBE}
            position={[-2.11, -7.28, 33.61]}
            rotation={[0.8, 0.57, -0.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell835"
            geometry={nodes.Cube_cell835.geometry}
            material={materials.CUBE}
            position={[9.07, -14.57, 47.45]}
            rotation={[-0.13, -0.63, 0.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell836"
            geometry={nodes.Cube_cell836.geometry}
            material={materials.CUBE}
            position={[8.5, 30.66, -29.21]}
            rotation={[0.01, 0.2, -0.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell837"
            geometry={nodes.Cube_cell837.geometry}
            material={materials.CUBE}
            position={[-0.8, 39.33, 21.01]}
            rotation={[3.07, -0.08, -2.18]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell838"
            geometry={nodes.Cube_cell838.geometry}
            material={materials.CUBE}
            position={[4.07, -14.82, 7.34]}
            rotation={[-0.8, -0.38, 0.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell839"
            geometry={nodes.Cube_cell839.geometry}
            material={materials.CUBE}
            position={[-3.98, -17.33, -13.86]}
            rotation={[1.38, 1.07, -0.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell840"
            geometry={nodes.Cube_cell840.geometry}
            material={materials.CUBE}
            position={[-22.36, -7.81, -23.82]}
            rotation={[1.17, -0.45, 2.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell841"
            geometry={nodes.Cube_cell841.geometry}
            material={materials.CUBE}
            position={[-2.71, 12.22, -11.01]}
            rotation={[0.92, -0.95, -3.13]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell842"
            geometry={nodes.Cube_cell842.geometry}
            material={materials.CUBE}
            position={[-26.71, 14.8, 25.53]}
            rotation={[-0.2, 0.84, 0.62]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell843"
            geometry={nodes.Cube_cell843.geometry}
            material={materials.CUBE}
            position={[8.28, 21.91, -11.78]}
            rotation={[1.34, -0.57, 0.69]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell844"
            geometry={nodes.Cube_cell844.geometry}
            material={materials.CUBE}
            position={[-4.39, 30.67, -36.49]}
            rotation={[1.47, 0.36, -0.78]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell845"
            geometry={nodes.Cube_cell845.geometry}
            material={materials.CUBE}
            position={[-8.73, -47.58, -0.53]}
            rotation={[-2.84, -0.98, -2.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell846"
            geometry={nodes.Cube_cell846.geometry}
            material={materials.CUBE}
            position={[9.25, 4.41, 53.99]}
            rotation={[0.23, 1.17, -0.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell847"
            geometry={nodes.Cube_cell847.geometry}
            material={materials.CUBE}
            position={[37.51, -20.21, -16.49]}
            rotation={[-2.93, -0.51, -2.71]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell848"
            geometry={nodes.Cube_cell848.geometry}
            material={materials.CUBE}
            position={[7.65, 13.05, -35]}
            rotation={[-0.28, 0.27, -0.8]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell849"
            geometry={nodes.Cube_cell849.geometry}
            material={materials.CUBE}
            position={[1.23, 34.97, -7.38]}
            rotation={[-1.92, -0.21, 1.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell850"
            geometry={nodes.Cube_cell850.geometry}
            material={materials.CUBE}
            position={[-9.73, 3.92, -35.48]}
            rotation={[0.86, -0.5, -1.03]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell851"
            geometry={nodes.Cube_cell851.geometry}
            material={materials.CUBE}
            position={[45.17, -7.36, -21.3]}
            rotation={[0.74, -0.73, 1.12]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell852"
            geometry={nodes.Cube_cell852.geometry}
            material={materials.CUBE}
            position={[0.45, 35.27, -46.45]}
            rotation={[-0.53, -0.15, -0.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell853"
            geometry={nodes.Cube_cell853.geometry}
            material={materials.CUBE}
            position={[4.32, -2.68, 29.97]}
            rotation={[-1.12, 1, 2.74]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell854"
            geometry={nodes.Cube_cell854.geometry}
            material={materials.CUBE}
            position={[5.35, 56.07, 42.35]}
            rotation={[0.4, -0.38, 1.11]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell855"
            geometry={nodes.Cube_cell855.geometry}
            material={materials.CUBE}
            position={[11.64, 15.37, -27.57]}
            rotation={[0.28, -0.48, 0.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell856"
            geometry={nodes.Cube_cell856.geometry}
            material={materials.CUBE}
            position={[-1.92, 36.14, 29.13]}
            rotation={[-1.36, 0.58, 2.06]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell857"
            geometry={nodes.Cube_cell857.geometry}
            material={materials.CUBE}
            position={[6.1, -9.55, -26.54]}
            rotation={[1.34, 0.49, -1.96]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell858"
            geometry={nodes.Cube_cell858.geometry}
            material={materials.CUBE}
            position={[7.92, 9.94, -0.59]}
            rotation={[-2.08, -0.07, 1.22]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell859"
            geometry={nodes.Cube_cell859.geometry}
            material={materials.CUBE}
            position={[-5.21, 9.11, 9.57]}
            rotation={[0.15, -0.82, 1.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell860"
            geometry={nodes.Cube_cell860.geometry}
            material={materials.CUBE}
            position={[11.45, 5.53, -48.61]}
            rotation={[-0.26, 0.3, -1.07]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell861"
            geometry={nodes.Cube_cell861.geometry}
            material={materials.CUBE}
            position={[-16.51, -36.58, 19.09]}
            rotation={[-1.3, 0.11, -0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell862"
            geometry={nodes.Cube_cell862.geometry}
            material={materials.CUBE}
            position={[-33.24, -1.09, 3.8]}
            rotation={[-0.74, 0.09, 2.95]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell863"
            geometry={nodes.Cube_cell863.geometry}
            material={materials.CUBE}
            position={[0.31, 32.16, 7.47]}
            rotation={[-0.01, -0.39, -2.02]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell864"
            geometry={nodes.Cube_cell864.geometry}
            material={materials.CUBE}
            position={[23.8, 6.42, 1.2]}
            rotation={[2.99, 0.82, -2.56]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell865"
            geometry={nodes.Cube_cell865.geometry}
            material={materials.CUBE}
            position={[-3.41, -7.17, -40.54]}
            rotation={[1.59, 0.29, 0.66]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell866"
            geometry={nodes.Cube_cell866.geometry}
            material={materials.CUBE}
            position={[10.84, -20.69, 2.18]}
            rotation={[-2.41, 0.33, 0.64]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell867"
            geometry={nodes.Cube_cell867.geometry}
            material={materials.CUBE}
            position={[-3.49, 6.74, 7.25]}
            rotation={[-1.82, -0.52, 2.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell868"
            geometry={nodes.Cube_cell868.geometry}
            material={materials.CUBE}
            position={[-10.13, -3.84, 26.33]}
            rotation={[0.63, -0.32, -0.15]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell869"
            geometry={nodes.Cube_cell869.geometry}
            material={materials.CUBE}
            position={[19.93, -25.16, 0.57]}
            rotation={[2.45, 0.83, -1.19]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell870"
            geometry={nodes.Cube_cell870.geometry}
            material={materials.CUBE}
            position={[-5.52, 30.02, 42.74]}
            rotation={[1.16, -0.96, 3.14]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell871"
            geometry={nodes.Cube_cell871.geometry}
            material={materials.CUBE}
            position={[-0.85, -57.71, 35.75]}
            rotation={[2.89, -0.13, 0.86]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell872"
            geometry={nodes.Cube_cell872.geometry}
            material={materials.CUBE}
            position={[-21.54, 26.73, 29.73]}
            rotation={[0.94, 0.2, -1.47]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell873"
            geometry={nodes.Cube_cell873.geometry}
            material={materials.CUBE}
            position={[10.76, 32.79, -13.93]}
            rotation={[-2.73, 0.48, 1.9]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell874"
            geometry={nodes.Cube_cell874.geometry}
            material={materials.CUBE}
            position={[-40.57, -10.07, 4.45]}
            rotation={[1.02, 0.12, 0.29]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell875"
            geometry={nodes.Cube_cell875.geometry}
            material={materials.CUBE}
            position={[26.55, -12.19, -19.32]}
            rotation={[3.01, -0.2, -0.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell876"
            geometry={nodes.Cube_cell876.geometry}
            material={materials.CUBE}
            position={[1.54, -30.75, -22.54]}
            rotation={[-0.51, -0.28, -0.57]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell877"
            geometry={nodes.Cube_cell877.geometry}
            material={materials.CUBE}
            position={[15.59, 9.33, -16.4]}
            rotation={[1.77, -0.08, -0.01]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell878"
            geometry={nodes.Cube_cell878.geometry}
            material={materials.CUBE}
            position={[0.58, 12.78, -9.71]}
            rotation={[0.42, 0.18, 0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell879"
            geometry={nodes.Cube_cell879.geometry}
            material={materials.CUBE}
            position={[-12.68, -23.5, 25.72]}
            rotation={[-2.07, 0.85, 1.2]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell880"
            geometry={nodes.Cube_cell880.geometry}
            material={materials.CUBE}
            position={[-12.55, 22.15, 31.96]}
            rotation={[-2.01, 0.98, 1.33]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell881"
            geometry={nodes.Cube_cell881.geometry}
            material={materials.CUBE}
            position={[-23.1, 22.09, -8.08]}
            rotation={[-2.29, -0.55, -2.52]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell882"
            geometry={nodes.Cube_cell882.geometry}
            material={materials.CUBE}
            position={[-4.03, -15.55, -26.64]}
            rotation={[2.88, -0.97, 0.24]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell883"
            geometry={nodes.Cube_cell883.geometry}
            material={materials.CUBE}
            position={[13.62, -44.83, 15.75]}
            rotation={[1.68, 0.21, 0.09]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell884"
            geometry={nodes.Cube_cell884.geometry}
            material={materials.CUBE}
            position={[-1.79, 23.28, -36.41]}
            rotation={[0.38, 0.41, -0.27]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell885"
            geometry={nodes.Cube_cell885.geometry}
            material={materials.CUBE}
            position={[-27.9, 7.22, -44.23]}
            rotation={[-0.35, -1, -1.1]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell886"
            geometry={nodes.Cube_cell886.geometry}
            material={materials.CUBE}
            position={[-30.99, 1.44, 31.59]}
            rotation={[-0.46, -0.56, 3.05]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell887"
            geometry={nodes.Cube_cell887.geometry}
            material={materials.CUBE}
            position={[1.21, -30.09, -22.28]}
            rotation={[0.02, -0.22, -0.16]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell888"
            geometry={nodes.Cube_cell888.geometry}
            material={materials.CUBE}
            position={[-28.5, 25.66, 2.45]}
            rotation={[-1.36, -0.1, -1.82]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell889"
            geometry={nodes.Cube_cell889.geometry}
            material={materials.CUBE}
            position={[3.26, 20.21, 38.76]}
            rotation={[0.6, 0.06, -0.87]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell890"
            geometry={nodes.Cube_cell890.geometry}
            material={materials.CUBE}
            position={[-26.53, 21.61, 24.41]}
            rotation={[2.69, -0.2, 3.08]}
            scale={0.21}
          />
          <mesh
            name="Cube_cell891"
            geometry={nodes.Cube_cell891.geometry}
            material={materials.CUBE}
            position={[10.1, -16.25, 29.53]}
            rotation={[2.37, -0.96, 2.15]}
            scale={0.21}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Explode_Cube1.glb");
