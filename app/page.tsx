'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { GlobalMap } from '@/components/GloablMap';
import { CityMap3D } from '@/components/CityMap3D';
import { StatsPanel } from '@/components/StatsPanel';
import { RealTimeCharts } from '@/components/RealTimeCharts';
import { SensorList } from '@/components/SensorList';
import { AlertsPanel } from '@/components/AlertsPanel';
import { AfricaMap } from '@/components/AfricaMap';
export default function Home() {
  const [activeView, setActiveView] = useState<'global' | 'africa' | 'city'>('global');

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
          {/* View Selector */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setActiveView('global')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeView === 'global'
                  ? 'bg-cyan-500/30 border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50'
              }`}
            >
              Vue Mondiale
            </button>
            <button
              onClick={() => setActiveView('africa')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeView === 'africa'
                  ? 'bg-cyan-500/30 border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50'
              }`}
            >
              Afrique & Barrages
            </button>
            <button
              onClick={() => setActiveView('city')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeView === 'city'
                  ? 'bg-cyan-500/30 border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50'
              }`}
            >
              Vue Quartier 3D
            </button>
          </div>

          {/* Stats Panel */}
          <StatsPanel />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Map View */}
            <div className="xl:col-span-2">
              {activeView === 'global' && <GlobalMap />}
              {activeView === 'africa' && <AfricaMap />}
              {activeView === 'city' && <CityMap3D />}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <AlertsPanel />
              <SensorList />
            </div>
          </div>

          {/* Real-time Charts */}
          <RealTimeCharts />
        </div>
      </div>
    </div>
  );
}

