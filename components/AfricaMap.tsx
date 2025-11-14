import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Activity, AlertTriangle } from 'lucide-react';

export function AfricaMap() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const dams = [
    { name: 'Barrage Assouan', x: 60, y: 25, value: 364, risk: 'low' },
    { name: 'Barrage Akosombo', x: 48, y: 48, value: 418, risk: 'high' },
    { name: 'Barrage Kariba', x: 55, y: 72, value: 330, risk: 'low' },
    { name: 'Grand Barrage Renaissance', x: 62, y: 42, value: 379, risk: 'medium' },
  ];

  const rivers = [
    { name: 'Nil', points: '60,20 60,30 58,40 56,50 54,60', value: 356 },
    { name: 'Congo', points: '52,45 50,50 48,55 46,58', value: 349 },
    { name: 'Niger', points: '45,38 48,42 50,45 52,48', value: 395 },
  ];

  return (
    <div className="relative h-[600px] bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 overflow-hidden backdrop-blur-xl">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,200,255,0.6)" />
            <stop offset="100%" stopColor="rgba(0,100,200,0.3)" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Africa outline with 3D effect */}
        <g transform="translate(0, 0)">
          <path
            d="M50,10 Q65,15 70,30 L72,40 Q71,50 68,60 L64,70 Q55,80 50,78 L40,68 Q35,58 37,48 L35,38 Q37,28 45,20 Q48,15 50,10 Z"
            fill="rgba(20,30,50,0.8)"
            stroke="rgba(0,255,255,0.5)"
            strokeWidth="0.3"
          />
          <path
            d="M50,10 Q65,15 70,30 L72,40 Q71,50 68,60 L64,70 Q55,80 50,78 L40,68 Q35,58 37,48 L35,38 Q37,28 45,20 Q48,15 50,10 Z"
            fill="url(#waterGradient)"
            opacity="0.1"
            transform="translate(1, 1)"
          />
        </g>

        {/* Animated grid */}
        {[...Array(20)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 5}
            x2="100"
            y2={i * 5}
            stroke="rgba(0,255,255,0.05)"
            strokeWidth="0.1"
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 5}
            y1="0"
            x2={i * 5}
            y2="100"
            stroke="rgba(0,255,255,0.05)"
            strokeWidth="0.1"
          />
        ))}

        {/* Rivers with flow animation */}
        {rivers.map((river, idx) => (
          <g key={river.name}>
            <polyline
              points={river.points}
              fill="none"
              stroke="rgba(0,200,255,0.6)"
              strokeWidth="0.8"
              filter="url(#glow)"
            />
            <polyline
              points={river.points}
              fill="none"
              stroke="rgba(100,220,255,0.8)"
              strokeWidth="0.4"
              strokeDasharray="2,2"
              strokeDashoffset={rotation * 0.1}
            />
            {/* River label */}
            <text
              x={river.points.split(' ')[0].split(',')[0]}
              y={parseInt(river.points.split(' ')[0].split(',')[1]) - 2}
              className="text-[2px] fill-cyan-300"
              textAnchor="middle"
            >
              {river.name}
            </text>
          </g>
        ))}

        {/* Dams with pulsing effect */}
        {dams.map((dam, idx) => {
          const riskColors = {
            low: { fill: 'rgba(0,255,200,0.6)', stroke: 'rgba(0,255,200,1)' },
            medium: { fill: 'rgba(255,200,0,0.6)', stroke: 'rgba(255,200,0,1)' },
            high: { fill: 'rgba(255,100,0,0.6)', stroke: 'rgba(255,100,0,1)' }
          };
          const colors = riskColors[dam.risk as keyof typeof riskColors];

          return (
            <g key={dam.name}>
              {/* Pulse rings */}
              <circle
                cx={dam.x}
                cy={dam.y}
                r={3 + Math.sin(rotation * 0.1 + idx) * 0.5}
                fill={colors.fill}
                opacity={0.3}
              />
              <circle
                cx={dam.x}
                cy={dam.y}
                r={2 + Math.sin(rotation * 0.1 + idx) * 0.3}
                fill={colors.fill}
                opacity={0.5}
              />
              {/* Main marker */}
              <circle
                cx={dam.x}
                cy={dam.y}
                r={1.5}
                fill={colors.stroke}
                filter="url(#glow)"
              />
              <circle
                cx={dam.x}
                cy={dam.y}
                r={0.8}
                fill="white"
              />
              
              {/* Value indicator */}
              <circle
                cx={dam.x + 4}
                cy={dam.y - 3}
                r={2}
                fill="rgba(0,0,0,0.8)"
                stroke={colors.stroke}
                strokeWidth="0.2"
              />
              <text
                x={dam.x + 4}
                y={dam.y - 2.5}
                className="text-[1.5px] fill-cyan-300"
                textAnchor="middle"
              >
                {dam.value}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Info cards */}
      <div className="absolute top-4 right-4 space-y-3">
        {dams.map((dam, idx) => (
          <motion.div
            key={dam.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gray-900/95 border ${
              dam.risk === 'high' ? 'border-orange-500/50' :
              dam.risk === 'medium' ? 'border-yellow-500/50' :
              'border-cyan-500/50'
            } rounded-lg p-3 backdrop-blur-xl min-w-[200px]`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className={`w-4 h-4 ${
                  dam.risk === 'high' ? 'text-orange-400' :
                  dam.risk === 'medium' ? 'text-yellow-400' :
                  'text-cyan-400'
                }`} />
                <span className="text-sm text-cyan-300">{dam.name}</span>
              </div>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Indice:</span>
                <span className="text-cyan-400 font-mono">{dam.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Risque:</span>
                <span className={`${
                  dam.risk === 'high' ? 'text-orange-400' :
                  dam.risk === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {dam.risk === 'high' ? 'ÉLEVÉ' :
                   dam.risk === 'medium' ? 'MOYEN' : 'FAIBLE'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-4 left-4 bg-gray-900/95 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-xl">
        <h3 className="text-cyan-400 mb-3 text-sm">Réseau Afrique</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-400">Barrages surveillés:</span>
            <span className="text-cyan-400 font-mono">{dams.length}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-400">Fleuves analysés:</span>
            <span className="text-cyan-400 font-mono">{rivers.length}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-400">Analyses/jour:</span>
            <span className="text-cyan-400 font-mono">18,420</span>
          </div>
        </div>
      </div>
    </div>
  );
}