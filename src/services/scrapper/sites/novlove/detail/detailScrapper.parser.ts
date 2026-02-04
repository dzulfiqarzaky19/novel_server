import { DetailConfig } from './detailScrapper.config.js';

export const parseDetail = (
  elements: Element[],
  config: DetailConfig['detail'],
) => {
  const { title, rating, tags } = config;

  return elements.map((root) => {
    const titleText = root.querySelector(title)?.textContent?.trim() || '';
    const ratingValue =
      root.querySelector(rating.value)?.textContent?.trim() || '';
    const ratingCount =
      root.querySelector(rating.count)?.textContent?.trim() || '';

    const altLi = document.evaluate(
      config.alternateNames,
      root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;
    const altH3 = altLi?.querySelector('h3');
    const alternateNames = altLi
      ? (altLi.textContent || '').replace(altH3?.textContent || '', '').trim()
      : '';

    const authLi = document.evaluate(
      config.author,
      root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;
    const authorA = authLi?.querySelector('a');

    const genreLi = document.evaluate(
      config.genres,
      root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;
    const genresArr = Array.from(genreLi?.querySelectorAll('a') || []).map(
      (g) => ({
        name: g.textContent?.trim() || '',
        url: g.getAttribute('href') || '',
      }),
    );

    const statusLi = document.evaluate(
      config.status,
      root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;
    const statusA = statusLi?.querySelector('a');

    const publishersLi = document.evaluate(
      config.publishers,
      root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;
    const publishersH3 = publishersLi?.querySelector('h3');
    const publishersText = publishersLi
      ? (publishersLi.textContent || '')
          .replace(publishersH3?.textContent || '', '')
          .trim()
      : '';

    const yearLi = document.evaluate(
      config.year,
      root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;
    const yearA = yearLi?.querySelector('a');

    const tagsArr = Array.from(root.querySelectorAll(tags)).map((t) => ({
      name: t.textContent?.trim() || '',
      url: t.getAttribute('href') || '',
    }));

    return {
      title: titleText,
      rating: { value: ratingValue, count: ratingCount },
      alternateNames,
      author: {
        name: authorA?.textContent?.trim() || '',
        url: authorA?.getAttribute('href') || '',
      },
      genres: genresArr,
      status: {
        text: statusA?.textContent?.trim() || '',
        url: statusA?.getAttribute('href') || '',
      },
      publishers: publishersText,
      tags: tagsArr,
      year: {
        text: yearA?.textContent?.trim() || '',
        url: yearA?.getAttribute('href') || '',
      },
    };
  });
};

export const parseLatestChapter = (
  elements: Element[],
  config: DetailConfig['latest_chapter'],
) => {
  const { title, url, released } = config;

  return Array.from(elements).map((a) => ({
    title: a.querySelector(title)?.textContent?.trim() || '',
    url: a.querySelector(url)?.getAttribute('href') || '',
    released: a.querySelector(released)?.textContent?.trim() || '',
  }));
};

export const parseDescription = (
  elements: Element[],
  config: DetailConfig['description'],
) => {
  const { selector } = config;

  return Array.from(elements).map(
    (a) => a.querySelector(selector)?.textContent?.trim() || '',
  );
};

export const parseChapters = (
  elements: Element[],
  config: DetailConfig['chapters'],
) => {
  const { selector } = config;

  return Array.from(elements).map((a) =>
    Array.from(a.querySelectorAll(selector))?.map((chapter) => ({
      title: chapter.textContent?.trim() || '',
      url: chapter.getAttribute('href') || '',
    })),
  );
};

export const parseAuthorNovels = (
  elements: Element[],
  config: DetailConfig['author_novels'],
) => {
  const { img, coverAttr, title, chapter, selector } = config;

  return Array.from(elements).map((a) =>
    Array.from(a.querySelectorAll(selector))?.map((novel) => {
      const cover =
        coverAttr
          .map((attr) => novel.querySelector(img)?.getAttribute(attr))
          .find(Boolean) || '';

      return {
        title: novel.querySelector(title)?.textContent?.trim() || '',
        url: novel.getAttribute('href') || '',
        cover,
        chapter: novel.querySelector(chapter)?.textContent?.trim() || '',
      };
    }),
  );
};

export const parseCover = (
  elements: Element[],
  config: DetailConfig['cover'],
) => {
  const { img, attr } = config;

  return Array.from(elements).map((root) => {
    const cover =
      attr
        .map((attr) => root.querySelector(img)?.getAttribute(attr))
        .find(Boolean) || '';

    return {
      url: cover,
    };
  });
};

export type ReturnTypeOfParseDetail = ReturnType<typeof parseDetail>;
export type ReturnTypeOfParseLatestChapter = ReturnType<
  typeof parseLatestChapter
>;
export type ReturnTypeOfParseDescription = ReturnType<typeof parseDescription>;
export type ReturnTypeOfParseChapters = ReturnType<typeof parseChapters>;
export type ReturnTypeOfParseAuthorNovels = ReturnType<
  typeof parseAuthorNovels
>;

export type ReturnTypeOfParseCover = ReturnType<typeof parseCover>;
