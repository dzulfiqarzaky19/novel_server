import {
  chapterSlugFromPath,
  slugFromPath,
  toAbsolute,
  toPath,
} from '../url.js';

import { ListNovel, NormalizedListNovel } from './listScrapper.model.js';

export const normalizeList = (listNovel: ListNovel[]): NormalizedListNovel[] =>
  listNovel.map((list) => {
    const path = toPath(list.url);
    const chapterPath = toPath(list.latestChapter.url);

    return {
      title: list.title,
      author: list.author,
      absoluteUrl: toAbsolute(list.url),
      path,
      slug: slugFromPath(path),
      coverAbsoluteUrl: toAbsolute(list.cover),
      latestChapter: {
        title: list.latestChapter.title,
        absoluteUrl: toAbsolute(list.latestChapter.url),
        path: chapterPath,
        chapterSlug: chapterSlugFromPath(chapterPath),
      },
    };
  });
