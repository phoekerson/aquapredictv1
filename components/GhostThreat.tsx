'use client';

import { useEffect, useState } from 'react';
import { Ghost, AlertTriangle, X, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface AnomalyAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  detectedAt: string;
  description: string;
  confidence: number;
  recommendedActions: string[];
}

export function GhostThreat() {
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const addAnomaly = useAppStore((state) => state.addAnomaly);
  const removeAnomaly = useAppStore((state) => state.removeAnomaly);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/anomaly-detection?limit=5');
      const data = await response.json();
      if (data.success && data.anomalies) {
        setAnomalies(data.anomalies);
        data.anomalies.forEach((anomaly: AnomalyAlert) => {
          addAnomaly(anomaly);
        });
      }
    } catch (error) {
      console.error('Failed to fetch anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
    const interval = setInterval(fetchAnomalies, 45000); // Update every 45s
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'medium': return 'border-orange-500/30 bg-orange-500/10';
      case 'high': return 'border-red-500/30 bg-red-500/10';
      case 'critical': return 'border-red-600/50 bg-red-600/20 animate-pulse';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-400';
      case 'medium': return 'text-orange-400';
      case 'high': return 'text-red-400';
      case 'critical': return 'text-red-500 font-bold';
      default: return 'text-gray-400';
    }
  };

  const handleDismiss = (id: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== id));
    removeAnomaly(id);
  };

  if (anomalies.length === 0 && !loading) {
    return (
      <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <Ghost className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-purple-400">Ghost Threat Detector</h3>
        </div>
        <div className="text-center py-8">
          <Ghost className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No anomalies detected</p>
          <p className="text-xs text-gray-500 mt-2">System monitoring for unknown threats...</p>
        </div>
        <button
          onClick={fetchAnomalies}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 text-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Scanning...' : 'Run Anomaly Scan'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Ghost className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-purple-400">Ghost Threat Detector</h3>
        {anomalies.length > 0 && (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            {anomalies.length} Active
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {anomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)} relative`}
          >
            <button
              onClick={() => handleDismiss(anomaly.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-2">
              <AlertTriangle className={`w-5 h-5 ${getSeverityText(anomaly.severity)} mt-0.5`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${getSeverityText(anomaly.severity)}`}>
                    {anomaly.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{anomaly.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{anomaly.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span>{anomaly.location.region}</span>
                  <span>•</span>
                  <span>Confidence: {(anomaly.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {anomaly.recommendedActions && anomaly.recommendedActions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <p className="text-xs font-semibold text-cyan-300 mb-1">Recommended Actions:</p>
                <ul className="space-y-1">
                  {anomaly.recommendedActions.map((action, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">
              Detected: {new Date(anomaly.detectedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={fetchAnomalies}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-400 text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'Scanning...' : 'Run New Scan'}
      </button>
    </div>
  );
}

