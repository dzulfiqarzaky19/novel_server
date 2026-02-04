export type ListNovel = {
  title: string;
  url: string;
  author: string;
  cover: string;
  latestChapter: {
    title: string;
    url: string;
  };
};

export type NormalizedListNovel = {
  title: string;
  author: string;

  absoluteUrl: string;
  path: string;
  slug: string;

  coverAbsoluteUrl: string;

  latestChapter: {
    title: string;
    absoluteUrl: string;
    path: string;
    chapterSlug: string;
  };
};
