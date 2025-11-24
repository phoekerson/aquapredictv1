'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, OrbitControls, Text3D } from '@/components/r3f/R3FElements';

interface Drone {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  status: 'idle' | 'flying' | 'scanning' | 'returning';
  battery: number;
  mission: string;
}

interface DroneScene3DProps {
  drones: Drone[];
  time: number;
}

export function DroneScene3D({ drones, time }: DroneScene3DProps) {
  const sceneDrones = useMemo(() => drones, [drones]);

  return (
    <Canvas
      camera={{ position: [8, 8, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <DroneSceneContent
        drones={sceneDrones}
        time={time}
        THREE={THREE}
        Text={Text3D}
        OrbitControls={OrbitControls}
      />
    </Canvas>
  );
}

function DroneSceneContent({
  drones,
  time,
}: {
  drones: Drone[];
  time: number;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#0066ff" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Grid */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`h-${i}`} points={[
          new THREE.Vector3(-10, 0.01, -10 + i),
          new THREE.Vector3(10, 0.01, -10 + i)
        ]}>
          <lineBasicMaterial color="#333366" />
        </line>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`v-${i}`} points={[
          new THREE.Vector3(-10 + i, 0.01, -10),
          new THREE.Vector3(-10 + i, 0.01, 10)
        ]}>
          <lineBasicMaterial color="#333366" />
        </line>
      ))}

      {/* Drones */}
      {drones.map((drone, idx) => {
        const rotation = time * 0.5 + idx;
        const getColor = () => {
          switch (drone.status) {
            case 'flying': return '#00ff00';
            case 'scanning': return '#ffff00';
            case 'returning': return '#ff6600';
            default: return '#666666';
          }
        };

        return (
          <group key={drone.id}>
            {/* Drone body */}
            <mesh position={drone.position}>
              <boxGeometry args={[0.3, 0.1, 0.3]} />
              <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={0.5} />
            </mesh>
            {/* Propellers */}
            {[
              [-0.2, 0.1, -0.2],
              [0.2, 0.1, -0.2],
              [-0.2, 0.1, 0.2],
              [0.2, 0.1, 0.2]
            ].map((pos, i) => (
              <mesh key={i} position={[
                drone.position[0] + pos[0],
                drone.position[1] + pos[1],
                drone.position[2] + pos[2]
              ]}>
                <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} />
                <meshStandardMaterial color="#cccccc" />
              </mesh>
            ))}
            {/* Light */}
            <pointLight position={[drone.position[0], drone.position[1] - 0.2, drone.position[2]]} intensity={1} color={getColor()} distance={2} />
            
            {drone.status === 'scanning' && (
              <mesh position={[drone.position[0], 0.1, drone.position[2]]}>
                <cylinderGeometry args={[2, 2, 0.1, 32]} />
                <meshStandardMaterial
                  color="#00ffff"
                  transparent
                  opacity={0.2 + (0.5 + Math.sin(time * 2) * 0.3) * 0.3}
                  emissive="#00ffff"
                  emissiveIntensity={0.5 + Math.sin(time * 2) * 0.3}
                />
              </mesh>
            )}
            {/* Path line */}
            {drone.status === 'flying' && (
              <line points={[
                new THREE.Vector3(...drone.position),
                new THREE.Vector3(...drone.target)
              ]}>
                <lineBasicMaterial color="#00ff00" opacity={0.5} transparent />
              </line>
            )}
          </group>
        );
      })}

      <Text3D
        position={[0, 5, 0]}
        fontSize={0.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Drone Surveillance System
      </Text3D>

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}

