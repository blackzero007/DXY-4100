const STORAGE_KEY_PREFIX = 'tarot_app_';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(STORAGE_KEY_PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};
