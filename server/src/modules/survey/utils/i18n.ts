import { I18nService } from 'nestjs-i18n';

/**
 * 递归翻译对象中所有以 "i18n:" 开头的字符串
 * @param obj 要处理的对象
 * @param i18n 从外部传入的 I18nService 实例
 * @returns 翻译后的对象（Promise）
 */
export async function translateI18nKeys<T>(
  obj: T,
  i18n: I18nService,
  options?: { lang?: string }, // 新增语言选项
): Promise<T> {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return Promise.all(
        obj.map((item) => translateI18nKeys(item, i18n, options)),
      ) as Promise<T>;
    } else {
      const result = {} as T;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = await translateI18nKeys(obj[key], i18n, options);
        }
      }
      return result;
    }
  } else if (typeof obj === 'string') {
    const trimmedValue = obj.trim();
    if (trimmedValue.startsWith('i18n:')) {
      const translationKey = trimmedValue.slice(5).trim();
      return i18n.translate(translationKey, {
        lang: options?.lang, // 传入目标语言
      }) as Promise<any>;
    }
  }
  return obj;
}
