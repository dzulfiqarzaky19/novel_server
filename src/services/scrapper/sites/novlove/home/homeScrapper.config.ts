export const HOME_CONFIG = {
  url: 'https://novlove.com/',

  hot: {
    selector: '#index-novel-hot .item a',
    title: 'title',
    img: 'img',
    coverAttr: 'data-src',
    full: '.full-label',
  },

  latest: {
    selector: '#novel-list-index .row',
    title: '.col-title a',
    genre: '.col-genre a',
    chapter: '.col-chap a',
    updated: '.col-time',
    newTag: '.label-new',
  },

  completed: {
    selector: '#index-novel-completed .col-xs-4 a',
    title: 'title',
    img: 'img',
    coverAttr: 'data-src',
    chapterInfo: 'small',
  },

  genres: {
    selector: '#novel-list-index .list-genre .row a',
    title: 'title',
  },

  sorts: {
    selector: 'header .navbar-nav > li:nth-child(1) ul.dropdown-menu li a',
    title: 'title',
  },
} as const;

export type HomeConfig = typeof HOME_CONFIG;
