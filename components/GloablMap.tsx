import { useEffect, useRef, useState } from 'react';
import { MapPin, Droplets } from 'lucide-react';
import { motion } from 'motion/react';

interface Sensor {
  id: number;
  name: string;
  lat: number;
  lng: number;
  value: number;
  status: 'normal' | 'warning' | 'alert';
  type: string;
}

export function GlobalMap() {
  const [sensors, setSensors] = useState<Sensor[]>([
    { id: 1, name: 'Dakar - Fleuve Sénégal', lat: 14.7167, lng: -17.4677, value: 324, status: 'normal', type: 'Fleuve' },
    { id: 2, name: 'Lagos - Niger Delta', lat: 6.5244, lng: 3.3792, value: 418, status: 'warning', type: 'Barrage' },
    { id: 3, name: 'Kinshasa - Congo', lat: -4.3276, lng: 15.3136, value: 356, status: 'normal', type: 'Fleuve' },
    { id: 4, name: 'Nairobi - Lac Victoria', lat: -1.2864, lng: 36.8172, value: 395, status: 'normal', type: 'Barrage' },
    { id: 5, name: 'Le Caire - Nil', lat: 30.0444, lng: 31.2357, value: 379, status: 'alert', type: 'Fleuve' },
    { id: 6, name: 'Addis-Abeba - Nil Bleu', lat: 9.0320, lng: 38.7469, value: 364, status: 'normal', type: 'Barrage' },
    { id: 7, name: 'Johannesburg - Vaal', lat: -26.2041, lng: 28.0473, value: 330, status: 'normal', type: 'Barrage' },
    { id: 8, name: 'Abidjan - Comoé', lat: 5.3600, lng: -4.0083, value: 349, status: 'warning', type: 'Fleuve' },
  ]);

  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => ({
        ...sensor,
        value: Math.max(200, Math.min(500, sensor.value + (Math.random() - 0.5) * 20)),
        status: Math.random() > 0.95 ? 'warning' : (Math.random() > 0.98 ? 'alert' : 'normal')
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alert': return 'bg-red-500 border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.6)]';
      case 'warning': return 'bg-orange-500 border-orange-400 shadow-[0_0_20px_rgba(255,150,0,0.6)]';
      default: return 'bg-cyan-500 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.6)]';
    }
  };

  return (
    <div className="relative h-[600px] bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 overflow-hidden backdrop-blur-xl">
      {/* Map Background - Africa focused */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 1000 800" className="w-full h-full">
          {/* Africa continent outline */}
          <path
            d="M500,100 Q600,150 650,250 L680,350 Q670,450 620,550 L580,650 Q500,700 450,680 L350,600 Q300,500 320,400 L300,300 Q320,200 400,150 Q450,120 500,100 Z"
            fill="rgba(0,150,255,0.05)"
            stroke="rgba(0,255,255,0.3)"
            strokeWidth="2"
            className="animate-pulse"
          />
          
          {/* Grid lines */}
          {[...Array(20)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 40}
              x2="1000"
              y2={i * 40}
              stroke="rgba(0,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
          {[...Array(25)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 40}
              y1="0"
              x2={i * 40}
              y2="800"
              stroke="rgba(0,255,255,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* River lines */}
          <path
            d="M500,150 Q480,200 470,250 L460,300 Q450,350 440,400"
            stroke="rgba(0,200,255,0.4)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M550,200 Q560,250 570,300 L580,350"
            stroke="rgba(0,200,255,0.4)"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* Sensors on map */}
        {sensors.map((sensor, index) => {
          const x = 300 + (sensor.lng + 20) * 15;
          const y = 400 - sensor.lat * 15;
          
          return (
            <motion.div
              key={sensor.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer group"
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => setSelectedSensor(sensor)}
            >
              {/* Pulse rings */}
              <div className={`absolute w-16 h-16 -left-8 -top-8 ${getStatusColor(sensor.status)} rounded-full opacity-30 animate-ping`} />
              <div className={`absolute w-12 h-12 -left-6 -top-6 ${getStatusColor(sensor.status)} rounded-full opacity-50`} />
              
              {/* Sensor marker */}
              <div className={`w-8 h-8 -ml-4 -mt-4 ${getStatusColor(sensor.status)} rounded-full border-2 flex items-center justify-center group-hover:scale-150 transition-transform`}>
                <Droplets className="w-4 h-4 text-white" />
              </div>

              {/* Value label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900/90 px-2 py-1 rounded border border-cyan-500/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-cyan-400">{sensor.value.toFixed(0)}</div>
              </div>

              {/* Connection line to value */}
              <div className="absolute top-4 left-4 w-px h-8 bg-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          );
        })}
      </div>

      {/* Info Panel */}
      {selectedSensor && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 bg-gray-900/95 border border-cyan-500/50 rounded-lg p-4 min-w-[250px] backdrop-blur-xl"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${getStatusColor(selectedSensor.status)} rounded-full`} />
              <span className="text-sm text-cyan-400">{selectedSensor.type}</span>
            </div>
            <button
              onClick={() => setSelectedSensor(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <h3 className="text-cyan-300 mb-2">{selectedSensor.name}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Indice de risque:</span>
              <span className="text-cyan-400 font-mono">{selectedSensor.value.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Coordonnées:</span>
              <span className="text-cyan-400 font-mono text-xs">
                {selectedSensor.lat.toFixed(2)}°, {selectedSensor.lng.toFixed(2)}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">État:</span>
              <span className={`${
                selectedSensor.status === 'alert' ? 'text-red-400' :
                selectedSensor.status === 'warning' ? 'text-orange-400' :
                'text-green-400'
              }`}>
                {selectedSensor.status === 'alert' ? 'ALERTE' :
                 selectedSensor.status === 'warning' ? 'ATTENTION' : 'NORMAL'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-cyan-500/30">
            <div className="text-xs text-gray-400 mb-1">Détection récente:</div>
            <div className="text-xs text-cyan-300">
              • E. coli: {(Math.random() * 100).toFixed(1)}%<br />
              • Rotavirus: {(Math.random() * 50).toFixed(1)}%<br />
              • SARS-CoV-2: {(Math.random() * 30).toFixed(1)}%
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/95 border border-cyan-500/50 rounded-lg p-3 backdrop-blur-xl">
        <div className="text-xs text-gray-400 mb-2">État des capteurs:</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-cyan-500 rounded-full border border-cyan-400" />
            <span className="text-gray-300">Normal</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-orange-500 rounded-full border border-orange-400" />
            <span className="text-gray-300">Attention</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-red-400" />
            <span className="text-gray-300">Alerte</span>
          </div>
        </div>
      </div>
    </div>
  );
}
