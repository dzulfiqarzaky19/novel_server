export type HotNovel = {
  title: string;
  url: string;
  cover: string;
  hasLabel: boolean;
};

export type LatestNovel = {
  title: string;
  url: string;
  isNew: boolean;
  genres: string[];
  latestChapter: { title: string; url: string };
  updatedTime: string;
};

export type CompletedNovel = {
  title: string;
  url: string;
  cover: string;
  chapterInfo: string;
};

export type list = {
  text: string;
  url: string;
};

// Normalized shapes you’ll return from API
export type NormalizedHotNovel = HotNovel & {
  absoluteUrl: string;
  path: string;
  slug: string;
  coverAbsoluteUrl: string;
};

export type NormalizedLatestNovel = {
  title: string;
  absoluteUrl: string;
  path: string;
  slug: string;
  isNew: boolean;
  genres: string[];
  latestChapter: {
    title: string;
    absoluteUrl: string;
    path: string;
    chapterSlug: string;
  };
  updatedTime: string;
};

export type NormalizedCompletedNovel = {
  title: string;
  absoluteUrl: string;
  path: string;
  slug: string;
  coverAbsoluteUrl: string;
  chapterInfo: string;
};

export type NormalizedList = Pick<list, 'text'> & {
  absoluteUrl: string;
  path: string;
};
