'use client';

import { useEffect, useState } from 'react';
import { Factory, AlertTriangle, Droplets } from 'lucide-react';
import { simulateChemicalThreats } from '@/lib/ai-simulators';

interface ChemicalThreat {
  chemical: string;
  concentration: number;
  threshold: number;
  source: 'industrial' | 'agricultural' | 'unknown';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function PollutionDetection() {
  const [threats, setThreats] = useState<ChemicalThreat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThreats = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = simulateChemicalThreats();
    setThreats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'industrial' ? Factory : Droplets;
  };

  const getSourceColor = (source: string) => {
    return source === 'industrial' ? 'text-orange-400' : 'text-green-400';
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Factory className="w-6 h-6 text-orange-400" />
        <h3 className="text-xl font-semibold text-orange-400">Industrial Pollution Detection</h3>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Scanning for chemical threats...</div>
      ) : (
        <div className="space-y-3">
          {threats.map((threat, idx) => {
            const SourceIcon = getSourceIcon(threat.source);
            const ratio = threat.concentration / threat.threshold;
            const isExceeded = ratio > 1;

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${getRiskColor(threat.riskLevel)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <SourceIcon className={`w-4 h-4 ${getSourceColor(threat.source)}`} />
                      <span className="font-semibold">{threat.chemical}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        threat.riskLevel === 'critical' ? 'bg-red-500/30' :
                        threat.riskLevel === 'high' ? 'bg-orange-500/30' :
                        threat.riskLevel === 'medium' ? 'bg-yellow-500/30' :
                        'bg-green-500/30'
                      }`}>
                        {threat.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Source: <span className="capitalize">{threat.source}</span>
                    </div>
                  </div>
                  {isExceeded && (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Concentration</span>
                    <span className={isExceeded ? 'text-red-400 font-bold' : 'text-gray-300'}>
                      {threat.concentration.toFixed(4)} ppm
                      {isExceeded && ' ⚠️'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        threat.riskLevel === 'critical' ? 'bg-red-500' :
                        threat.riskLevel === 'high' ? 'bg-orange-500' :
                        threat.riskLevel === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (ratio * 100))}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Safe threshold: {threat.threshold.toFixed(4)} ppm
                    {isExceeded && (
                      <span className="text-red-400 ml-2">
                        (Exceeded by {((ratio - 1) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {threats.some(t => t.riskLevel === 'critical' || t.riskLevel === 'high') && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
            <div className="text-xs text-red-300">
              <div className="font-semibold mb-1">Immediate Action Required</div>
              <div className="text-red-400/80">
                High levels of chemical contamination detected. Activate emergency response protocol.
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={fetchThreats}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg text-orange-400 text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'Scanning...' : 'Refresh Detection'}
      </button>
    </div>
  );
}

