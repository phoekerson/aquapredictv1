import { NextRequest, NextResponse } from 'next/server';
import { simulateAntibioticResistance } from '@/lib/ai-simulators';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const resistanceData = simulateAntibioticResistance();

    return NextResponse.json({
      success: true,
      resistanceData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze antibiotic resistance' },
      { status: 500 }
    );
  }
}

