import { HomeConfig } from './homeScrapper.config.js';

export const parseHot = (elements: Element[], config: HomeConfig['hot']) => {
  const { title, img, coverAttr, full } = config;

  return elements.map((a) => ({
    title: a.getAttribute(title) || '',
    url: a instanceof HTMLAnchorElement ? a.href : '',
    hasLabel: !!a.querySelector(full),
    cover: a.querySelector(img)?.getAttribute(coverAttr) || '',
  }));
};

export const parseLatest = (rows: Element[], config: HomeConfig['latest']) => {
  const { title, genre, chapter, newTag, updated } = config;

  return Array.from(rows).map((row) => ({
    title: row.querySelector(title)?.textContent?.trim() || '',
    url: row.querySelector(title)?.getAttribute('href') || '',
    isNew: !!row.querySelector(newTag),
    genres: Array.from(row.querySelectorAll(genre)).map(
      (g) => g.textContent?.trim() || '',
    ),
    latestChapter: {
      title: row.querySelector(chapter)?.textContent?.trim() || '',
      url: row.querySelector(chapter)?.getAttribute('href') || '',
    },
    updatedTime: row.querySelector(updated)?.textContent?.trim() || '',
  }));
};

export const parseCompleted = (
  elements: Element[],
  config: HomeConfig['completed'],
) => {
  const { title, img, coverAttr, chapterInfo } = config;

  return elements.map((a) => ({
    title: a.getAttribute(title) || '',
    url: a instanceof HTMLAnchorElement ? a.href : '',
    cover: a.querySelector(img)?.getAttribute(coverAttr) || '',
    chapterInfo: a.querySelector(chapterInfo)?.textContent?.trim() || '',
  }));
};

export const parseGenres = (
  elements: Element[],
  config: HomeConfig['genres'],
) => {
  const { title } = config;

  return elements.map((a) => ({
    text: a.getAttribute(title) || '',
    url: a instanceof HTMLAnchorElement ? a.href : '',
  }));
};

export const parseSorts = (
  elements: Element[],
  config: HomeConfig['sorts'],
) => {
  const { title } = config;

  return elements.map((a) => ({
    text: a.getAttribute(title) || '',
    url: a instanceof HTMLAnchorElement ? a.href : '',
  }));
};
