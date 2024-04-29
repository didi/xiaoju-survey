import ConfirmDialog from '../../components/ConfirmDialog.vue'
import AlertDialog from '../../components/AlertDialog.vue'

import { isFunction as _isFunction } from 'lodash-es'

export default {
  install(Vue) {
    Vue.prototype.$dialog = {
      confirm(options) {
        const MyComponent = Vue.extend(ConfirmDialog)
        const instance = new MyComponent({
          propsData: options
        })
        const closeConfirm = () => {
          if (instance && instance.$el) {
            instance.$el.remove()
          }
        }
        instance.$on('cancel', () => {
          if (options?.onCancel && _isFunction(options.onCancel)) {
            options.onCancel(closeConfirm)
          } else {
            closeConfirm()
          }
        })
        instance.$on('confirm', () => {
          if (options?.onConfirm && _isFunction(options.onConfirm)) {
            options.onConfirm(closeConfirm)
          }
        })
        instance.$mount()
        document.body.append(instance.$el)
      },
      alert(options) {
        const MyComponent = Vue.extend(AlertDialog)
        const instance = new MyComponent({
          propsData: options
        })
        const closeConfirm = () => {
          if (instance && instance.$el) {
            instance.$el.remove()
          }
        }
        instance.$on('confirm', () => {
          if (options?.onConfirm && _isFunction(options.onConfirm)) {
            options.onConfirm(closeConfirm)
          } else {
            closeConfirm()
          }
        })
        instance.$mount()
        document.body.append(instance.$el)
      }
    }
  }
}
