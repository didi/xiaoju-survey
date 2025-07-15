import { createI18n } from 'vue-i18n';
import en from './en.json';
import zh from './zh-Hans.json';
import zhHant from './zh-Hant.json'
import pt from './pt.json'

export type SupportedLocale = 'zh-Hans' | 'en'

const messages = {
  en,
  'zh-Hans': zh,
  'zh-Hant': zhHant,
  pt,
}

const i18n = createI18n({
  legacy: false,    // 使用Composition API风格
  locale: 'zh-Hans', // 默认语言
  fallbackLocale: 'en', // 回退语言
  globalInjection: true, // 启用全局$t
  messages,
});

// 使用：$t('message.hello', {}, { locale: 'zh-Hans' })

export default i18n;
