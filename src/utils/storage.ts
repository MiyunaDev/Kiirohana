// utils/storage.ts
export type StorageValue =
  | string
  | number
  | boolean
  | object
  | null;

export const storage = {
  set<T extends StorageValue>(key: string, value: T | undefined): void {
    if (value === undefined) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify({
        type: typeof value,
        value,
      })
    );
  },

  get<T extends StorageValue>(
    key: string,
    fallback?: T
  ): T | undefined {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    try {
      const parsed = JSON.parse(raw);
      return parsed?.value ?? fallback;
    } catch {
      return fallback;
    }
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },
};