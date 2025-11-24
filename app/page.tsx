'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Users, Drone } from 'lucide-react';
import { Header } from '@/components/Header';
import { GlobalMap } from '@/components/GloablMap';
import { CityMap3D } from '@/components/CityMap3D';
import { StatsPanel } from '@/components/StatsPanel';
import { RealTimeCharts } from '@/components/RealTimeCharts';
import { SensorList } from '@/components/SensorList';
import { AlertsPanel } from '@/components/AlertsPanel';
import { AfricaMap } from '@/components/AfricaMap';
import { PathogenDetection } from '@/components/PathogenDetection';
import { RiskIndex } from '@/components/RiskIndex';
import { GhostThreat } from '@/components/GhostThreat';
import { SmartBiosensors } from '@/components/SmartBiosensors';
import { AntibioticResistance } from '@/components/AntibioticResistance';
import { PollutionDetection } from '@/components/PollutionDetection';
import { SocialMediaCorrelation } from '@/components/SocialMediaCorrelation';
import { AIGovAdvisor } from '@/components/AIGovAdvisor';
import { FileAnalyzer } from '@/components/FileAnalyzer';

// Dynamic import for Globe3D (no SSR)
const Globe3D = dynamic(() => import('@/components/Globe3D').then(mod => ({ default: mod.Globe3D })), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-900/50 rounded-lg border border-cyan-500/30 flex items-center justify-center text-gray-400">Loading 3D Globe...</div>
});

// Dynamic imports for 3D components (no SSR)
const Propagation4D = dynamic(() => import('@/components/Propagation4D').then(mod => ({ default: mod.Propagation4D })), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-900/50 rounded-lg border border-cyan-500/30 flex items-center justify-center text-gray-400">Loading 3D visualization...</div>
});

const MicrobialReservoir = dynamic(() => import('@/components/MicrobialReservoir').then(mod => ({ default: mod.MicrobialReservoir })), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-900/50 rounded-lg border border-cyan-500/30 flex items-center justify-center text-gray-400">Loading 3D visualization...</div>
});

export default function Home() {
  const [activeView, setActiveView] = useState<'global' | 'africa' | 'city'>('global');
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'advanced'>('overview');

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden relative">
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
          {/* Navigation Links */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4 justify-center flex-1">
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
            <div className="flex gap-3">
              <Link
                href="/community"
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Community
              </Link>
              <Link
                href="/drone-monitoring"
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 transition-all flex items-center gap-2"
              >
                <Drone className="w-4 h-4" />
                Drones
              </Link>
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="flex gap-2 border-b border-cyan-500/30">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 transition-all border-b-2 ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-cyan-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-3 transition-all border-b-2 ${
                activeTab === 'ai'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-cyan-300'
              }`}
            >
              AI Features
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-6 py-3 transition-all border-b-2 ${
                activeTab === 'advanced'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-cyan-300'
              }`}
            >
              Advanced
            </button>
          </div>

          {/* Stats Panel */}
          <StatsPanel />

          {/* File Analyzer - Always visible on top */}
          <FileAnalyzer />

          {/* Globe 3D - Always visible */}
          <Globe3D />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
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
                  <RiskIndex />
                </div>
              </div>

              {/* Real-time Charts */}
              <RealTimeCharts />
            </>
          )}

          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <PathogenDetection />
              <GhostThreat />
              <SmartBiosensors />
              <AntibioticResistance />
              <PollutionDetection />
              <SocialMediaCorrelation />
              <div className="lg:col-span-2 xl:col-span-3">
                <AIGovAdvisor />
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Propagation4D />
              <MicrobialReservoir />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

