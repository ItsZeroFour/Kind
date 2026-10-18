import "server-only";

export function createLimiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();

  function recent(key: string, now: number) {
    const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (list.length) hits.set(key, list);
    else hits.delete(key);
    return list;
  }

  function sweep(now: number) {
    if (hits.size < 5000) return;
    for (const key of hits.keys()) recent(key, now);
  }

  return {
    isLimited(key: string) {
      return recent(key, Date.now()).length >= max;
    },
    hit(key: string) {
      const now = Date.now();
      sweep(now);
      hits.set(key, [...recent(key, now), now]);
    },
  };
}
