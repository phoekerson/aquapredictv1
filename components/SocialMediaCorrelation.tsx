'use client';

import { useEffect, useState } from 'react';
import { Twitter, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SocialMediaSignal {
  platform: 'twitter' | 'google_trends' | 'tiktok';
  keyword: string;
  mentions: number;
  trend: number;
  correlation: number;
  location: string;
  timestamp: string;
}

interface InfoDetectionResult {
  signals: SocialMediaSignal[];
  overallCorrelation: number;
  riskIndicators: {
    keyword: string;
    severity: 'low' | 'medium' | 'high';
    correlation: number;
  }[];
}

export function SocialMediaCorrelation() {
  const [data, setData] = useState<InfoDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/infodetection?limit=10');
      const result = await response.json();
      if (result.success) {
        setData(result);
        
        // Prepare chart data
        const chart = result.signals.slice(0, 7).map((signal: SocialMediaSignal, idx: number) => ({
          name: signal.keyword.substring(0, 15),
          mentions: signal.mentions,
          correlation: signal.correlation * 100,
          trend: signal.trend
        }));
        setChartData(chart);
      }
    } catch (error) {
      console.error('Failed to fetch social media data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 90000); // Update every 90s
    return () => clearInterval(interval);
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'google_trends': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'tiktok': return <BarChart3 className="w-4 h-4 text-pink-400" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <Twitter className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-blue-400">Social Media Epidemic Signals</h3>
      </div>

      {loading && !data ? (
        <div className="text-center py-8 text-gray-400">Analyzing social media trends...</div>
      ) : data && (
        <>
          {/* Overall Correlation */}
          <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Overall Correlation</div>
                <div className="text-3xl font-bold text-cyan-400">
                  {(data.overallCorrelation * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Signals Detected</div>
                <div className="text-2xl font-bold text-cyan-300">{data.signals.length}</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="mb-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="correlation"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    name="Correlation %"
                    dot={{ fill: '#06B6D4', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mentions"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Mentions"
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Risk Indicators */}
          {data.riskIndicators.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-cyan-300 mb-2">Risk Indicators</h4>
              <div className="space-y-2">
                {data.riskIndicators.map((indicator, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${getSeverityColor(indicator.severity)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">{indicator.keyword}</span>
                      </div>
                      <div className="text-sm">
                        Correlation: <span className="font-bold">{(indicator.correlation * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Signals */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {data.signals.slice(0, 5).map((signal, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(signal.platform)}
                    <span className="text-sm font-medium text-gray-300">{signal.keyword}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {signal.mentions.toLocaleString()} mentions
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{signal.location}</span>
                  <div className="flex items-center gap-3">
                    <span className={signal.trend > 0 ? 'text-red-400' : 'text-green-400'}>
                      {signal.trend > 0 ? '+' : ''}{signal.trend.toFixed(1)}%
                    </span>
                    <span className="text-cyan-400">
                      {(signal.correlation * 100).toFixed(0)}% corr.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={fetchData}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Refresh Analysis'}
      </button>
    </div>
  );
}

