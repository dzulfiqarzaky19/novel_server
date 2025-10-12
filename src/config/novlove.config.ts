export const NOVLOVE_CONFIG = {
  home: {
    redis_key: 'novlove:home',
    ttl_seconds: 60 * 60,
  },
  sort: {
    redis_key: 'novlove:sort',
    ttl_seconds: 2 * 60 * 60,
  },
  genre: {
    redis_key: 'novlove:genre',
    ttl_seconds: 6 * 60 * 60,
  },
  list: {
    redis_key: 'novlove:list',
    ttl_seconds: 6 * 60 * 60,
  },
  detail: {
    redis_key: 'novlove:detail',
    ttl_seconds: 7 * 24 * 60 * 60,
  },
} as const;

export type NovloveConfig = typeof NOVLOVE_CONFIG;
