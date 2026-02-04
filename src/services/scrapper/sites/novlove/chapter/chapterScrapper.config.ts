export const CHAPTER_CONFIG = {
  url: 'https://novlove.com/novel/',
  selector: '#chapter',
  title: '.novel-title',
  chapter_name: '.chr-text',
  prev_chapter: '#prev_chap',
  next_chapter: '#next_chap',
  chapter_content: '#chr-content',
  all_chapter: {
    click: 'button.chr-jump',
    selector: 'select.chr-jump option',
  },
} as const;

export type ChapterConfig = typeof CHAPTER_CONFIG;
