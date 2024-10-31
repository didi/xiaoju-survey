export const DEFTAULT_ITEM_HEIGHT = 44

// 兼容pc 移动端
export const HAS_TOUCH = 'ontouchstart' in window
export const START_EVENT = HAS_TOUCH ? 'touchstart' : 'mousedown'
export const MOVE_EVENT = HAS_TOUCH ? 'touchmove' : 'mousemove'
export const END_EVENT = HAS_TOUCH ? 'touchend' : 'mouseup'

export const getClient = (e:any) => {
  const clientX = HAS_TOUCH ? e.changedTouches[0].clientX : e.clientX
  const clientY = HAS_TOUCH ? e.changedTouches[0].clientY : e.clientY
  return {
    x: clientX,
    y: clientY
  }
}

export const isPC = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}