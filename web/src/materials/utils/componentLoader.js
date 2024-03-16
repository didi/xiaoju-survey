import { cloneDeep as _cloneDeep } from 'lodash-es';
export default class ComponentLoader {
  constructor(options = {}) {
    const { componentList, lifeCycle } = options;
    this.components = {}; // 已加载组件
    this.componentInfoList = componentList || [];
    if (lifeCycle) {
      this.lifeCycle = lifeCycle;
    }
  }

  async loadComponent(type, path) {
    if (this.components[type]) {
      return { type, component: this.components[type] };
    } else {
      let count = 0;
      const load = async () => {
        try {
          count++;
          const res = await this.dynamicImport(path);
          const index = _cloneDeep(
            res.default.components && res.default.components.Index
          );
          const component = index ? index : res.default;
          if (!component.name) {
            // console.error(`组件：${type} 未定义 name`)
            component.name = path || type;
          }
          component.path = path;
          this.components[type] = component;
          if (this.lifeCycle?.onComponentLoaded) {
            this.lifeCycle?.onComponentLoaded.call(this, {
              component,
              type,
              meta: res.meta,
            });
          }
          return { type, component };
        } catch (error) {
          if (count < 3) {
            return await load();
          }
        }
      };

      const result = await load();
      return result;
    }
  }

  loadComponents(componentList) {
    if (componentList === undefined) {
      componentList = this.componentInfoList;
    }
    return Promise.all(
      componentList.map((item) => this.loadComponent(item.type, item.path))
    );
  }
}
