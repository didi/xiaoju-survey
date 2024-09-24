export default function (skinConfig: any) {
  const root = document.documentElement
  const { themeConf, backgroundConf, contentConf } = skinConfig

  if (themeConf?.color) {
    // 设置主题颜色
    root.style.setProperty('--primary-color', themeConf?.color)
  }

  // 设置背景
  const { color, type, image } = backgroundConf || {}
  root.style.setProperty(
    '--primary-background',
    type === 'image' ? `url(${image}) no-repeat center / cover` : color
  )

  if (contentConf?.opacity.toString()) {
    // 设置全局透明度
    root.style.setProperty('--opacity', `${contentConf.opacity / 100}`)
  }
}
