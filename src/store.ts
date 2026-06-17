import { useState, useEffect } from 'react';
import { Post } from './types';

export interface StoreType {
  currentView: string;
  selectedCollection: string;
  searchKeyword: string;
  selectedPost: Post | null;
  sortBy?: 'date' | 'deadline';
  selectedQualification?: string;
  selectedState?: string;
  selectedSector?: string;
  currentFilter?: 'all' | 'saved';
  showVacancyGauge?: boolean;
  systemNotification?: {
    message: string;
    type: 'info' | 'success' | 'warning';
    id: number;
    timestamp?: number;
  } | null;
  notificationHistory?: Array<{
    message: string;
    type: 'info' | 'success' | 'warning';
    id: number;
    timestamp: number;
  }>;
  unreadNotificationCount?: number;
  lastViewedNotificationId?: number;
  isNotificationPanelOpen?: boolean;
  // Dynamic design elements for the H1 Logo heading
  logoFont?: string;
  logoWeight1?: string; // Font weight for 'Sarkari'
  logoWeight2?: string; // Font weight for 'Board'
  logoLetterSpacing?: string; // e.g. tracking-tighter, tracking-normal, tracking-wide
  logoCase?: 'uppercase' | 'none' | 'capitalize';
  logoColorStyle?: 'saffron-green' | 'ochre' | 'gold' | 'monochrome' | 'royal-white';
}

let storeState: StoreType = {
  currentView: 'home',
  selectedCollection: 'all',
  searchKeyword: '',
  selectedPost: null,
  sortBy: 'date',
  selectedQualification: 'all',
  selectedState: 'all',
  selectedSector: 'all',
  currentFilter: 'all',
  showVacancyGauge: false,
  systemNotification: null,
  notificationHistory: [],
  unreadNotificationCount: 0,
  lastViewedNotificationId: parseInt(localStorage.getItem('lastViewedNotificationId') || '0', 10),
  isNotificationPanelOpen: false,
  // Default design values matching the original government board logo-type
  logoFont: 'Inter',
  logoWeight1: 'font-medium',
  logoWeight2: 'font-black',
  logoLetterSpacing: 'tracking-tighter',
  logoCase: 'uppercase',
  logoColorStyle: 'saffron-green',
};

const listeners = new Set<(state: StoreType) => void>();

export const portalStore = {
  get: () => storeState,
  set: (next: Partial<StoreType>) => {
    storeState = { ...storeState, ...next };
    listeners.forEach(l => l(storeState));
  },
  subscribe: (l: (state: StoreType) => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }
};

export function usePortalStore() {
  const [state, setState] = useState<StoreType>(storeState);
  useEffect(() => {
    return portalStore.subscribe(setState);
  }, []);
  return [state, portalStore.set] as const;
}
