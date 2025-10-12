import { chapterSlugFromPath, toAbsolute, toPath } from '../url.js';

import { ReturnTypeOfParseChapter } from './chapterScrapper.parser.js';

const REGEX_NORMALIZER = {
  script_tags: /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  style_tags: /<style\b[^>]*>[\s\S]*?<\/style>/gi,
  inline_events: /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
  js_protocols:
    /\s(?:href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi,
  any_onload_loose:
    /\b(?:window\.)?onload\s*=\s*function\b[\s\S]*?(?:\}\s*;?|\Z)/gi,
  bgssp_lines: /^[^\n]*bg-ssp-10623[^\n]*$/gim,
  console_calls: /\bconsole\.(?:error|log|warn)\s*\([^)]*\)\s*;?/gi,
  bare_error_calls: /\berror\s*\([^)]*\)\s*;?/gi,
  pubadxtag: /window\.pubadxtag[\s\S]*?;?/gi,
  pubfuture: /window\.pubfuturetag[\s\S]*?};?/gi,
  js_only_lines: /^[ \t]*[);{}\]]+[ \t]*;?[ \t]*$/gm,
  css_rules: /\.[a-zA-Z0-9_-]+\s*{[^}]*}/g,
  smart_quotes: /[\u201C\u201D]/g,
  multi_spaces: /[ \t]{2,}/g,
  control_else_chunk: /\}\s*else\s*\{\s*/g,
  href_else_chunk: /\bhref\s*\}\s*else\s*\{\s*/gi,
  control_stub_lines: /^[ \t]*(?:else\s*\{|\}|{\s*|\);?|;)[ \t]*$/gim,
  brace_runs_inline: /[{}]+/g,
};

const normalizeChapterText = (raw: string): string =>
  String(raw)
    .replace(REGEX_NORMALIZER.script_tags, '')
    .replace(REGEX_NORMALIZER.style_tags, '')
    .replace(REGEX_NORMALIZER.inline_events, '')
    .replace(REGEX_NORMALIZER.js_protocols, '')
    .replace(REGEX_NORMALIZER.any_onload_loose, '')
    .replace(REGEX_NORMALIZER.bgssp_lines, '')
    .replace(REGEX_NORMALIZER.console_calls, '')
    .replace(REGEX_NORMALIZER.bare_error_calls, '')
    .replace(REGEX_NORMALIZER.pubadxtag, '')
    .replace(REGEX_NORMALIZER.pubfuture, '')
    .replace(REGEX_NORMALIZER.js_only_lines, '')
    .replace(REGEX_NORMALIZER.css_rules, '')
    .replace(REGEX_NORMALIZER.smart_quotes, '"')
    .replace(REGEX_NORMALIZER.multi_spaces, ' ')
    .replace(REGEX_NORMALIZER.href_else_chunk, ' ')
    .replace(REGEX_NORMALIZER.control_else_chunk, ' ')
    .replace(REGEX_NORMALIZER.control_stub_lines, '')
    .replace(REGEX_NORMALIZER.brace_runs_inline, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

export const normalizeChapter = (raws: ReturnTypeOfParseChapter) => {
  const raw = raws[0];

  if (!raw) {
    return [];
  }

  return {
    title: raw.title,
    chapter_name: raw.chapter_name,
    prev_chapter: {
      absoluteUrl: toAbsolute(raw.prev_chapter),
      path: toPath(raw.prev_chapter),
      slug: chapterSlugFromPath(toPath(raw.prev_chapter)),
    },
    next_chapter: {
      absoluteUrl: toAbsolute(raw.next_chapter),
      path: toPath(raw.next_chapter),
      slug: chapterSlugFromPath(toPath(raw.next_chapter)),
    },
    content: normalizeChapterText(raw.content),
  };
};
