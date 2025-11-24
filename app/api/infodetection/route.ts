import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface SocialMediaSignal {
  platform: 'twitter' | 'google_trends' | 'tiktok';
  keyword: string;
  mentions: number;
  trend: number; // percentage change
  correlation: number; // 0-1 correlation with water quality data
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
  recommendations: string[];
}

const KEYWORDS = [
  'water quality', 'waterborne disease', 'diarrhea', 'cholera',
  'water contamination', 'sick from water', 'water crisis',
  'polluted water', 'water treatment', 'boil water'
];

const PLATFORMS: ('twitter' | 'google_trends' | 'tiktok')[] = ['twitter', 'google_trends', 'tiktok'];

const LOCATIONS = [
  'Lagos, Nigeria',
  'Jakarta, Indonesia',
  'Bangkok, Thailand',
  'Ho Chi Minh, Vietnam',
  'Manila, Philippines',
  'Kinshasa, DRC',
  'Cairo, Egypt',
  'Nairobi, Kenya'
];

function generateSocialMediaSignal(): SocialMediaSignal {
  const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
  const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

  // Simulate realistic social media metrics
  const baseMentions = platform === 'twitter' ? 100 : platform === 'tiktok' ? 500 : 1000;
  const mentions = Math.floor(baseMentions * (0.5 + Math.random()));
  const trend = (Math.random() - 0.3) * 200; // -30% to +170%
  
  // Correlation with water quality (higher for health-related keywords)
  const healthKeywords = ['waterborne disease', 'diarrhea', 'cholera', 'sick from water'];
  const baseCorrelation = healthKeywords.includes(keyword) ? 0.6 : 0.3;
  const correlation = baseCorrelation + (Math.random() - 0.5) * 0.3;

  return {
    platform,
    keyword,
    mentions,
    trend: Math.round(trend * 10) / 10,
    correlation: Math.round(correlation * 100) / 100,
    location,
    timestamp: new Date().toISOString()
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Generate signals
    const signals: SocialMediaSignal[] = [];
    const signalCount = 5 + Math.floor(Math.random() * 10);

    for (let i = 0; i < signalCount; i++) {
      let signal = generateSocialMediaSignal();
      
      if (location) {
        signal.location = location;
      }
      if (platform && signal.platform === platform) {
        signals.push(signal);
      } else if (!platform) {
        signals.push(signal);
      }
    }

    // Calculate overall correlation
    const avgCorrelation = signals.length > 0
      ? signals.reduce((sum, s) => sum + s.correlation, 0) / signals.length
      : 0;

    // Identify risk indicators (high correlation + high mentions)
    const riskIndicators = signals
      .filter(s => s.correlation > 0.5 && s.mentions > 200)
      .map(s => ({
        keyword: s.keyword,
        severity: s.correlation > 0.7 ? 'high' as const : s.correlation > 0.6 ? 'medium' as const : 'low' as const,
        correlation: s.correlation
      }))
      .slice(0, 5);

    // Generate recommendations
    const recommendations: string[] = [];
    if (avgCorrelation > 0.6) {
      recommendations.push('High correlation detected - investigate water quality in affected regions');
    }
    if (riskIndicators.length > 0) {
      recommendations.push('Monitor social media trends for early warning signals');
      recommendations.push('Consider public health communication campaign');
    }
    if (signals.some(s => s.keyword.includes('cholera') || s.keyword.includes('diarrhea'))) {
      recommendations.push('Alert: Health-related keywords trending - activate response protocol');
    }

    const result: InfoDetectionResult = {
      signals: signals.slice(0, limit),
      overallCorrelation: Math.round(avgCorrelation * 100) / 100,
      riskIndicators,
      recommendations: recommendations.length > 0 ? recommendations : ['Continue monitoring']
    };

    return NextResponse.json({
      success: true,
      ...result,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze social media signals' },
      { status: 500 }
    );
  }
}

