// Safe localStorage wrapper to prevent SecurityError crashes in restricted iframe/sandboxed environments
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage is blocked or unavailable in this environment:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage is blocked or unavailable in this environment:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage is blocked or unavailable in this environment:', e);
    }
  }
};
