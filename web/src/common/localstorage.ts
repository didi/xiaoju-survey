interface ExtendedItem {
  value: any
  expires?: number // 可选属性
}

const localstorage = {
  // 检查是否支持localStorage
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'localStorage' in window
  },

  // 设置值
  setItem(key: string, value: any, expires?: number): void {
    if (!this.isSupported()) return

    let item: ExtendedItem = { value }

    if (expires !== undefined) {
      item = { ...item, expires: Date.now() + expires * 1000 }
    }

    const serializedValue = JSON.stringify(item)

    localStorage.setItem(key, serializedValue)
  },

  // 获取值
  getItem<T>(key: string): T | null {
    if (!this.isSupported()) return null

    const serializedValue = localStorage.getItem(key) as string
    if (!serializedValue) return null

    let item: any
    try {
      item = JSON.parse(serializedValue)
    } catch (e) {
      console.error('Error parsing JSON from localStorage')
      return null
    }

    if (item.expires && item.expires < Date.now()) {
      this.removeItem(key)
      return null
    }

    return item.value as T
  },

  // 移除值
  removeItem(key: string): void {
    if (!this.isSupported()) return

    localStorage.removeItem(key)
  }
}

export default localstorage
