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
