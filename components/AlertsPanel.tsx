import { useEffect, useState } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'warning',
      title: 'Niveau E. coli élevé',
      description: 'Concentration détectée: 850 CFU/100ml',
      location: 'Lagos - Station Delta',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: 2,
      type: 'info',
      title: 'Analyse complétée',
      description: 'Échantillonnage horaire terminé',
      location: 'Dakar - Fleuve Sénégal',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 3,
      type: 'critical',
      title: 'Alerte Pathogène',
      description: 'Traces de Norovirus détectées',
      location: 'Le Caire - Nil',
      timestamp: new Date(Date.now() - 600000),
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types: Array<'critical' | 'warning' | 'info' | 'success'> = ['critical', 'warning', 'info', 'success'];
        const titles = [
          'Niveau bactérien anormal',
          'Maintenance programmée',
          'Calibration capteur',
          'Qualité eau améliorée',
          'Pic de contamination',
        ];
        const locations = ['Dakar', 'Lagos', 'Kinshasa', 'Nairobi', 'Le Caire', 'Johannesburg'];
        
        const newAlert: Alert = {
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)],
          title: titles[Math.floor(Math.random() * titles.length)],
          description: 'Notification automatique du système',
          location: locations[Math.floor(Math.random() * locations.length)],
          timestamp: new Date(),
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/50',
          text: 'text-red-400',
          icon: XCircle,
          glow: 'shadow-[0_0_15px_rgba(255,0,0,0.3)]',
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/50',
          text: 'text-orange-400',
          icon: AlertTriangle,
          glow: 'shadow-[0_0_15px_rgba(255,150,0,0.3)]',
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/50',
          text: 'text-green-400',
          icon: CheckCircle,
          glow: 'shadow-[0_0_15px_rgba(0,255,100,0.3)]',
        };
      default:
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/50',
          text: 'text-cyan-400',
          icon: Info,
          glow: 'shadow-[0_0_15px_rgba(0,255,255,0.3)]',
        };
    }
  };

  const formatTimestamp = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `Il y a ${diff}s`;
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}m`;
    return `Il y a ${Math.floor(diff / 3600)}h`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Alertes Système
      </h3>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert, index) => {
            const style = getAlertStyle(alert.type);
            const Icon = style.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`${style.bg} ${style.border} ${style.glow} border rounded-lg p-3 backdrop-blur-sm`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`${style.text} text-sm`}>
                        {alert.title}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-1">
                      {alert.description}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      📍 {alert.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
