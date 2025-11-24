import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface CalibrationStatus {
  sensorId: string;
  status: 'calibrating' | 'calibrated' | 'failed';
  sensitivity: number; // 0-100
  accuracy: number; // 0-100
  lastCalibration: string;
  nextCalibration: string;
  adjustments: {
    parameter: string;
    oldValue: number;
    newValue: number;
    reason: string;
  }[];
  confidence: number;
}

const SENSOR_PARAMETERS = [
  { name: 'pH_sensitivity', base: 50 },
  { name: 'turbidity_threshold', base: 30 },
  { name: 'pathogen_detection_sensitivity', base: 70 },
  { name: 'chemical_detection_range', base: 60 },
  { name: 'temperature_compensation', base: 40 }
];

function simulateCalibration(sensorId: string): CalibrationStatus {
  const isCalibrating = Math.random() > 0.5;
  const calibrationSuccess = Math.random() > 0.1; // 90% success rate

  const adjustments = SENSOR_PARAMETERS.map(param => {
    const oldValue = param.base + (Math.random() - 0.5) * 20;
    const adjustment = (Math.random() - 0.5) * 10; // Small adjustments
    const newValue = Math.max(0, Math.min(100, oldValue + adjustment));

    return {
      parameter: param.name,
      oldValue: Math.round(oldValue * 10) / 10,
      newValue: Math.round(newValue * 10) / 10,
      reason: adjustment > 0 
        ? 'Increased sensitivity due to environmental changes'
        : 'Decreased sensitivity to reduce false positives'
    };
  });

  const avgAccuracy = adjustments.reduce((sum, adj) => {
    const improvement = Math.abs(adj.newValue - adj.oldValue);
    return sum + (50 + improvement * 2);
  }, 0) / adjustments.length;

  const sensitivity = adjustments
    .find(a => a.parameter === 'pathogen_detection_sensitivity')?.newValue || 70;

  const now = new Date();
  const lastCalibration = isCalibrating 
    ? new Date(now.getTime() - 5 * 60000).toISOString() // 5 minutes ago
    : now.toISOString();
  
  const nextCalibration = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24h from now

  return {
    sensorId,
    status: isCalibrating 
      ? 'calibrating' as const
      : calibrationSuccess 
        ? 'calibrated' as const 
        : 'failed' as const,
    sensitivity: Math.round(sensitivity),
    accuracy: Math.round(Math.min(100, avgAccuracy)),
    lastCalibration,
    nextCalibration,
    adjustments,
    confidence: calibrationSuccess ? 0.85 + Math.random() * 0.15 : 0.3 + Math.random() * 0.2
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sensorId = searchParams.get('sensorId') || `sensor-${Math.floor(Math.random() * 1000)}`;

    const calibration = simulateCalibration(sensorId);

    return NextResponse.json({
      success: true,
      calibration
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get calibration status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sensorId, trigger } = body;

    const id = sensorId || `sensor-${Math.floor(Math.random() * 1000)}`;

    // Simulate calibration process
    await new Promise(resolve => setTimeout(resolve, 1000));

    const calibration = simulateCalibration(id);
    calibration.status = 'calibrating';

    // After a delay, complete calibration
    setTimeout(() => {
      calibration.status = 'calibrated';
    }, 2000);

    return NextResponse.json({
      success: true,
      message: 'Calibration initiated',
      calibration
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to initiate calibration' },
      { status: 500 }
    );
  }
}

