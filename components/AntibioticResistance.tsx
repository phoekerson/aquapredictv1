'use client';

import { useEffect, useState } from 'react';
import { Pill, AlertTriangle, TrendingUp } from 'lucide-react';
import { simulateAntibioticResistance } from '@/lib/ai-simulators';

interface AntibioticResistance {
  antibiotic: string;
  resistanceLevel: number;
  geneDetected: string;
  prevalence: number;
}

export function AntibioticResistance() {
  const [resistanceData, setResistanceData] = useState<AntibioticResistance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResistanceData = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = simulateAntibioticResistance();
    setResistanceData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchResistanceData();
    const interval = setInterval(fetchResistanceData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getResistanceColor = (level: number) => {
    if (level < 30) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (level < 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    if (level < 70) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Pill className="w-6 h-6 text-red-400" />
        <h3 className="text-xl font-semibold text-red-400">Antibiotic Resistance Detection</h3>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Analyzing resistance patterns...</div>
      ) : (
        <div className="space-y-3">
          {resistanceData.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${getResistanceColor(item.resistanceLevel)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    {item.antibiotic}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Gene: <span className="text-cyan-400">{item.geneDetected}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{item.resistanceLevel}%</div>
                  <div className="text-xs text-gray-400">Resistance</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Resistance Level</span>
                  <span>{item.resistanceLevel}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.resistanceLevel < 30 ? 'bg-green-500' :
                      item.resistanceLevel < 50 ? 'bg-yellow-500' :
                      item.resistanceLevel < 70 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${item.resistanceLevel}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-gray-400">Prevalence:</span>
                  <span className="font-semibold">{item.prevalence}%</span>
                </div>
                {item.resistanceLevel > 50 && (
                  <div className="flex items-center gap-1 text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>High Risk</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
          <div className="text-xs text-yellow-300">
            <div className="font-semibold mb-1">Antimicrobial Resistance Alert</div>
            <div className="text-yellow-400/80">
              High resistance levels detected. Consider alternative treatment protocols and enhanced monitoring.
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={fetchResistanceData}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Refresh Analysis'}
      </button>
    </div>
  );
}

