import {
  toAbsolute,
  toPath,
  slugFromPath,
  chapterSlugFromPath,
} from '../url.js';

import type {
  HotNovel,
  LatestNovel,
  CompletedNovel,
  NormalizedHotNovel,
  NormalizedLatestNovel,
  NormalizedCompletedNovel,
  list,
  NormalizedList,
} from './homeScrapper.models.js';

export const normalizeHot = (hotNovels: HotNovel[]): NormalizedHotNovel[] =>
  hotNovels.map((hot) => {
    const path = toPath(hot.url);

    return {
      ...hot,
      hasLabel: hot.hasLabel,
      absoluteUrl: toAbsolute(hot.url),
      path,
      slug: slugFromPath(path),
      coverAbsoluteUrl: toAbsolute(hot.cover),
    };
  });

export const normalizeLatest = (
  latestNovels: LatestNovel[],
): NormalizedLatestNovel[] =>
  latestNovels.map((latest) => {
    const novelPath = toPath(latest.url);
    const chapterPath = toPath(latest.latestChapter.url);

    return {
      title: latest.title,
      absoluteUrl: toAbsolute(latest.url),
      path: novelPath,
      slug: slugFromPath(novelPath),
      isNew: latest.isNew,
      genres: latest.genres,
      latestChapter: {
        title: latest.latestChapter.title,
        absoluteUrl: toAbsolute(latest.latestChapter.url),
        path: chapterPath,
        chapterSlug: chapterSlugFromPath(chapterPath),
      },
      updatedTime: latest.updatedTime,
    };
  });

export const normalizeCompleted = (
  completedNovels: CompletedNovel[],
): NormalizedCompletedNovel[] =>
  completedNovels.map((completed) => {
    const path = toPath(completed.url);

    return {
      title: completed.title,
      absoluteUrl: toAbsolute(completed.url),
      path,
      slug: slugFromPath(path),
      coverAbsoluteUrl: toAbsolute(completed.cover),
      chapterInfo: completed.chapterInfo,
    };
  });

export const normalizedGenres = (genres: list[]): NormalizedList[] =>
  genres.map((genre) => ({
    text: genre.text,
    absoluteUrl: toAbsolute(genre.url),
    path: toPath(genre.url),
  }));

export const normalizedSorts = (sorts: list[]): NormalizedList[] =>
  sorts.map((sort) => ({
    text: sort.text,
    absoluteUrl: toAbsolute(sort.url),
    path: toPath(sort.url),
  }));
