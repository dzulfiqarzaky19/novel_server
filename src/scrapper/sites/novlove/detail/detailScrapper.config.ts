const X_ALT =
  './/ul[contains(@class,"info-meta")]/li[h3[normalize-space()="Alternative names:"] or h3[normalize-space()="Alternate names:"]]';
const X_AUTH =
  './/ul[contains(@class,"info-meta")]/li[h3[normalize-space()="Author:"]]';
const X_GENRE =
  './/ul[contains(@class,"info-meta")]/li[h3[normalize-space()="Genre:"]]';
const X_STATUS =
  './/ul[contains(@class,"info-meta")]/li[h3[normalize-space()="Status:"]]';
const X_PUB =
  './/ul[contains(@class,"info-meta")]/li[h3[normalize-space()="Publishers:"]]';
const X_YEAR =
  './/ul[contains(@class,"info-meta")]/li[h3[normalize-space()="Year of publishing:"]]';

export const DETAIL_CONFIG = {
  url: 'https://novlove.com/novel/',
  selector: '#novel',

  cover: {
    selector: '.book',
    img: 'img',
    attr: ['data-src', 'src'],
  },
  detail: {
    selector: '.desc',
    title: '.title',
    rating: {
      value: '.rate-info [itemprop="ratingValue"]',
      count: '.rate-info [itemprop="reviewCount"]',
    },
    alternateNames: X_ALT,
    author: X_AUTH,
    genres: X_GENRE,
    status: X_STATUS,
    publishers: X_PUB,
    tags: '.tag-container a',
    year: X_YEAR,
    li: '.info-meta li',
  },

  latest_chapter: {
    title: '.item-value a',
    url: '.item-value a',
    released: '.item-time',
  },

  description: {
    selector: '#tab-description',
  },

  chapters: {
    selector: '#tab-chapters .list-chapter li a',
  },

  author_novels: {
    selector: '#tab-author .row a',
    img: 'img',
    coverAttr: ['data-src', 'src'],
    title: 'h3',
    chapter: 'small',
  },
} as const;

export type DetailConfig = typeof DETAIL_CONFIG;
