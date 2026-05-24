type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const sportsCache = new Map<string, CacheEntry<unknown>>();

export function getSportsCache<T>(key: string) {
  const cached = sportsCache.get(key);

  if (!cached || cached.expiresAt < Date.now()) {
    sportsCache.delete(key);
    return null;
  }

  return cached.value as T;
}

export function setSportsCache<T>(key: string, value: T, ttlMs = 60_000) {
  sportsCache.set(key, {
    expiresAt: Date.now() + ttlMs,
    value,
  });
}

export function clearSportsCache() {
  sportsCache.clear();
}
