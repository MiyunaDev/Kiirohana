import { useState } from "react";
import { storage, StorageValue } from "../../utils/storage";

type SetStateAction<T> = T | ((prev: T) => T);

export function useLocalStorage<T extends StorageValue>(
  key: string,
  initialValue: T
): [T, (value: SetStateAction<T>) => void] {
  const [state, setState] = useState<T>(() => {
    const stored = storage.get<T>(key);
    return stored ?? initialValue;
  });

  const setValue = (value: SetStateAction<T>) => {
    setState((prev) => {
      const next =
        typeof value === "function"
          ? (value as (p: T) => T)(prev)
          : value;

      storage.set(key, next);
      return next;
    });
  };

  return [state, setValue]
}