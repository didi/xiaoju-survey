export const replaceFileKey = (
  originStr: string,
  arr: Array<{ key; value }>,
) => {
  let retStr = originStr;
  for (const { key, value } of arr) {
    if (value) {
      retStr = retStr.replace(new RegExp(`{${key}}`), value);
    }
  }
  return retStr;
};
