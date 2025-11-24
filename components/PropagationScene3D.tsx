'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, OrbitControls, Text3D } from '@/components/r3f/R3FElements';

interface PropagationScene3DProps {
  day: number;
  data: any[];
}

export function PropagationScene3D({ day, data }: PropagationScene3DProps) {
  const currentData = data.find(d => d.day === day) || data[0];
  const origin: [number, number, number] = [0, 0, 0];

  const affectedAreas = useMemo(() => currentData?.affectedAreas ?? [], [currentData]);

  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />

      {/* Origin point */}
      <mesh position={origin}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={new THREE.Color(1, 0.2, 0.2)}
          emissive={new THREE.Color(1, 0.1, 0.1)}
          emissiveIntensity={1}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Affected areas */}
      {affectedAreas.map((area: any, idx: number) => {
        const pos: [number, number, number] = [
          area.lng * 0.1,
          0,
          -area.lat * 0.1
        ];
        const points = [
          new THREE.Vector3(...origin),
          new THREE.Vector3(
            (origin[0] + pos[0]) / 2,
            origin[1] - 0.5,
            (origin[2] + pos[2]) / 2
          ),
          new THREE.Vector3(...pos)
        ];
        const curve = new THREE.CatmullRomCurve3(points);

        return (
          <group key={idx}>
            <mesh position={pos}>
              <sphereGeometry args={[area.radius * 0.1, 32, 32]} />
              <meshStandardMaterial
                color={new THREE.Color(1, 0.2, 0.2)}
                emissive={new THREE.Color(1, 0.1, 0.1)}
                emissiveIntensity={area.intensity}
                transparent
                opacity={0.6 + area.intensity * 0.4}
              />
            </mesh>
            {idx > 0 && (
              <mesh>
                <tubeGeometry args={[curve, 20, 0.05, 8, false]} />
                <meshStandardMaterial
                  color={new THREE.Color(0.2, 0.5, 1)}
                  emissive={new THREE.Color(0, 0.3, 0.8)}
                  emissiveIntensity={area.intensity}
                  transparent
                  opacity={0.4 + area.intensity * 0.3}
                />
              </mesh>
            )}
          </group>
        );
      })}

      <Text3D
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Day {day}
      </Text3D>

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

