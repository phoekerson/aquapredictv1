'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Load Globe3DScene dynamically with no SSR
const Globe3DScene = dynamic(() => import('./Globe3DScene').then(mod => ({ default: mod.Globe3DScene })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-gray-400">
      Loading 3D Globe...
    </div>
  )
});

export function Globe3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure we're on client
    if (typeof window !== 'undefined') {
      // Wait for next tick to ensure React is fully hydrated
      requestAnimationFrame(() => {
        setMounted(true);
      });
    }
  }, []);

  // Never render on server
  if (typeof window === 'undefined') {
    return (
      <div className="h-[500px] bg-gray-900/50 rounded-lg border border-cyan-500/30 flex items-center justify-center text-gray-400">
        Loading 3D Globe...
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="h-[500px] bg-gray-900/50 rounded-lg border border-cyan-500/30 flex items-center justify-center text-gray-400">
        Loading 3D Globe...
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-cyan-400">Globe 3D - Réseau de Capteurs</h3>
          <p className="text-sm text-gray-400">Visualisation mondiale des capteurs en temps réel</p>
        </div>
      </div>

      <div className="h-[500px] bg-black/50 rounded-lg overflow-hidden">
        <Globe3DScene />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span className="text-gray-400">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-400">Avertissement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-400">Alerte</span>
        </div>
      </div>
    </div>
  );
}

