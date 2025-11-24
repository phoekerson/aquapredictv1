import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface RiskIndex {
  district: string;
  city: string;
  river: string;
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    pathogenLevel: number;
    pollutionLevel: number;
    populationDensity: number;
    infrastructureQuality: number;
    historicalIncidents: number;
  };
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
}

// Southeast Asia and Africa regions
const REGIONS = [
  { district: 'Lagos Island', city: 'Lagos', river: 'Lagos Lagoon', country: 'Nigeria' },
  { district: 'Jakarta Pusat', city: 'Jakarta', river: 'Ciliwung', country: 'Indonesia' },
  { district: 'Bangkok Noi', city: 'Bangkok', river: 'Chao Phraya', country: 'Thailand' },
  { district: 'Ho Chi Minh 1', city: 'Ho Chi Minh', river: 'Saigon', country: 'Vietnam' },
  { district: 'Manila', city: 'Manila', river: 'Pasig', country: 'Philippines' },
  { district: 'Kinshasa', city: 'Kinshasa', river: 'Congo', country: 'DRC' },
  { district: 'Cairo', city: 'Cairo', river: 'Nile', country: 'Egypt' },
  { district: 'Nairobi', city: 'Nairobi', river: 'Nairobi', country: 'Kenya' },
];

function calculateRiskIndex(region: any): RiskIndex {
  const pathogenLevel = Math.random() * 100;
  const pollutionLevel = Math.random() * 100;
  const populationDensity = 50 + Math.random() * 50;
  const infrastructureQuality = 30 + Math.random() * 50;
  const historicalIncidents = Math.random() * 100;

  // Weighted risk calculation
  const riskScore = Math.round(
    pathogenLevel * 0.3 +
    pollutionLevel * 0.25 +
    (100 - infrastructureQuality) * 0.2 +
    populationDensity * 0.15 +
    historicalIncidents * 0.1
  );

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore < 30) riskLevel = 'low';
  else if (riskScore < 50) riskLevel = 'medium';
  else if (riskScore < 75) riskLevel = 'high';
  else riskLevel = 'critical';

  const trends: ('increasing' | 'stable' | 'decreasing')[] = ['increasing', 'stable', 'decreasing'];
  const trend = trends[Math.floor(Math.random() * trends.length)];

  return {
    district: region.district,
    city: region.city,
    river: region.river,
    riskScore: Math.min(100, Math.max(0, riskScore)),
    riskLevel,
    factors: {
      pathogenLevel: Math.round(pathogenLevel),
      pollutionLevel: Math.round(pollutionLevel),
      populationDensity: Math.round(populationDensity),
      infrastructureQuality: Math.round(infrastructureQuality),
      historicalIncidents: Math.round(historicalIncidents)
    },
    trend,
    lastUpdated: new Date().toISOString()
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const district = searchParams.get('district');
    const city = searchParams.get('city');
    const river = searchParams.get('river');

    if (district || city || river) {
      // Return specific region
      const region = REGIONS.find(r => 
        r.district === district || r.city === city || r.river === river
      ) || REGIONS[0];
      
      const riskIndex = calculateRiskIndex(region);
      return NextResponse.json({
        success: true,
        riskIndex
      });
    }

    // Return all regions
    const riskIndices = REGIONS.map(region => calculateRiskIndex(region));

    return NextResponse.json({
      success: true,
      riskIndices,
      globalAverage: Math.round(
        riskIndices.reduce((sum, r) => sum + r.riskScore, 0) / riskIndices.length
      )
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to calculate risk index' },
      { status: 500 }
    );
  }
}

