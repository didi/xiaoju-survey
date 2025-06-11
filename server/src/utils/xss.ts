// server/src/utils/xss.ts

import { FilterXSS } from 'xss';

const xssFilter = new FilterXSS({
  onIgnoreTagAttr(tag, name, value) {
    if (name === 'style' || name === 'class') {
      return `${name}="${value}"`;
    }
    return undefined;
  },
  onIgnoreTag(tag, html) {
    // 如果标签包含其它标签则全剔除，否则保留原文
    const re1 = /<.+?>/g;
    return re1.test(html) ? '' : html;
  }
});

const isImg = (html: any): boolean => {
  return String(html).indexOf('<img') > -1;
};
const isVideo = (html: any): boolean => {
  return String(html).indexOf('<video') > -1;
};

export function cleanRichTextWithMediaTag(text: any): string {
  if (!text && text !== 0) return '';
  const html = transformHtmlTag(text)
    .replace(/<img([\w\W]+?)\/>/g, '[图片]')
    .replace(/<video.*<\/video>/g, '[视频]');
  return html.replace(/<[^<>]+>/g, '').replace(/&nbsp;/g, '');
}

export function cleanRichText(text: any): string {
  if (!text && text !== 0) return '';
  const html = transformHtmlTag(text);
  const content = html.replace(/<[^<>]+>/g, '').replace(/&nbsp;/g, '');
  if (content) return content;
  if (isImg(html)) return '图片';
  if (isVideo(html)) return '视频';
  return '文本';
}

export function escapeHtml(html: string): string {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function transformHtmlTag(html: any): string {
  if (html === null || html === undefined) return '';
  const s = String(html);
  return s
    .replace(/&(?!#?\w+;)/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\\n/g, '\\n');
}

export function filterXSS(html: string): string {
  // 先做统一的实体 & 转义，再走 xss 过滤
  const cleansed = xssFilter.process(transformHtmlTag(html));
  return cleansed;
}

export function escapeFilterXSS(html: string): string {
  // 先 xss 过滤／实体处理，再把 <> 转义成 &lt;&gt;
  return escapeHtml(filterXSS(html));
}

