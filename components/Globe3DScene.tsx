'use client';

import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, OrbitControls, Text3D } from '@/components/r3f/R3FElements';

interface Sensor {
  id: number;
  name: string;
  lat: number;
  lng: number;
  value: number;
  status: 'normal' | 'warning' | 'alert';
  type: string;
}

// Sensor locations from GlobalMap
const SENSORS: Sensor[] = [
  { id: 1, name: 'Dakar - Fleuve Sénégal', lat: 14.7167, lng: -17.4677, value: 324, status: 'normal', type: 'Fleuve' },
  { id: 2, name: 'Lagos - Niger Delta', lat: 6.5244, lng: 3.3792, value: 418, status: 'warning', type: 'Barrage' },
  { id: 3, name: 'Kinshasa - Congo', lat: -4.3276, lng: 15.3136, value: 356, status: 'normal', type: 'Fleuve' },
  { id: 4, name: 'Nairobi - Lac Victoria', lat: -1.2864, lng: 36.8172, value: 395, status: 'normal', type: 'Barrage' },
  { id: 5, name: 'Le Caire - Nil', lat: 30.0444, lng: 31.2357, value: 379, status: 'alert', type: 'Fleuve' },
  { id: 6, name: 'Addis-Abeba - Nil Bleu', lat: 9.0320, lng: 38.7469, value: 364, status: 'normal', type: 'Barrage' },
  { id: 7, name: 'Johannesburg - Vaal', lat: -26.2041, lng: 28.0473, value: 330, status: 'normal', type: 'Barrage' },
  { id: 8, name: 'Abidjan - Comoé', lat: 5.3600, lng: -4.0083, value: 349, status: 'warning', type: 'Fleuve' },
];

export function Globe3DScene() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => r + 0.002);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Convert lat/lng to 3D coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number = 2) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alert': return new THREE.Color(1, 0, 0);
      case 'warning': return new THREE.Color(1, 0.5, 0);
      default: return new THREE.Color(0, 1, 1);
    }
  };

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#0066ff" />

      {/* Globe */}
      <mesh rotation={[0, rotation, 0]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color={new THREE.Color(0.1, 0.2, 0.4)}
          emissive={new THREE.Color(0.05, 0.1, 0.2)}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Globe wireframe overlay */}
      <mesh rotation={[0, rotation, 0]}>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(0.2, 0.4, 0.6)}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Sensor points */}
      {SENSORS.map((sensor) => {
        const position = latLngToVector3(sensor.lat, sensor.lng, 2.1);
        const color = getStatusColor(sensor.status);
        
        return (
          <group key={sensor.id} position={[position.x, position.y, position.z]}>
            {/* Sensor point */}
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1}
              />
            </mesh>
            
            {/* Pulse effect */}
            <mesh>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.3}
              />
            </mesh>

            {/* Connection line to globe */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    position.x, position.y, position.z,
                    position.x * 0.95, position.y * 0.95, position.z * 0.95
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={color} transparent opacity={0.5} />
            </line>
          </group>
        );
      })}

      {/* Title */}
      <Text3D
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Global Sensor Network
      </Text3D>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
      />
    </Canvas>
  );
}

