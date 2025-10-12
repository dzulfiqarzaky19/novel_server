import {
  chapterSlugFromPath,
  slugFromPath,
  toAbsolute,
  toPath,
} from '../url.js';
import {
  ReturnTypeOfParseAuthorNovels,
  ReturnTypeOfParseChapters,
  ReturnTypeOfParseCover,
  ReturnTypeOfParseDescription,
  ReturnTypeOfParseDetail,
  ReturnTypeOfParseLatestChapter,
} from './detailScrapper.parser.js';

export const normalizeDetail = (raws: ReturnTypeOfParseDetail) => {
  const raw = raws[0];

  if (!raw) {
    return [];
  }

  return {
    title: raw.title,
    rating: {
      value: parseFloat(raw.rating.value) || 0,
      count: parseInt(raw.rating.count, 10) || 0,
    },
    alternateNames: raw.alternateNames.split(',').map((s) => s.trim()),
    author: {
      name: raw.author.name,
      absoluteUrl: toAbsolute(raw.author.url),
      path: toPath(raw.author.url),
      slug: slugFromPath(toPath(raw.author.url)),
    },
    genres: Array.from(raw.genres)?.map((g) => ({
      name: g.name,
      absoluteUrl: g.url,
      path: toPath(g.url),
      slug: slugFromPath(toPath(g.url)),
    })),
    status: {
      text: raw.status.text,
      absoluteUrl: raw.status.url,
      path: toPath(raw.status.url),
      slug: slugFromPath(toPath(raw.status.url)),
    },
    publishers: raw.publishers,
    tags: Array.from(raw.tags).map((el) => ({
      name: el.name,
      absoluteUrl: el.url,
      path: toPath(el.url),
      slug: slugFromPath(toPath(el.url)),
    })),
    year: {
      text: raw.year.text,
      absoluteUrl: raw.year.url,
      path: toPath(raw.year.url),
      slug: slugFromPath(toPath(raw.year.url)),
    },
  };
};

export const normalizeLatestChapter = (
  raws: ReturnTypeOfParseLatestChapter,
) => {
  return raws.map((raw) => ({
    title: raw.title,
    absoluteUrl: raw.url,
    path: toPath(raw.url),
    slug: slugFromPath(toPath(raw.url)),
    chapterSlug: chapterSlugFromPath(toPath(raw.url)),
    released: raw.released,
  }));
};

export const normalizeDescription = (raws: ReturnTypeOfParseDescription) => {
  return raws.map((raw) => raw);
};

export const normalizeChapters = (raws: ReturnTypeOfParseChapters) => {
  const raw = raws[0];

  if (!raw) {
    return [];
  }

  return raw.map((r) => ({
    title: r.title,
    absoluteUrl: r.url,
    path: toPath(r.url),
    slug: slugFromPath(toPath(r.url)),
    chapterSlug: chapterSlugFromPath(toPath(r.url)),
  }));
};

export const normalizeAuthorNovels = (raws: ReturnTypeOfParseAuthorNovels) => {
  const raw = raws[0];

  if (!raw) {
    return [];
  }

  return raw.map((r) => ({
    title: r.title,
    absoluteUrl: r.url,
    path: toPath(r.url),
    slug: slugFromPath(toPath(r.url)),
    cover: {
      absoluteUrl: r.cover,
      path: toPath(r.cover),
      slug: slugFromPath(toPath(r.cover)),
    },
    chapter: {
      status: r.chapter.split('-\n')[0]?.trim(),
      chapter: r.chapter.split('-\n')[1]?.trim(),
    },
  }));
};

export const normalizeCover = (raws: ReturnTypeOfParseCover) => {
  return raws.map((raw) => ({
    absoluteUrl: toAbsolute(raw.url),
    path: toPath(raw.url),
    slug: slugFromPath(toPath(raw.url)),
  }));
};
