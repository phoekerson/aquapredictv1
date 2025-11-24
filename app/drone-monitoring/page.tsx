'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Drone, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { DroneScene3D } from '@/components/DroneScene3D';

interface Drone {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  status: 'idle' | 'flying' | 'scanning' | 'returning';
  battery: number;
  mission: string;
}

export default function DroneMonitoringPage() {
  const [drones, setDrones] = useState<Drone[]>([
    {
      id: 'drone-1',
      position: [-3, 2, -3],
      target: [3, 2, 3],
      status: 'flying',
      battery: 85,
      mission: 'High-risk area scan'
    },
    {
      id: 'drone-2',
      position: [2, 1.5, -2],
      target: [2, 1.5, -2],
      status: 'scanning',
      battery: 72,
      mission: 'Pathogen detection'
    },
    {
      id: 'drone-3',
      position: [-2, 2.5, 2],
      target: [0, 0, 0],
      status: 'returning',
      battery: 45,
      mission: 'Completed survey'
    }
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t + 0.016);
        setDrones((prev) =>
          prev.map((drone) => {
            if (drone.status === 'flying') {
              // Move towards target
              const dx = drone.target[0] - drone.position[0];
              const dy = drone.target[1] - drone.position[1];
              const dz = drone.target[2] - drone.position[2];
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
              
              if (dist < 0.1) {
                return { ...drone, status: 'scanning' as const };
              }
              
              return {
                ...drone,
                position: [
                  drone.position[0] + dx * 0.02,
                  drone.position[1] + dy * 0.02,
                  drone.position[2] + dz * 0.02
                ],
                battery: Math.max(0, drone.battery - 0.01)
              };
            } else if (drone.status === 'scanning') {
              // Decrease battery while scanning
              if (drone.battery < 20) {
                return { ...drone, status: 'returning' as const, target: [0, 0, 0] };
              }
              return {
                ...drone,
                battery: Math.max(0, drone.battery - 0.02)
              };
            } else if (drone.status === 'returning') {
              // Return to base
              const dx = 0 - drone.position[0];
              const dy = 0 - drone.position[1];
              const dz = 0 - drone.position[2];
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
              
              if (dist < 0.1) {
                return { ...drone, status: 'idle' as const, battery: 100 };
              }
              
              return {
                ...drone,
                position: [
                  drone.position[0] + dx * 0.02,
                  drone.position[1] + dy * 0.02,
                  drone.position[2] + dz * 0.02
                ]
              };
            }
            return drone;
          })
        );
      }, 16);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleLaunch = () => {
    setDrones((prev) =>
      prev.map((drone) => {
        if (drone.status === 'idle') {
          return {
            ...drone,
            status: 'flying' as const,
            target: [
              (Math.random() - 0.5) * 6,
              2 + Math.random() * 2,
              (Math.random() - 0.5) * 6
            ] as [number, number, number],
            mission: 'New surveillance mission'
          };
        }
        return drone;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flying': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'scanning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'returning': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0d1235] to-[#0a0e27]">
        <div className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 150, 255, 0.1) 0%, transparent 50%)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">Drone Surveillance System</h1>
              <p className="text-gray-400">Real-time 3D monitoring of water quality using autonomous drones</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* 3D Scene */}
          <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
            <div className="h-[600px] bg-black/50 rounded-lg overflow-hidden">
              <DroneScene3D drones={drones} time={time} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-all flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleLaunch}
              className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 transition-all flex items-center gap-2"
            >
              <Drone className="w-5 h-5" />
              Launch Idle Drones
            </button>
            <button
              onClick={() => {
                setDrones([
                  {
                    id: 'drone-1',
                    position: [-3, 2, -3],
                    target: [3, 2, 3],
                    status: 'flying',
                    battery: 85,
                    mission: 'High-risk area scan'
                  },
                  {
                    id: 'drone-2',
                    position: [2, 1.5, -2],
                    target: [2, 1.5, -2],
                    status: 'scanning',
                    battery: 72,
                    mission: 'Pathogen detection'
                  },
                  {
                    id: 'drone-3',
                    position: [-2, 2.5, 2],
                    target: [0, 0, 0],
                    status: 'returning',
                    battery: 45,
                    mission: 'Completed survey'
                  }
                ]);
                setTime(0);
              }}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg text-gray-300 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Drone Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drones.map((drone) => (
              <div
                key={drone.id}
                className={`p-4 rounded-lg border ${getStatusColor(drone.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Drone className="w-5 h-5" />
                    <span className="font-semibold">{drone.id.toUpperCase()}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-black/30 capitalize">
                    {drone.status}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-2">{drone.mission}</div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Battery</span>
                    <span className={drone.battery < 30 ? 'text-red-400' : 'text-green-400'}>
                      {Math.round(drone.battery)}%
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        drone.battery < 30 ? 'bg-red-500' :
                        drone.battery < 50 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${drone.battery}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Position: ({drone.position[0].toFixed(1)}, {drone.position[1].toFixed(1)}, {drone.position[2].toFixed(1)})
                </div>
              </div>
            ))}
          </div>

          {/* Auto-launch Info */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-300">
                <div className="font-semibold mb-1">Automatic Drone Deployment</div>
                <div className="text-yellow-400/80">
                  Drones are automatically launched when risk levels exceed 75% or anomalies are detected.
                  They perform autonomous surveillance, sample collection, and real-time data transmission.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

