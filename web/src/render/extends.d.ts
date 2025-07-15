import { joinPath } from '@/common/utils/path'

export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $base: string
    joinPath: typeof joinPath
  }
}
