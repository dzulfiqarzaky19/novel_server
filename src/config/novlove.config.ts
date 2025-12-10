const REDIS_TIME_CONFIG = {
  anHour: 60 * 60,
  twoHours: 2 * 60 * 60,
  sixHours: 6 * 60 * 60,
  sixDays: 6 * 60 * 60,
  sevenDays: 7 * 24 * 60 * 60,
};

export const NOVLOVE_CONFIG = {
  home: {
    redis_key: 'novlove:home',
    ttl_seconds: REDIS_TIME_CONFIG.anHour,
  },
  sort: {
    redis_key: 'novlove:sort',
    ttl_seconds: REDIS_TIME_CONFIG.twoHours,
  },
  genre: {
    redis_key: 'novlove:genre',
    ttl_seconds: REDIS_TIME_CONFIG.sixHours,
  },
  list: {
    redis_key: 'novlove:list',
    ttl_seconds: REDIS_TIME_CONFIG.sixDays,
  },
  detail: {
    redis_key: 'novlove:detail',
    ttl_seconds: REDIS_TIME_CONFIG.sevenDays,
  },
} as const;

export type NovloveConfig = typeof NOVLOVE_CONFIG;
