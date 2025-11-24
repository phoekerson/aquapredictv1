'use client';

import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, OrbitControls, Text3D } from '@/components/r3f/R3FElements';

export function MicrobialReservoir3D() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.01);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const zones = [
    { pos: [-2, -1, 0] as [number, number, number], size: 1.5, level: 0.8 },
    { pos: [2, -0.5, -1] as [number, number, number], size: 1.2, level: 0.6 },
    { pos: [0, -1.5, 1.5] as [number, number, number], size: 1.0, level: 0.7 },
    { pos: [-1, 0.5, -2] as [number, number, number], size: 0.8, level: 0.5 },
  ];

  return (
    <Canvas
      camera={{ position: [5, 3, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#0066ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff0066" />

      {/* Water volume representation */}
      <mesh>
        <boxGeometry args={[8, 4, 8]} />
        <meshStandardMaterial
          color={new THREE.Color(0.1, 0.3, 0.6)}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Contamination zones */}
      {zones.map((zone, idx) => (
        <mesh key={idx} position={zone.pos}>
          <sphereGeometry args={[zone.size, 32, 32]} />
          <meshStandardMaterial
            color={new THREE.Color(1, 0.1, 0.1)}
            emissive={new THREE.Color(1, 0, 0)}
            emissiveIntensity={zone.level + Math.sin(time + idx) * 0.1}
            transparent
            opacity={0.2 + (zone.level + Math.sin(time + idx) * 0.1) * 0.4}
            wireframe={zone.level > 0.7}
          />
        </mesh>
      ))}

      {/* Microbial particles */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 2 + Math.sin(time + i) * 0.5;
        const y = Math.sin(time * 2 + i) * 1.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              y - 1,
              Math.sin(angle) * radius,
            ]}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial
              color={new THREE.Color(0.8, 0.2, 0.8)}
              emissive={new THREE.Color(0.5, 0, 0.5)}
              emissiveIntensity={0.3 + Math.sin(time + i) * 0.2}
              transparent
              opacity={0.3 + (0.3 + Math.sin(time + i) * 0.2) * 0.5}
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        );
      })}

      <Text3D
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        Microbial Reservoir
      </Text3D>

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

