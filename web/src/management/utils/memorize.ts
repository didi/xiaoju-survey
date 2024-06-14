const serialize = (obj: any): string => {
  if (obj == null) {
    return ''
  } else if (Array.isArray(obj)) {
    const items = obj.map((item) => serialize(item))
    return `[${items.join(',')}]`
  } else if (isPlainObject(obj)) {
    const keys = Object.keys(obj)
    keys.sort()
    const items = keys.map((key) => `${key}=${serialize(obj[key])}`)
    return `{${items.join('&')}}`
  } else if (typeof obj === 'object' && typeof obj.valueOf === 'function') {
    return serialize(obj.valueOf())
  } else {
    return obj + ''
  }
}

function isPlainObject(obj: Object) {
  const prototype = Object.getPrototypeOf(obj)
  return obj && typeof obj === 'object' && (prototype === null || prototype === Object.prototype)
}

/* 
 记忆函数：通过缓存函数的调用结果，
 使用场景：
 1. 相对固定的静态枚举数据，比如下拉框的数据，可以在初次请求的时候缓存在 js 对象中，避免每次请求服务器
 2. 输入参数决定输出的函数，利用函数缓存能避免重复计算
*/
export default function memorize(fn: Function) {
  const results: any = {}

  return (...args: any) => {
    const key = serialize(args)
    if (!(key in results)) {
      // @ts-ignore
      results[key] = fn.apply(this, args)
    }
    return results[key]
  }
}
