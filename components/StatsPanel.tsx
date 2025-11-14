import { useEffect, useState } from 'react';
import { Activity, Droplets, AlertTriangle, TrendingUp, MapPin, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Stat {
  label: string;
  value: number;
  unit: string;
  icon: any;
  change: number;
  color: string;
}

export function StatsPanel() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Capteurs Actifs', value: 1247, unit: '', icon: Activity, change: 12, color: 'cyan' },
    { label: 'Échantillons/Jour', value: 234110, unit: '', icon: Droplets, change: 8, color: 'blue' },
    { label: 'Alertes Actives', value: 23, unit: '', icon: AlertTriangle, change: -5, color: 'orange' },
    { label: 'Prévisions IA', value: 156, unit: '', icon: TrendingUp, change: 18, color: 'green' },
    { label: 'Régions Surveillées', value: 89, unit: '', icon: MapPin, change: 3, color: 'purple' },
    { label: 'Analyse Temps Réel', value: 98.7, unit: '%', icon: Zap, change: 2.1, color: 'cyan' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.value + (Math.random() - 0.48) * (stat.value * 0.001)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: string) => {
    const colors: any = {
      cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(0,255,255,0.2)]' },
      blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(0,100,255,0.2)]' },
      orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(255,150,0,0.2)]' },
      green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(0,255,100,0.2)]' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(150,0,255,0.2)]' },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${colors.bg} ${colors.border} ${colors.glow} border rounded-lg p-4 backdrop-blur-xl transition-all hover:scale-105`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-6 h-6 ${colors.text}`} />
              <div className={`flex items-center gap-1 text-xs ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-3 h-3 ${stat.change < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(stat.change).toFixed(1)}%
              </div>
            </div>
            
            <div className={`text-2xl ${colors.text} mb-1 font-mono`}>
              {stat.value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}
              {stat.unit}
            </div>
            
            <div className="text-xs text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
