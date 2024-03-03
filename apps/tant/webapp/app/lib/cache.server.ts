import {
  Cache,
  CacheEntry,
  CachifiedOptions,
  cachified,
  totalTtl,
} from "@epic-web/cachified";

import { LRUCache } from "lru-cache";

/* lru cache is not part of this package but a simple non-persistent cache */
const lruInstance = new LRUCache<string, CacheEntry>({ max: 1000 });

const lru: Cache = {
  set(key, value) {
    const ttl = totalTtl(value?.metadata);
    return lruInstance.set(key, value, {
      ttl: ttl === Infinity ? undefined : ttl,
      start: value?.metadata?.createdTime,
    });
  },
  get(key) {
    return lruInstance.get(key);
  },
  delete(key) {
    return lruInstance.delete(key);
  },
};

export function withCache<Value>(
  keyOrArrayOfKeys: string | string[],
  fn: () => Promise<Value>,
  options: Omit<CachifiedOptions<Value>, "cache" | "key" | "getFreshValue">
) {
  const key = Array.isArray(keyOrArrayOfKeys)
    ? keyOrArrayOfKeys.join(":")
    : keyOrArrayOfKeys;

  return cachified({
    ...options,
    cache: lru,
    key,
    getFreshValue: () => {
      console.log("getting fresh value for key: ", key);
      return fn();
    },
  });
}

export function bust(keyOrArrayOfKeys: string | string[]) {
  const key = Array.isArray(keyOrArrayOfKeys)
    ? keyOrArrayOfKeys.join(":")
    : keyOrArrayOfKeys;

  lru.delete(key);
}
