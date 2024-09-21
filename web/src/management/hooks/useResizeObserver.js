// 引入防抖函数
import { debounce } from 'lodash-es'
/**
 * @description: 监听元素尺寸变化
 * @param {*} el 元素dom
 * @param {*} cb resize变化时执行的方法
 * @param {*} wait 防抖间隔
 * @return {*}
 */
export default (el, cb, wait = 200) => {
  const resizeObserver = new ResizeObserver(debounce(cb, wait))

  resizeObserver.observe(el)

  const destroy = () => {
    resizeObserver.disconnect(el)
  }

  return { destroy, resizeObserver }
}
