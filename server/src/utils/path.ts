export const VITE_BASE = '/survey';
export function joinPath(...paths) {
  const joined = paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/+$/, ''); // 去掉结尾的斜杠，不动开头
      } else {
        return path.replace(/^\/+|\/+$/g, ''); // 中间项去头尾 /
      }
    })
    .filter(Boolean)
    .join('/');

  // 如果拼接后不以 / 开头，加上
  return joined.startsWith('/') ? joined : '/' + joined;
}
