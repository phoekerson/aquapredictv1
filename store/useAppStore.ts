/**
 * Global State Management with Zustand
 */

import { create } from 'zustand';

export interface PathogenPrediction {
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
}

export interface RiskIndex {
  district: string;
  city: string;
  river: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface AnomalyAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  detectedAt: string;
  description: string;
}

interface AppState {
  // Pathogen predictions
  pathogenPredictions: PathogenPrediction[];
  addPathogenPrediction: (prediction: PathogenPrediction) => void;
  
  // Risk indices
  riskIndices: RiskIndex[];
  updateRiskIndices: (indices: RiskIndex[]) => void;
  
  // Anomalies
  anomalies: AnomalyAlert[];
  addAnomaly: (anomaly: AnomalyAlert) => void;
  removeAnomaly: (id: string) => void;
  
  // UI State
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;
  
  showMicrobialReservoir: boolean;
  setShowMicrobialReservoir: (show: boolean) => void;
  
  // Propagation simulation
  propagationDay: number;
  setPropagationDay: (day: number) => void;
  isPropagationPlaying: boolean;
  setIsPropagationPlaying: (playing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  pathogenPredictions: [],
  riskIndices: [],
  anomalies: [],
  selectedDistrict: null,
  showMicrobialReservoir: false,
  propagationDay: 0,
  isPropagationPlaying: false,

  // Actions
  addPathogenPrediction: (prediction) =>
    set((state) => ({
      pathogenPredictions: [prediction, ...state.pathogenPredictions].slice(0, 50)
    })),

  updateRiskIndices: (indices) =>
    set({ riskIndices: indices }),

  addAnomaly: (anomaly) =>
    set((state) => ({
      anomalies: [anomaly, ...state.anomalies].slice(0, 20)
    })),

  removeAnomaly: (id) =>
    set((state) => ({
      anomalies: state.anomalies.filter((a) => a.id !== id)
    })),

  setSelectedDistrict: (district) =>
    set({ selectedDistrict: district }),

  setShowMicrobialReservoir: (show) =>
    set({ showMicrobialReservoir: show }),

  setPropagationDay: (day) =>
    set({ propagationDay: day }),

  setIsPropagationPlaying: (playing) =>
    set({ isPropagationPlaying: playing })
}));

