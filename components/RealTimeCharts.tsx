import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

export function RealTimeCharts() {
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [pathogenData, setPathogenData] = useState<any[]>([
    { name: 'E. coli', value: 35, color: '#00d4ff' },
    { name: 'Rotavirus', value: 25, color: '#0096ff' },
    { name: 'SARS-CoV-2', value: 15, color: '#ffa500' },
    { name: 'Norovirus', value: 12, color: '#00ff88' },
    { name: 'Autres', value: 13, color: '#ff6b6b' },
  ]);
  const [regionData, setRegionData] = useState<any[]>([]);

  useEffect(() => {
    // Initialize time series data
    const initialData = [];
    for (let i = 0; i < 20; i++) {
      initialData.push({
        time: `${20 - i}m`,
        ecoli: Math.random() * 100,
        virus: Math.random() * 80,
        bacteria: Math.random() * 90,
      });
    }
    setTimeSeriesData(initialData);

    // Initialize region data
    const regions = ['Dakar', 'Lagos', 'Kinshasa', 'Nairobi', 'Le Caire', 'Johannesburg'];
    setRegionData(regions.map(region => ({
      name: region,
      risque: Math.random() * 100,
      capteurs: Math.floor(Math.random() * 50) + 10,
    })));

    // Update data in real-time
    const interval = setInterval(() => {
      setTimeSeriesData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: 'Now',
          ecoli: Math.random() * 100,
          virus: Math.random() * 80,
          bacteria: Math.random() * 90,
        });
        return newData;
      });

      setPathogenData(prev => 
        prev.map(item => ({
          ...item,
          value: Math.max(5, Math.min(50, item.value + (Math.random() - 0.5) * 5))
        }))
      );

      setRegionData(prev =>
        prev.map(region => ({
          ...region,
          risque: Math.max(0, Math.min(100, region.risque + (Math.random() - 0.5) * 10)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time Series Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl"
      >
        <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Détection en Temps Réel
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorEcoli" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorVirus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffa500" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffa500" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBacteria" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(0,255,255,0.5)" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(0,255,255,0.5)" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10,14,39,0.95)', 
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="ecoli" 
              stroke="#00d4ff" 
              fillOpacity={1} 
              fill="url(#colorEcoli)" 
              name="E. coli"
            />
            <Area 
              type="monotone" 
              dataKey="virus" 
              stroke="#ffa500" 
              fillOpacity={1} 
              fill="url(#colorVirus)" 
              name="Virus"
            />
            <Area 
              type="monotone" 
              dataKey="bacteria" 
              stroke="#00ff88" 
              fillOpacity={1} 
              fill="url(#colorBacteria)" 
              name="Bactéries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pathogen Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl"
      >
        <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Distribution des Pathogènes
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pathogenData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pathogenData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10,14,39,0.95)', 
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Regional Risk Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl lg:col-span-2"
      >
        <h3 className="text-cyan-400 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Analyse par Région
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(0,255,255,0.5)" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(0,255,255,0.5)" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10,14,39,0.95)', 
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Bar 
              dataKey="risque" 
              fill="#00d4ff" 
              name="Niveau de Risque (%)"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="capteurs" 
              fill="#00ff88" 
              name="Nombre de Capteurs"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
