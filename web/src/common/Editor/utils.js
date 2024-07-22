// px 转换为 rem
const pxToRem = (px) => {
  return `${(parseFloat(px) / 50).toFixed(2)}rem`
}

// 图片style的宽高改成rem
export const replacePxWithRem = (html) => {
  const imgRegex = /<img[^>]*style=["'][^"']*\b(?:width|height):\s*\d+(\.\d+)?px[^"']*["'][^>]*>/gi
  const styleRegex = /style="([^"]*)"/g
  if (!imgRegex.test(html)) {
    return html
  }

  const res = html.replaceAll(imgRegex, (imgHtml) => {
    return imgHtml.replace(styleRegex, (match, content) => {
      let styleContent = content
      const pxRegex = /(width|height):\s*(\d+(\.\d+)?)px/g

      styleContent = styleContent.replace(pxRegex, (pxMatch, prop, value) => {
        return `${prop}: ${pxToRem(value)}`
      })

      return `style="${styleContent}"`
    })
  })

  return res
}
