/**
 * AI Simulator Utilities
 * Simulates various AI models for pathogen detection, risk assessment, etc.
 */

export interface PathogenData {
  virus: number;
  bacteria: number;
  toxin: number;
  parasite: number;
}

export interface SensorReading {
  sensorId: string;
  timestamp: string;
  pH: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  conductivity: number;
  location: {
    lat: number;
    lng: number;
    region: string;
  };
}

/**
 * Simulate pathogen detection from sensor readings
 */
export function simulatePathogenDetection(reading: SensorReading): PathogenData {
  // Simulate ML model that predicts pathogen types
  const baseVirus = Math.max(0, (reading.pH - 6.5) * 10 + (reading.turbidity - 5) * 2);
  const baseBacteria = Math.max(0, (reading.temperature - 20) * 2 + reading.turbidity * 3);
  const baseToxin = Math.max(0, (reading.conductivity - 500) / 10);
  const baseParasite = Math.max(0, (reading.turbidity - 3) * 5);

  // Normalize
  const total = baseVirus + baseBacteria + baseToxin + baseParasite || 1;
  
  return {
    virus: Math.round((baseVirus / total) * 100) / 100,
    bacteria: Math.round((baseBacteria / total) * 100) / 100,
    toxin: Math.round((baseToxin / total) * 100) / 100,
    parasite: Math.round((baseParasite / total) * 100) / 100
  };
}

/**
 * Generate mock sensor reading
 */
export function generateMockSensorReading(sensorId: string, region: string): SensorReading {
  return {
    sensorId,
    timestamp: new Date().toISOString(),
    pH: 6.5 + (Math.random() - 0.5) * 2,
    turbidity: 5 + Math.random() * 10,
    temperature: 20 + Math.random() * 15,
    dissolvedOxygen: 5 + Math.random() * 5,
    conductivity: 400 + Math.random() * 400,
    location: {
      lat: 6.5244 + (Math.random() - 0.5) * 0.1,
      lng: 3.3792 + (Math.random() - 0.5) * 0.1,
      region
    }
  };
}

/**
 * Calculate risk score from multiple factors
 */
export function calculateRiskScore(factors: {
  pathogenLevel: number;
  pollutionLevel: number;
  populationDensity: number;
  infrastructureQuality: number;
}): number {
  return Math.round(
    factors.pathogenLevel * 0.3 +
    factors.pollutionLevel * 0.25 +
    (100 - factors.infrastructureQuality) * 0.25 +
    factors.populationDensity * 0.2
  );
}

/**
 * Simulate antibiotic resistance detection
 */
export interface AntibioticResistance {
  antibiotic: string;
  resistanceLevel: number; // 0-100
  geneDetected: string;
  prevalence: number; // percentage
}

export function simulateAntibioticResistance(): AntibioticResistance[] {
  const antibiotics = [
    'Penicillin', 'Tetracycline', 'Chloramphenicol', 'Ciprofloxacin', 'Amoxicillin'
  ];
  const resistanceGenes = [
    'blaTEM-1', 'tetA', 'catA1', 'gyrA', 'ampC'
  ];

  return antibiotics.map((antibiotic, index) => ({
    antibiotic,
    resistanceLevel: Math.round(20 + Math.random() * 60),
    geneDetected: resistanceGenes[index] || 'unknown',
    prevalence: Math.round(5 + Math.random() * 40)
  }));
}

/**
 * Simulate chemical/pollution detection
 */
export interface ChemicalThreat {
  chemical: string;
  concentration: number; // ppm
  threshold: number; // safe threshold
  source: 'industrial' | 'agricultural' | 'unknown';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function simulateChemicalThreats(): ChemicalThreat[] {
  const chemicals = [
    { name: 'Lead (Pb)', threshold: 0.015, source: 'industrial' as const },
    { name: 'Mercury (Hg)', threshold: 0.002, source: 'industrial' as const },
    { name: 'Arsenic (As)', threshold: 0.01, source: 'industrial' as const },
    { name: 'Atrazine', threshold: 0.003, source: 'agricultural' as const },
    { name: 'Glyphosate', threshold: 0.7, source: 'agricultural' as const }
  ];

  return chemicals.map(chem => {
    const concentration = chem.threshold * (0.5 + Math.random() * 2);
    const ratio = concentration / chem.threshold;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (ratio < 0.5) riskLevel = 'low';
    else if (ratio < 1) riskLevel = 'medium';
    else if (ratio < 2) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      chemical: chem.name,
      concentration: Math.round(concentration * 10000) / 10000,
      threshold: chem.threshold,
      source: chem.source,
      riskLevel
    };
  });
}

