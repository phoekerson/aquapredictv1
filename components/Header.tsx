import { Activity, Droplets, AlertTriangle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-cyan-500/30 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Droplets className="w-10 h-10 text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl text-cyan-400 tracking-wider">
                  AQUAPREDICT
                </h1>
                <p className="text-sm text-cyan-300/70">
                  Système de Surveillance Épidémiologique des Eaux Usées
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <Activity className="w-5 h-5 text-green-400 animate-pulse" />
              <span className="text-sm">Système Actif</span>
            </div>
            
            <div className="text-right">
              {/* <div className="text-cyan-400 tracking-wider">
                {time.toLocaleTimeString('fr-FR')}
              </div> */}
              <div className="text-xs text-cyan-300/70">
                {time.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
