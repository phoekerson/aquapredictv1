'use client';

import { useEffect, useState } from 'react';
import { Cpu, Settings, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface CalibrationStatus {
  sensorId: string;
  status: 'calibrating' | 'calibrated' | 'failed';
  sensitivity: number;
  accuracy: number;
  lastCalibration: string;
  nextCalibration: string;
  adjustments: {
    parameter: string;
    oldValue: number;
    newValue: number;
    reason: string;
  }[];
  confidence: number;
}

export function SmartBiosensors() {
  const [calibrations, setCalibrations] = useState<CalibrationStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalibrations = async () => {
    setLoading(true);
    try {
      // Fetch multiple sensor calibrations
      const sensorIds = ['sensor-001', 'sensor-002', 'sensor-003', 'sensor-004'];
      const results = await Promise.all(
        sensorIds.map(id => 
          fetch(`/api/sensor-self-calibration?sensorId=${id}`)
            .then(res => res.json())
        )
      );
      
      const calibrations = results
        .filter(r => r.success)
        .map(r => r.calibration);
      
      setCalibrations(calibrations);
    } catch (error) {
      console.error('Failed to fetch calibrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalibrations();
    const interval = setInterval(fetchCalibrations, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'calibrating':
        return <Loader className="w-5 h-5 text-yellow-400 animate-spin" />;
      case 'calibrated':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calibrating': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'calibrated': return 'border-green-500/30 bg-green-500/10';
      case 'failed': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Cpu className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold text-cyan-400">Adaptive Smart Biosensors</h3>
      </div>

      {loading && calibrations.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Loading sensor data...</div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {calibrations.map((cal) => (
            <div
              key={cal.sensorId}
              className={`p-4 rounded-lg border ${getStatusColor(cal.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(cal.status)}
                  <div>
                    <div className="font-semibold text-cyan-300">{cal.sensorId}</div>
                    <div className="text-xs text-gray-400">
                      Status: <span className="capitalize">{cal.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-cyan-400">
                    {(cal.confidence * 100).toFixed(0)}% Confidence
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Sensitivity</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${cal.sensitivity}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{cal.sensitivity}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Accuracy</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${cal.accuracy}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{cal.accuracy}%</span>
                  </div>
                </div>
              </div>

              {cal.adjustments && cal.adjustments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="text-xs font-semibold text-cyan-300 mb-2">Recent Adjustments:</div>
                  <div className="space-y-2">
                    {cal.adjustments.slice(0, 2).map((adj, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-300">{adj.parameter.replace(/_/g, ' ')}</span>
                          <span className="text-cyan-400">
                            {adj.oldValue.toFixed(1)} → {adj.newValue.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-gray-500 text-[10px]">{adj.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50 text-xs text-gray-500">
                <span>Last: {new Date(cal.lastCalibration).toLocaleTimeString()}</span>
                <span>Next: {new Date(cal.nextCalibration).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchCalibrations}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Refresh Sensor Status'}
      </button>
    </div>
  );
}

