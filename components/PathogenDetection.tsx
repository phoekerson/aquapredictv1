'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Bug, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface PathogenPrediction {
  virus: number;
  bacteria: number;
  toxin: number;
  parasite: number;
  timestamp: string;
  confidence: number;
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  recommendedActions: string[];
}

export function PathogenDetection() {
  const [prediction, setPrediction] = useState<PathogenPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const addPathogenPrediction = useAppStore((state) => state.addPathogenPrediction);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/predict-pathogen');
      const data = await response.json();
      if (data.success && data.prediction) {
        setPrediction(data.prediction);
        addPathogenPrediction(data.prediction);
      }
    } catch (error) {
      console.error('Failed to fetch pathogen prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
    const interval = setInterval(fetchPrediction, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (!prediction) {
    return (
      <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cyan-400">Pathogen Detection AI</h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          {loading ? 'Analyzing...' : 'No data available'}
        </div>
      </div>
    );
  }

  const maxType = Math.max(prediction.virus, prediction.bacteria, prediction.toxin, prediction.parasite);
  const primaryThreat = 
    prediction.virus === maxType ? 'Virus' :
    prediction.bacteria === maxType ? 'Bacteria' :
    prediction.toxin === maxType ? 'Toxin' :
    'Parasite';

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cyan-400">Pathogen Detection AI</h3>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(prediction.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Primary Threat Alert */}
      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="font-semibold text-red-400">Primary Threat: {primaryThreat}</span>
        </div>
        <div className="text-sm text-gray-300">
          Confidence: {(prediction.confidence * 100).toFixed(1)}% | Location: {prediction.location.region}
        </div>
      </div>

      {/* Pathogen Probabilities */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <PathogenCard
          label="Virus"
          probability={prediction.virus}
          icon={AlertCircle}
          color="red"
        />
        <PathogenCard
          label="Bacteria"
          probability={prediction.bacteria}
          icon={Bug}
          color="orange"
        />
        <PathogenCard
          label="Toxin"
          probability={prediction.toxin}
          icon={AlertTriangle}
          color="yellow"
        />
        <PathogenCard
          label="Parasite"
          probability={prediction.parasite}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Recommended Actions */}
      {prediction.recommendedActions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-cyan-300 mb-2">Recommended Actions:</h4>
          <ul className="space-y-1">
            {prediction.recommendedActions.map((action, idx) => (
              <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={fetchPrediction}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Refresh Analysis'}
      </button>
    </div>
  );
}

function PathogenCard({
  label,
  probability,
  icon: Icon,
  color
}: {
  label: string;
  probability: number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold">{(probability * 100).toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${
            color === 'red' ? 'from-red-500 to-red-600' :
            color === 'orange' ? 'from-orange-500 to-orange-600' :
            color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
            'from-purple-500 to-purple-600'
          }`}
          style={{ width: `${probability * 100}%` }}
        />
      </div>
    </div>
  );
}

