import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface PathogenPrediction {
  virus: number;
  bacteria: number;
  toxin: number;
  parasite: number;
  timestamp: string;
  confidence: number;
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  recommendedActions: string[];
}

// Simulate AI model prediction
function simulatePathogenPrediction(sensorData: any): PathogenPrediction {
  // Simulate ML model outputs with realistic probabilities
  const baseVirus = Math.random() * 0.4;
  const baseBacteria = Math.random() * 0.5;
  const baseToxin = Math.random() * 0.3;
  const baseParasite = Math.random() * 0.2;

  // Normalize to sum to 1.0
  const total = baseVirus + baseBacteria + baseToxin + baseParasite;
  
  const virus = baseVirus / total;
  const bacteria = baseBacteria / total;
  const toxin = baseToxin / total;
  const parasite = baseParasite / total;

  // Determine primary threat
  const maxProb = Math.max(virus, bacteria, toxin, parasite);
  const confidence = maxProb * 0.85 + Math.random() * 0.15;

  // Generate recommendations based on predictions
  const recommendations: string[] = [];
  if (virus > 0.4) recommendations.push('Isolate water source');
  if (bacteria > 0.4) recommendations.push('Increase chlorination');
  if (toxin > 0.3) recommendations.push('Activate filtration system');
  if (parasite > 0.3) recommendations.push('Boil water advisory');
  if (maxProb > 0.6) recommendations.push('Alert public health authorities');

  return {
    virus: Math.round(virus * 100) / 100,
    bacteria: Math.round(bacteria * 100) / 100,
    toxin: Math.round(toxin * 100) / 100,
    parasite: Math.round(parasite * 100) / 100,
    timestamp: new Date().toISOString(),
    confidence: Math.round(confidence * 100) / 100,
    location: sensorData.location || {
      lat: 6.5244 + (Math.random() - 0.5) * 0.1,
      lng: 3.3792 + (Math.random() - 0.5) * 0.1,
      region: 'Lagos, Nigeria'
    },
    recommendedActions: recommendations.length > 0 ? recommendations : ['Continue monitoring']
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sensorId, sensorData } = body;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const prediction = simulatePathogenPrediction(sensorData || {});

    return NextResponse.json({
      success: true,
      prediction,
      sensorId: sensorId || 'sensor-' + Math.floor(Math.random() * 1000)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to predict pathogen' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sensorId = searchParams.get('sensorId') || 'default';

    // Generate mock prediction for GET requests
    const prediction = simulatePathogenPrediction({
      location: {
        lat: 6.5244,
        lng: 3.3792,
        region: 'Lagos, Nigeria'
      }
    });

    return NextResponse.json({
      success: true,
      prediction,
      sensorId
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to predict pathogen' },
      { status: 500 }
    );
  }
}

