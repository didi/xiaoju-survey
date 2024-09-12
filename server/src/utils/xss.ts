import xss from 'xss';

const myxss = new (xss as any).FilterXSS({
  onIgnoreTagAttr(tag, name, value) {
    if (name === 'style' || name === 'class') {
      return `${name}="${value}"`;
    }
    return undefined;
  },
  onIgnoreTag(tag, html) {
    // <xxx>过滤为空，否则不过滤为空
    const re1 = new RegExp('<.+?>', 'g');
    if (re1.test(html)) {
      return '';
    } else {
      return html;
    }
  },
});

export const cleanRichTextWithMediaTag = (text) => {
  if (!text) {
    return text === 0 ? 0 : '';
  }
  const html = transformHtmlTag(text)
    .replace(/<img([\w\W]+?)\/>/g, '[图片]')
    .replace(/<video.*\/video>/g, '[视频]');
  const content = html.replace(/<[^<>]+>/g, '').replace(/&nbsp;/g, '');

  return content;
};

export function escapeHtml(html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export const transformHtmlTag = (html) => {
  if (!html) return '';
  if (typeof html !== 'string') return html + '';
  return html
    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\\n/g, '\\n');
  //.replace(/&nbsp;/g, "")
};

const filterXSSClone = myxss.process.bind(myxss);

export const filterXSS = (html) => filterXSSClone(transformHtmlTag(html));

export const escapeFilterXSS = (html) => escapeHtml(filterXSS(html));
