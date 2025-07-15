import { joinPath } from '@/common/utils/path'
import { I18n } from 'vue-i18n'

export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $base: string
    joinPath: typeof joinPath
    $t: I18n['t']
    $i18n: I18n
  }
}
