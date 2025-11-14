import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function CityMap3D() {
  const [rotation, setRotation] = useState(0);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);

  useEffect(() => {
    // Generate initial heatmap data
    const data: number[][] = [];
    for (let i = 0; i < 20; i++) {
      const row: number[] = [];
      for (let j = 0; j < 20; j++) {
        row.push(Math.random());
      }
      data.push(row);
    }
    setHeatmapData(data);

    // Rotate animation
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
    }, 50);

    // Update heatmap
    const heatmapInterval = setInterval(() => {
      setHeatmapData(prev => 
        prev.map(row => 
          row.map(val => Math.max(0, Math.min(1, val + (Math.random() - 0.5) * 0.1)))
        )
      );
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(heatmapInterval);
    };
  }, []);

  const getHeatColor = (value: number) => {
    if (value > 0.8) return 'rgba(255, 0, 0, 0.7)';
    if (value > 0.6) return 'rgba(255, 150, 0, 0.6)';
    if (value > 0.4) return 'rgba(255, 255, 0, 0.5)';
    if (value > 0.2) return 'rgba(0, 255, 255, 0.4)';
    return 'rgba(0, 200, 255, 0.3)';
  };

  return (
    <div className="relative h-[600px] bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 overflow-hidden backdrop-blur-xl">
      <svg viewBox="0 0 1000 800" className="w-full h-full">
        <defs>
          <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,100,200,0.8)" />
            <stop offset="100%" stopColor="rgba(0,50,100,0.4)" />
          </linearGradient>

          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 3D Grid */}
        <g transform="translate(500, 400) rotateX(60) rotateZ(0)">
          {[...Array(30)].map((_, i) => (
            <line
              key={`grid-h-${i}`}
              x1={-400}
              y1={(i - 15) * 30}
              x2={400}
              y2={(i - 15) * 30}
              stroke="rgba(0,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
          {[...Array(30)].map((_, i) => (
            <line
              key={`grid-v-${i}`}
              x1={(i - 15) * 30}
              y1={-400}
              x2={(i - 15) * 30}
              y2={400}
              stroke="rgba(0,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Heatmap overlay */}
        <g transform="translate(200, 100)">
          {heatmapData.map((row, i) => 
            row.map((value, j) => {
              const x = j * 30;
              const y = i * 30;
              const perspective = 0.5; // 3D perspective factor
              const offsetX = (j - 10) * perspective;
              const offsetY = (i - 10) * perspective * 0.5;

              return (
                <motion.rect
                  key={`heat-${i}-${j}`}
                  x={x + offsetX}
                  y={y + offsetY}
                  width={30}
                  height={30}
                  fill={getHeatColor(value)}
                  opacity={0.7}
                  animate={{
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: (i + j) * 0.05,
                  }}
                />
              );
            })
          )}
        </g>

        {/* 3D Buildings */}
        {[
          { x: 300, y: 250, w: 60, h: 150, d: 40 },
          { x: 450, y: 280, w: 50, h: 120, d: 35 },
          { x: 600, y: 300, w: 70, h: 180, d: 45 },
          { x: 380, y: 380, w: 55, h: 140, d: 38 },
          { x: 520, y: 400, w: 65, h: 160, d: 42 },
          { x: 250, y: 420, w: 50, h: 110, d: 35 },
          { x: 680, y: 450, w: 60, h: 130, d: 40 },
        ].map((building, idx) => {
          const rotationOffset = Math.sin(rotation * 0.02 + idx) * 2;
          
          return (
            <g key={`building-${idx}`}>
              {/* Building shadow */}
              <ellipse
                cx={building.x + building.w / 2 + 5}
                cy={building.y + building.h + building.d + 5}
                rx={building.w * 0.6}
                ry={building.d * 0.4}
                fill="rgba(0,0,0,0.3)"
              />

              {/* Building sides (3D effect) */}
              <polygon
                points={`${building.x},${building.y + building.h} ${building.x + building.w},${building.y + building.h} ${building.x + building.w + building.d},${building.y + building.h + building.d} ${building.x + building.d},${building.y + building.h + building.d}`}
                fill="rgba(0,50,100,0.6)"
              />
              <polygon
                points={`${building.x + building.w},${building.y} ${building.x + building.w},${building.y + building.h} ${building.x + building.w + building.d},${building.y + building.h + building.d} ${building.x + building.w + building.d},${building.y + building.d}`}
                fill="rgba(0,80,150,0.6)"
              />

              {/* Building front */}
              <rect
                x={building.x}
                y={building.y}
                width={building.w}
                height={building.h}
                fill="url(#buildingGradient)"
                stroke="rgba(0,255,255,0.3)"
                strokeWidth="1"
                filter="url(#shadow)"
              />

              {/* Windows */}
              {[...Array(Math.floor(building.h / 20))].map((_, floor) => (
                <g key={`windows-${idx}-${floor}`}>
                  {[...Array(Math.floor(building.w / 15))].map((_, col) => (
                    <rect
                      key={`window-${col}`}
                      x={building.x + 5 + col * 15}
                      y={building.y + 5 + floor * 20}
                      width={8}
                      height={12}
                      fill={Math.random() > 0.3 ? 'rgba(255,255,150,0.6)' : 'rgba(100,100,150,0.3)'}
                      opacity={0.8 + Math.sin(rotation * 0.05 + col + floor) * 0.2}
                    />
                  ))}
                </g>
              ))}

              {/* Sensor on building */}
              <circle
                cx={building.x + building.w / 2}
                cy={building.y - 10}
                r={8}
                fill="rgba(0,255,255,0.3)"
                className="animate-pulse"
              />
              <circle
                cx={building.x + building.w / 2}
                cy={building.y - 10}
                r={5}
                fill="rgba(0,255,255,0.8)"
              />
            </g>
          );
        })}

        {/* Water flow paths */}
        <g opacity="0.6">
          <path
            d="M100,600 Q200,580 300,600 T500,600 T700,600 T900,600"
            stroke="rgba(0,200,255,0.6)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
            strokeDashoffset={rotation}
          />
          <path
            d="M100,650 Q200,630 300,650 T500,650 T700,650 T900,650"
            stroke="rgba(0,200,255,0.4)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            strokeDashoffset={rotation * 1.5}
          />
        </g>

        {/* Sensor network connections */}
        {[
          { x1: 330, y1: 250, x2: 480, y2: 280 },
          { x1: 480, y1: 280, x2: 630, y2: 300 },
          { x1: 330, y1: 250, x2: 410, y2: 380 },
          { x1: 480, y1: 280, x2: 550, y2: 400 },
        ].map((connection, idx) => (
          <line
            key={`connection-${idx}`}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            stroke="rgba(0,255,255,0.3)"
            strokeWidth="1"
            strokeDasharray="5,5"
            strokeDashoffset={rotation * 0.5}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-gray-900/95 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-xl">
        <h3 className="text-cyan-400 mb-3 text-sm">Carte Thermique - Risques</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400" />
            <span className="text-xs text-gray-300">Faible (0-20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-yellow-400" />
            <span className="text-xs text-gray-300">Moyen (20-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500" />
            <span className="text-xs text-gray-300">Élevé (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500" />
            <span className="text-xs text-gray-300">Critique (&gt;80%)</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 bg-gray-900/95 border border-cyan-500/50 rounded-lg p-4 backdrop-blur-xl min-w-[200px]">
        <h3 className="text-cyan-400 mb-3 text-sm">Zone Urbaine - Dakar</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Quartiers surveillés:</span>
            <span className="text-cyan-400 font-mono">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Capteurs actifs:</span>
            <span className="text-cyan-400 font-mono">48</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Population couverte:</span>
            <span className="text-cyan-400 font-mono">234K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Risque moyen:</span>
            <span className="text-orange-400 font-mono">38%</span>
          </div>
        </div>
      </div>
    </div>
  );
}