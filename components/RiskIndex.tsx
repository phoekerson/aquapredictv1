'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface RiskIndex {
  district: string;
  city: string;
  river: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
}

export function RiskIndex() {
  const [riskIndices, setRiskIndices] = useState<RiskIndex[]>([]);
  const [loading, setLoading] = useState(false);
  const updateRiskIndices = useAppStore((state) => state.updateRiskIndices);

  const fetchRiskIndices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/risk-index');
      const data = await response.json();
      if (data.success && data.riskIndices) {
        setRiskIndices(data.riskIndices);
        updateRiskIndices(data.riskIndices);
      }
    } catch (error) {
      console.error('Failed to fetch risk indices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskIndices();
    const interval = setInterval(fetchRiskIndices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-cyan-400">Global Health Risk Index</h3>
      </div>

      {loading && riskIndices.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Loading risk data...</div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {riskIndices.map((risk, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${getRiskColor(risk.riskLevel)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold">{risk.district}</div>
                  <div className="text-xs opacity-70">{risk.city}, {risk.river}</div>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(risk.trend)}
                  <span className="text-lg font-bold">{risk.riskScore}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs px-2 py-1 rounded bg-black/30">
                  {risk.riskLevel.toUpperCase()}
                </span>
                <div className="w-32 bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      risk.riskLevel === 'low' ? 'bg-green-500' :
                      risk.riskLevel === 'medium' ? 'bg-yellow-500' :
                      risk.riskLevel === 'high' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${risk.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchRiskIndices}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Refresh Risk Data'}
      </button>
    </div>
  );
}

