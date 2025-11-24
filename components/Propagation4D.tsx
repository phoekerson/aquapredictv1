'use client';

import { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { generatePropagationData, MOCK_DISTRICTS } from '@/lib/mock-data';
import { PropagationScene3D } from '@/components/PropagationScene3D';

export function Propagation4D() {
  const [propagationData, setPropagationData] = useState<any[]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const setPropagationDay = useAppStore((state) => state.setPropagationDay);
  const setIsPropagationPlaying = useAppStore((state) => state.setIsPropagationPlaying);

  useEffect(() => {
    // Initialize with Lagos as origin
    const origin = MOCK_DISTRICTS[0].coordinates;
    const data = generatePropagationData(origin, 30);
    setPropagationData(data);
  }, []);

  useEffect(() => {
    if (isPlaying && propagationData.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentDay((prev) => {
          const next = prev + 1;
          if (next >= propagationData.length) {
            setIsPlaying(false);
            return prev;
          }
          setPropagationDay(next);
          return next;
        });
      }, 500); // Update every 500ms
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    setIsPropagationPlaying(isPlaying);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, propagationData.length, setPropagationDay, setIsPropagationPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentDay(0);
    setIsPlaying(false);
    setPropagationDay(0);
  };

  const handleSkip = (days: number) => {
    const newDay = Math.max(0, Math.min(propagationData.length - 1, currentDay + days));
    setCurrentDay(newDay);
    setPropagationDay(newDay);
  };

  const currentData = propagationData.find(d => d.day === currentDay);

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-1">4D Pathogen Propagation</h3>
          <p className="text-sm text-gray-400">Simulate spread in space and time</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">Day {currentDay}</div>
          <div className="text-xs text-gray-400">of {propagationData.length - 1}</div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="h-[400px] bg-black/50 rounded-lg mb-4 overflow-hidden">
        {propagationData.length > 0 ? (
          <PropagationScene3D day={currentDay} data={propagationData} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading propagation model...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handlePlayPause}
          className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-all flex items-center justify-center gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg text-gray-300 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSkip(-7)}
          disabled={currentDay < 7}
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg text-gray-300 transition-all disabled:opacity-50"
        >
          -7d
        </button>
        <button
          onClick={() => handleSkip(7)}
          disabled={currentDay >= propagationData.length - 7}
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg text-gray-300 transition-all disabled:opacity-50"
        >
          +7d
        </button>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Timeline</span>
          <span>{currentDay} / {propagationData.length - 1} days</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentDay / (propagationData.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Projection Info */}
      {currentData && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="text-sm text-cyan-300 mb-2">Projected Spread (Day {currentDay})</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Affected Areas:</span>
              <span className="text-cyan-400 ml-2 font-semibold">{currentData.affectedAreas.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Max Radius:</span>
              <span className="text-cyan-400 ml-2 font-semibold">
                {Math.max(...currentData.affectedAreas.map((a: any) => a.radius)).toFixed(1)} km
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Projections */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            const day7 = Math.min(7, propagationData.length - 1);
            setCurrentDay(day7);
            setPropagationDay(day7);
          }}
          className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 text-xs transition-all"
        >
          7 Days
        </button>
        <button
          onClick={() => {
            const day14 = Math.min(14, propagationData.length - 1);
            setCurrentDay(day14);
            setPropagationDay(day14);
          }}
          className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg text-orange-400 text-xs transition-all"
        >
          14 Days
        </button>
        <button
          onClick={() => {
            const day30 = Math.min(30, propagationData.length - 1);
            setCurrentDay(day30);
            setPropagationDay(day30);
          }}
          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-xs transition-all"
        >
          30 Days
        </button>
      </div>
    </div>
  );
}

