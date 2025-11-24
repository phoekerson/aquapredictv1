import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface AnomalyAlert {
  id: string;
  type: 'unknown_pathogen' | 'chemical_spike' | 'pattern_anomaly' | 'sensor_failure' | 'unusual_flow';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    region: string;
    district: string;
  };
  detectedAt: string;
  description: string;
  confidence: number;
  recommendedActions: string[];
  relatedSensors: string[];
}

const ANOMALY_TYPES = [
  {
    type: 'unknown_pathogen' as const,
    description: 'Unknown pathogen signature detected',
    baseSeverity: 'high' as const
  },
  {
    type: 'chemical_spike' as const,
    description: 'Unusual chemical compound detected',
    baseSeverity: 'medium' as const
  },
  {
    type: 'pattern_anomaly' as const,
    description: 'Abnormal data pattern detected',
    baseSeverity: 'medium' as const
  },
  {
    type: 'sensor_failure' as const,
    description: 'Sensor reading inconsistency',
    baseSeverity: 'low' as const
  },
  {
    type: 'unusual_flow' as const,
    description: 'Unusual water flow pattern',
    baseSeverity: 'medium' as const
  }
];

const LOCATIONS = [
  { lat: 6.5244, lng: 3.3792, region: 'Lagos, Nigeria', district: 'Lagos Island' },
  { lat: -6.2088, lng: 106.8456, region: 'Jakarta, Indonesia', district: 'Jakarta Pusat' },
  { lat: 13.7563, lng: 100.5018, region: 'Bangkok, Thailand', district: 'Bangkok Noi' },
  { lat: 10.8231, lng: 106.6297, region: 'Ho Chi Minh, Vietnam', district: 'District 1' },
  { lat: 14.5995, lng: 120.9842, region: 'Manila, Philippines', district: 'Manila' },
];

function generateAnomaly(): AnomalyAlert {
  const anomalyType = ANOMALY_TYPES[Math.floor(Math.random() * ANOMALY_TYPES.length)];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  
  // Random severity escalation
  const severityRoll = Math.random();
  let severity = anomalyType.baseSeverity;
  if (severityRoll > 0.7 && anomalyType.baseSeverity !== 'critical') {
    const levels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const currentIndex = levels.indexOf(anomalyType.baseSeverity);
    severity = levels[Math.min(levels.length - 1, currentIndex + 1)];
  }

  const confidence = 0.6 + Math.random() * 0.35;

  const recommendedActions: string[] = [];
  if (severity === 'critical' || severity === 'high') {
    recommendedActions.push('Immediate investigation required');
    recommendedActions.push('Alert public health authorities');
  }
  if (anomalyType.type === 'unknown_pathogen') {
    recommendedActions.push('Isolate sample for laboratory analysis');
    recommendedActions.push('Increase monitoring frequency');
  }
  if (anomalyType.type === 'chemical_spike') {
    recommendedActions.push('Trace source of contamination');
    recommendedActions.push('Check upstream industrial activity');
  }

  const relatedSensors = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () =>
    `sensor-${Math.floor(Math.random() * 1000)}`
  );

  return {
    id: `anomaly-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: anomalyType.type,
    severity,
    location: {
      ...location,
      lat: location.lat + (Math.random() - 0.5) * 0.01,
      lng: location.lng + (Math.random() - 0.5) * 0.01
    },
    detectedAt: new Date().toISOString(),
    description: anomalyType.description,
    confidence: Math.round(confidence * 100) / 100,
    recommendedActions: recommendedActions.length > 0 ? recommendedActions : ['Continue monitoring'],
    relatedSensors
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const severity = searchParams.get('severity');

    // Simulate occasional anomalies (30% chance)
    const anomalies: AnomalyAlert[] = [];
    if (Math.random() > 0.7) {
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < Math.min(count, limit); i++) {
        anomalies.push(generateAnomaly());
      }
    }

    // Filter by severity if specified
    const filtered = severity
      ? anomalies.filter(a => a.severity === severity)
      : anomalies;

    return NextResponse.json({
      success: true,
      anomalies: filtered.slice(0, limit),
      totalDetected: filtered.length,
      lastScan: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to detect anomalies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sensorData, location } = body;

    // Simulate anomaly detection from sensor data
    await new Promise(resolve => setTimeout(resolve, 200));

    // 20% chance of detecting an anomaly
    if (Math.random() > 0.8) {
      const anomaly = generateAnomaly();
      if (location) {
        anomaly.location = { ...anomaly.location, ...location };
      }
      return NextResponse.json({
        success: true,
        anomalyDetected: true,
        anomaly
      });
    }

    return NextResponse.json({
      success: true,
      anomalyDetected: false,
      message: 'No anomalies detected'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze for anomalies' },
      { status: 500 }
    );
  }
}

