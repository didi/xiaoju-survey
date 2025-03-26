import { Dimensions, Platform } from 'react-native';

export const isValidUrl = (url: string) => {
  const pattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return pattern.test(url);
};

export const scale = (pix: number) => {
  const { width } = Dimensions.get('window');
  const scaleWith = width / 750;
  if (pix === 1 && Platform.OS === 'ios') {
    return pix;
  }
  return pix * scaleWith;
};

const unescape = (html: string) => {
  if (!html) return '';
  if (typeof html !== 'string') return html + '';
  return html
    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\\n/g, '\\n');
};

const isImg = (html: string) => {
  html = html + '';
  return html.indexOf('<img') > -1;
};

const isVideo = (html: string) => {
  html = html + '';
  return html.indexOf('<video') > -1;
};

export const cleanRichText = (text: string) => {
  if (!text) return '';
  const html = unescape(text);
  const content = html.replace(/<[^<>]+>/g, '');
  if (content) return content;
  if (isImg(html)) return '图片';
  if (isVideo(html)) return '视频';
  return '文本';
};

export const mapToObject = (map: Map<string, any>) => {
  const result: any = {};
  for (const [key, value] of map) {
    result[key] = value;
  }
  return result;
};
