import { useState, useEffect } from 'react';
import { Post } from './types';

export interface StoreType {
  currentView: string;
  selectedCollection: string;
  searchKeyword: string;
  adminOpen: boolean;
  selectedPost: Post | null;
}

let storeState: StoreType = {
  currentView: 'home',
  selectedCollection: 'all',
  searchKeyword: '',
  adminOpen: false,
  selectedPost: null,
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
