import { useEffect, useState } from 'react';
import { Activity, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface Sensor {
  id: number;
  name: string;
  location: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  status: 'online' | 'offline';
  lastUpdate: string;
}

export function SensorList() {
  const [sensors, setSensors] = useState<Sensor[]>([
    { id: 1, name: 'SENS-DKR-001', location: 'Dakar Centre', value: 78.3, trend: 'down', status: 'online', lastUpdate: 'Il y a 2s' },
    { id: 2, name: 'SENS-LGS-042', location: 'Lagos Plateau', value: 92.1, trend: 'up', status: 'online', lastUpdate: 'Il y a 5s' },
    { id: 3, name: 'SENS-KIN-018', location: 'Kinshasa Gombe', value: 65.7, trend: 'stable', status: 'online', lastUpdate: 'Il y a 3s' },
    { id: 4, name: 'SENS-NBO-029', location: 'Nairobi CBD', value: 84.2, trend: 'down', status: 'online', lastUpdate: 'Il y a 1s' },
    { id: 5, name: 'SENS-CAI-055', location: 'Le Caire Nord', value: 71.5, trend: 'up', status: 'online', lastUpdate: 'Il y a 4s' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => ({
        ...sensor,
        value: Math.max(50, Math.min(100, sensor.value + (Math.random() - 0.5) * 5)),
        trend: Math.random() > 0.6 ? 'up' : (Math.random() > 0.3 ? 'down' : 'stable'),
        lastUpdate: `Il y a ${Math.floor(Math.random() * 10)}s`,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Capteurs en Temps Réel
      </h3>

      <div className="space-y-3">
        {sensors.map((sensor, index) => (
          <motion.div
            key={sensor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  sensor.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                }`} />
                <div>
                  <div className="text-cyan-300 text-sm">{sensor.name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {sensor.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {sensor.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                {sensor.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
                {sensor.trend === 'stable' && <div className="w-4 h-0.5 bg-cyan-400" />}
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl text-cyan-400 font-mono">
                  {sensor.value.toFixed(1)}
                  <span className="text-sm text-gray-400 ml-1">ppm</span>
                </div>
                <div className="text-xs text-gray-500">{sensor.lastUpdate}</div>
              </div>

              {/* Mini chart */}
              <div className="flex items-end gap-0.5 h-8">
                {[...Array(8)].map((_, i) => {
                  const height = 20 + Math.random() * 80;
                  return (
                    <div
                      key={i}
                      className="w-1 bg-cyan-500/50 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
