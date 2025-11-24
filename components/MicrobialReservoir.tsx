'use client';

import { useState } from 'react';
import { Eye, EyeOff, Droplets } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { MicrobialReservoir3D } from '@/components/MicrobialReservoir3D';

export function MicrobialReservoir() {
  const showReservoir = useAppStore((state) => state.showMicrobialReservoir);
  const setShowReservoir = useAppStore((state) => state.setShowMicrobialReservoir);

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Droplets className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-semibold text-purple-400">3D Microbial Reservoir</h3>
            <p className="text-sm text-gray-400">Volumetric visualization of contaminated zones</p>
          </div>
        </div>
        <button
          onClick={() => setShowReservoir(!showReservoir)}
          className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
            showReservoir
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
              : 'bg-gray-700/50 border-gray-600/50 text-gray-300'
          }`}
        >
          {showReservoir ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showReservoir ? 'Hide' : 'Show'} View
        </button>
      </div>

      {showReservoir ? (
        <div className="h-[500px] bg-black/50 rounded-lg overflow-hidden">
          <MicrobialReservoir3D />
        </div>
      ) : (
        <div className="h-[500px] bg-black/30 rounded-lg flex items-center justify-center border border-gray-700/50">
          <div className="text-center text-gray-500">
            <Droplets className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Click "Show View" to visualize the microbial reservoir</p>
            <p className="text-xs mt-2 text-gray-600">
              3D volumetric rendering of contaminated underwater zones
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <div className="text-xs text-purple-300">
          <div className="font-semibold mb-1">Visualization Features:</div>
          <ul className="space-y-1 text-purple-400/80">
            <li>• Red zones indicate high contamination levels</li>
            <li>• Purple particles represent microbial activity</li>
            <li>• Interactive 3D view with rotation and zoom</li>
            <li>• Real-time volumetric lighting effects</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

