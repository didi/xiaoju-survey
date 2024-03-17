import confirm from '../../components/confirm.vue';
import alert from '../../components/alert.vue';

import { isFunction as _isFunction } from 'lodash-es';

export default {
  install(Vue) {
    Vue.prototype.$dialog = {
      confirm(options) {
        const MyComponent = Vue.extend(confirm);
        const instance = new MyComponent({
          propsData: options,
        });
        const closeConfirm = () => {
          if (instance && instance.$el) {
            instance.$el.remove();
          }
        };
        instance.$on('cancel', () => {
          if (options?.onCancel && _isFunction(options.onCancel)) {
            options.onCancel(closeConfirm);
          } else {
            closeConfirm();
          }
        });
        instance.$on('confirm', () => {
          if (options?.onConfirm && _isFunction(options.onConfirm)) {
            options.onConfirm(closeConfirm);
          }
        });
        instance.$mount();
        document.body.append(instance.$el);
      },
      alert(options) {
        const MyComponent = Vue.extend(alert);
        const instance = new MyComponent({
          propsData: options,
        });
        const closeConfirm = () => {
          if (instance && instance.$el) {
            instance.$el.remove();
          }
        };
        instance.$on('confirm', () => {
          if (options?.onConfirm && _isFunction(options.onConfirm)) {
            options.onConfirm(closeConfirm);
          } else {
            closeConfirm();
          }
        });
        instance.$mount();
        document.body.append(instance.$el);
      },
    };
  },
};
