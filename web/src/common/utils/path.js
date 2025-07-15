export function joinPath() {
  const args = Array.from(arguments)
  let withLeadingSlash = true

  // 如果最后一个参数是布尔值，说明用户显式指定是否加 /
  if (typeof args[args.length - 1] === 'boolean') {
    withLeadingSlash = args.pop()
  }

  const paths = args

  const joined = paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/+$/, '') // 第一项仅去掉结尾的 /
      } else {
        return path.replace(/^\/+|\/+$/g, '') // 其他项去掉头尾 /
      }
    })
    .filter(Boolean)
    .join('/')

  return withLeadingSlash ? (joined.startsWith('/') ? joined : '/' + joined) : joined
}
