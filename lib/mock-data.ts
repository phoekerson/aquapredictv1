/**
 * Mock Data Generators
 * Provides realistic mock data for development and simulation
 */

export interface District {
  id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  coordinates: { lat: number; lng: number };
  population: number;
  waterSources: string[];
}

export const MOCK_DISTRICTS: District[] = [
  {
    id: 'lagos-island',
    name: 'Lagos Island',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'West Africa',
    coordinates: { lat: 6.5244, lng: 3.3792 },
    population: 1500000,
    waterSources: ['Lagos Lagoon', 'Groundwater']
  },
  {
    id: 'jakarta-pusat',
    name: 'Jakarta Pusat',
    city: 'Jakarta',
    country: 'Indonesia',
    region: 'Southeast Asia',
    coordinates: { lat: -6.2088, lng: 106.8456 },
    population: 900000,
    waterSources: ['Ciliwung River', 'Groundwater']
  },
  {
    id: 'bangkok-noi',
    name: 'Bangkok Noi',
    city: 'Bangkok',
    country: 'Thailand',
    region: 'Southeast Asia',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    population: 1200000,
    waterSources: ['Chao Phraya River', 'Canals']
  },
  {
    id: 'hcm-district1',
    name: 'District 1',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    region: 'Southeast Asia',
    coordinates: { lat: 10.8231, lng: 106.6297 },
    population: 200000,
    waterSources: ['Saigon River', 'Groundwater']
  },
  {
    id: 'manila',
    name: 'Manila',
    city: 'Manila',
    country: 'Philippines',
    region: 'Southeast Asia',
    coordinates: { lat: 14.5995, lng: 120.9842 },
    population: 1800000,
    waterSources: ['Pasig River', 'Laguna Lake']
  },
  {
    id: 'kinshasa',
    name: 'Kinshasa',
    city: 'Kinshasa',
    country: 'DRC',
    region: 'Central Africa',
    coordinates: { lat: -4.4419, lng: 15.2663 },
    population: 17000000,
    waterSources: ['Congo River', 'Groundwater']
  },
  {
    id: 'cairo',
    name: 'Cairo',
    city: 'Cairo',
    country: 'Egypt',
    region: 'North Africa',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    population: 10000000,
    waterSources: ['Nile River', 'Groundwater']
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'East Africa',
    coordinates: { lat: -1.2921, lng: 36.8219 },
    population: 4700000,
    waterSources: ['Nairobi River', 'Dams']
  }
];

export interface Sensor {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  district: string;
  status: 'active' | 'maintenance' | 'offline';
  lastReading: string;
  type: 'water_quality' | 'pathogen' | 'chemical' | 'flow';
}

export function generateMockSensors(districtId: string, count: number = 5): Sensor[] {
  const district = MOCK_DISTRICTS.find(d => d.id === districtId) || MOCK_DISTRICTS[0];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `sensor-${districtId}-${i + 1}`,
    name: `Sensor ${i + 1} - ${district.name}`,
    location: {
      lat: district.coordinates.lat + (Math.random() - 0.5) * 0.05,
      lng: district.coordinates.lng + (Math.random() - 0.5) * 0.05
    },
    district: district.name,
    status: Math.random() > 0.1 ? 'active' as const : Math.random() > 0.5 ? 'maintenance' as const : 'offline' as const,
    lastReading: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    type: ['water_quality', 'pathogen', 'chemical', 'flow'][Math.floor(Math.random() * 4)] as any
  }));
}

export interface PropagationData {
  day: number;
  affectedAreas: {
    lat: number;
    lng: number;
    intensity: number; // 0-1
    radius: number; // km
  }[];
}

export function generatePropagationData(
  origin: { lat: number; lng: number },
  days: number = 30
): PropagationData[] {
  const data: PropagationData[] = [];
  
  for (let day = 0; day <= days; day++) {
    const affectedAreas = [];
    const spreadRadius = day * 2; // km per day
    const intensity = Math.min(1, 0.3 + (day / days) * 0.7);
    
    // Main origin
    affectedAreas.push({
      lat: origin.lat,
      lng: origin.lng,
      intensity,
      radius: spreadRadius
    });

    // Simulate downstream spread
    if (day > 3) {
      const downstreamCount = Math.floor(day / 3);
      for (let i = 0; i < downstreamCount; i++) {
        affectedAreas.push({
          lat: origin.lat + (Math.random() - 0.5) * (spreadRadius / 111),
          lng: origin.lng + Math.random() * (spreadRadius / 111),
          intensity: intensity * (0.5 + Math.random() * 0.3),
          radius: spreadRadius * (0.3 + Math.random() * 0.4)
        });
      }
    }

    data.push({ day, affectedAreas });
  }

  return data;
}

