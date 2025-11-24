'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Trophy, Award, Shield, AlertTriangle, Droplets, TrendingUp, Users } from 'lucide-react';
import { MOCK_DISTRICTS } from '@/lib/mock-data';
import Link from 'next/link';

interface CommunityStats {
  district: string;
  waterQualityScore: number;
  level: number;
  badges: string[];
  alerts: number;
  participation: number;
}

export default function CommunityPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(MOCK_DISTRICTS[0].id);
  const [communityStats, setCommunityStats] = useState<CommunityStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate community stats for all districts
    const stats = MOCK_DISTRICTS.map(district => ({
      district: district.id,
      waterQualityScore: 60 + Math.random() * 40,
      level: Math.floor(1 + Math.random() * 10),
      badges: generateBadges(district.id),
      alerts: Math.floor(Math.random() * 5),
      participation: Math.floor(20 + Math.random() * 80)
    }));
    setCommunityStats(stats);
  }, []);

  const generateBadges = (districtId: string): string[] => {
    const allBadges = [
      'Early Adopter', 'Water Guardian', 'Data Contributor', 'Alert Responder',
      'Community Leader', 'Sensor Maintainer', 'Health Advocate', 'Clean Water Champion'
    ];
    const count = 2 + Math.floor(Math.random() * 4);
    return allBadges.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const currentStats = communityStats.find(s => s.district === selectedDistrict);
  const currentDistrict = MOCK_DISTRICTS.find(d => d.id === selectedDistrict);

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    if (level >= 5) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (level >= 3) return 'text-green-400 bg-green-500/10 border-green-500/30';
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0d1235] to-[#0a0e27]">
        <div className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 150, 255, 0.1) 0%, transparent 50%)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">Community Health Water Network</h1>
              <p className="text-gray-400">Track your region's water quality status and earn achievements</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* District Selector */}
          <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-4 backdrop-blur-xl">
            <label className="text-sm font-semibold text-cyan-300 mb-2 block">Select Your Region</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            >
              {MOCK_DISTRICTS.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}, {district.city}, {district.country}
                </option>
              ))}
            </select>
          </div>

          {currentStats && currentDistrict && (
            <>
              {/* Main Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Water Quality Score */}
                <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Droplets className="w-8 h-8 text-cyan-400" />
                    <div className={`text-3xl font-bold ${getScoreColor(currentStats.waterQualityScore)}`}>
                      {Math.round(currentStats.waterQualityScore)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-cyan-300 mb-2">Water Quality Score</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        currentStats.waterQualityScore >= 80 ? 'bg-green-500' :
                        currentStats.waterQualityScore >= 60 ? 'bg-yellow-500' :
                        currentStats.waterQualityScore >= 40 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${currentStats.waterQualityScore}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {currentStats.waterQualityScore >= 80 ? 'Excellent' :
                     currentStats.waterQualityScore >= 60 ? 'Good' :
                     currentStats.waterQualityScore >= 40 ? 'Fair' :
                     'Needs Attention'}
                  </div>
                </div>

                {/* Level & XP */}
                <div className={`rounded-lg border p-6 backdrop-blur-xl ${getLevelColor(currentStats.level)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8" />
                    <div className="text-3xl font-bold">Level {currentStats.level}</div>
                  </div>
                  <div className="text-sm font-semibold mb-2">Community Level</div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-current"
                      style={{ width: `${((currentStats.level % 1) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {Math.round((currentStats.level % 1) * 100)}% to next level
                  </div>
                </div>

                {/* Participation */}
                <div className="bg-gray-900/50 rounded-lg border border-green-500/30 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-green-400" />
                    <div className="text-3xl font-bold text-green-400">
                      {currentStats.participation}%
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-300 mb-2">Community Participation</div>
                  <div className="text-xs text-gray-400">
                    {currentDistrict.population.toLocaleString()} residents
                  </div>
                </div>
              </div>

              {/* Badges Section */}
              <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold text-yellow-400">Earned Badges</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentStats.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center"
                    >
                      <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-yellow-300">{badge}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts Section */}
              {currentStats.alerts > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <h2 className="text-xl font-semibold text-red-400">Active Alerts</h2>
                    <span className="px-3 py-1 bg-red-500/30 text-red-400 rounded-full text-sm font-semibold">
                      {currentStats.alerts}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: currentStats.alerts }).map((_, idx) => (
                      <div key={idx} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="text-sm font-semibold text-red-300">
                          Water Quality Alert #{idx + 1}
                        </div>
                        <div className="text-xs text-red-400/80 mt-1">
                          Action required: Check water source and follow safety guidelines
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leaderboard */}
              <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-cyan-400">Regional Leaderboard</h2>
                </div>
                <div className="space-y-2">
                  {communityStats
                    .sort((a, b) => b.waterQualityScore - a.waterQualityScore)
                    .slice(0, 5)
                    .map((stat, idx) => {
                      const district = MOCK_DISTRICTS.find(d => d.id === stat.district);
                      const isCurrent = stat.district === selectedDistrict;
                      return (
                        <div
                          key={stat.district}
                          className={`p-4 rounded-lg border ${
                            isCurrent
                              ? 'bg-cyan-500/20 border-cyan-500/50'
                              : 'bg-gray-800/50 border-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                idx === 0 ? 'bg-yellow-500/30 text-yellow-400' :
                                idx === 1 ? 'bg-gray-400/30 text-gray-300' :
                                idx === 2 ? 'bg-orange-500/30 text-orange-400' :
                                'bg-gray-700/30 text-gray-400'
                              }`}>
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-semibold">{district?.name}</div>
                                <div className="text-xs text-gray-400">{district?.city}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-cyan-400">
                                {Math.round(stat.waterQualityScore)}
                              </div>
                              <div className="text-xs text-gray-400">Score</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

