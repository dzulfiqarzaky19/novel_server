export const LIST_CONFIG = {
  url: 'https://novlove.com/',

  selector: '#list-page .row',
  cover: {
    selector: 'img.cover',
    attributes: ['data-src', 'src'],
  },
  title: {
    selector: '.novel-title a',
    text: true,
    attr: 'title',
    href: true,
  },
  author: {
    selector: '.author',
    text: true,
  },
  latestChapter: {
    selector: '.chapter-title',
    text: true,
    href: true,
  },
} as const;

export type ListConfig = typeof LIST_CONFIG;
